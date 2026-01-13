// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./Interfaces.sol";

/**
 * @title IMantleStaking
 * @notice Interface for Mantle's mETH liquid staking
 */
interface IMantleStaking {
    function stake() external payable returns (uint256);
    function requestWithdraw(uint256 shares) external returns (uint256);
    function claimWithdraw(uint256 requestId) external;
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title MantleCoopVault
 * @notice ERC-4626 compliant vault for cooperative savings with real yield strategies
 * @dev Integrates with Mantle Network protocols for yield generation
 */
contract MantleCoopVault is ERC4626, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SECRETARY_ROLE = keccak256("SECRETARY_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    
    string public coopName;
    uint256 public totalYieldEarned;
    uint256 public communityFeeRate;
    uint256 public reserveFund;
    
    uint256 public constant MIN_DEPLOYMENT_AMOUNT = 100e6;
    uint256 public constant LIQUIDITY_BUFFER_PERCENT = 20;
    uint256 public deployedAssets;
    
    IYieldProtocol public yieldProtocol;
    address public mantleStaking;
    address public approvedLending;
    
    mapping(address => MemberInfo) public members;
    address[] public memberList;
    
    struct MemberInfo {
        uint256 totalContributions;
        uint256 totalWithdrawals;
        uint256 joinTimestamp;
        uint256 lastActivityTime;
        bool isActive;
        uint256 lifetimeYieldEarned;
    }
    
    uint256 public lastHarvestTimestamp;
    uint256 public totalHarvests;
    
    event YieldDeployed(address indexed protocol, uint256 amount, uint256 timestamp);
    event YieldHarvested(uint256 grossYield, uint256 netYield, uint256 fees);
    event YieldWithdrawn(address indexed protocol, uint256 amount);
    event CommunityFeeCollected(uint256 amount);
    event MemberJoined(address indexed member, uint256 timestamp);
    event EmergencyWithdrawal(address indexed member, uint256 amount);
    event BufferRebalanced(uint256 newBuffer, uint256 deployed);
    event LendingApproved(address indexed lending);
    
    constructor(
        IERC20 _asset,
        string memory _coopName,
        string memory _shareName,
        string memory _shareSymbol,
        uint256 _communityFeeRate,
        address _yieldProtocol
    ) 
        ERC4626(_asset)
        ERC20(_shareName, _shareSymbol)
    {
        require(_communityFeeRate <= 500, "Fee too high");
        
        coopName = _coopName;
        communityFeeRate = _communityFeeRate;
        yieldProtocol = IYieldProtocol(_yieldProtocol);
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(TREASURER_ROLE, msg.sender);
        
        lastHarvestTimestamp = block.timestamp;
    }
    
    function deposit(uint256 assets, address receiver) 
        public 
        virtual 
        override 
        nonReentrant 
        whenNotPaused 
        returns (uint256 shares) 
    {
        require(assets > 0, "Zero deposit");
        
        if (!members[receiver].isActive) {
            _addMember(receiver);
        }
        
        uint256 fee = (assets * communityFeeRate) / 10000;
        uint256 netAssets = assets - fee;
        
        shares = previewDeposit(netAssets);
        _deposit(msg.sender, receiver, netAssets, shares);
        
        members[receiver].totalContributions += assets;
        members[receiver].lastActivityTime = block.timestamp;
        
        if (fee > 0) {
            reserveFund += fee;
            IERC20(asset()).transferFrom(msg.sender, address(this), fee);
            emit CommunityFeeCollected(fee);
        }
        
        _rebalanceBuffer();
        
        return shares;
    }
    
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) 
        public 
        virtual 
        override 
        nonReentrant 
        returns (uint256 shares) 
    {
        uint256 availableLiquidity = IERC20(asset()).balanceOf(address(this));
        
        if (assets > availableLiquidity) {
            uint256 needed = assets - availableLiquidity;
            _withdrawFromYieldProtocol(needed);
        }
        
        shares = super.withdraw(assets, receiver, owner);
        
        members[owner].totalWithdrawals += assets;
        members[owner].lastActivityTime = block.timestamp;
        
        return shares;
    }
    
    function approveLending(address lending) external onlyRole(ADMIN_ROLE) {
        require(lending != address(0), "Zero address");
        approvedLending = lending;
        IERC20(asset()).approve(lending, type(uint256).max);
        emit LendingApproved(lending);
    }
    
    function _rebalanceBuffer() internal {
        uint256 currentBalance = IERC20(asset()).balanceOf(address(this));
        uint256 totalManaged = currentBalance + deployedAssets;
        uint256 targetBuffer = (totalManaged * LIQUIDITY_BUFFER_PERCENT) / 100;
        
        if (currentBalance > targetBuffer + MIN_DEPLOYMENT_AMOUNT) {
            uint256 deployAmount = currentBalance - targetBuffer;
            _deployToYieldProtocol(deployAmount);
        }
    }
    
    function _deployToYieldProtocol(uint256 amount) internal {
        require(amount >= MIN_DEPLOYMENT_AMOUNT, "Below minimum");
        
        IERC20(asset()).approve(address(yieldProtocol), amount);
        yieldProtocol.deposit(amount);
        
        deployedAssets += amount;
        
        emit YieldDeployed(address(yieldProtocol), amount, block.timestamp);
    }
    
    function _withdrawFromYieldProtocol(uint256 amount) internal {
        uint256 shares = yieldProtocol.balanceOf(address(this));
        require(shares > 0, "No deployed assets");
        
        uint256 totalDeployedValue = yieldProtocol.convertToAssets(shares);
        uint256 sharesToWithdraw = (amount * shares) / totalDeployedValue;
        
        uint256 withdrawn = yieldProtocol.withdraw(sharesToWithdraw);
        deployedAssets -= withdrawn;
        
        emit YieldWithdrawn(address(yieldProtocol), withdrawn);
    }
    
    function harvestYield() 
        external 
        onlyRole(TREASURER_ROLE)
        nonReentrant
        returns (uint256 netYield)
    {
        uint256 protocolShares = yieldProtocol.balanceOf(address(this));
        require(protocolShares > 0, "Nothing deployed");
        
        uint256 currentValue = yieldProtocol.convertToAssets(protocolShares);
        
        require(currentValue > deployedAssets, "No yield generated");
        uint256 grossYield = currentValue - deployedAssets;
        
        uint256 yieldShares = (protocolShares * grossYield) / currentValue;
        uint256 harvestedAmount = yieldProtocol.withdraw(yieldShares);
        
        uint256 fees = (harvestedAmount * communityFeeRate) / 10000;
        netYield = harvestedAmount - fees;
        
        reserveFund += fees;
        totalYieldEarned += netYield;
        deployedAssets = currentValue - harvestedAmount;
        lastHarvestTimestamp = block.timestamp;
        totalHarvests++;
        
        emit YieldHarvested(grossYield, netYield, fees);
        emit CommunityFeeCollected(fees);
        
        return netYield;
    }
    
    function rebalanceStrategy(uint256 amountToDeployOrWithdraw, bool isDeployment) 
        external 
        onlyRole(TREASURER_ROLE)
        nonReentrant
    {
        if (isDeployment) {
            uint256 available = IERC20(asset()).balanceOf(address(this));
            require(available >= amountToDeployOrWithdraw, "Insufficient balance");
            _deployToYieldProtocol(amountToDeployOrWithdraw);
        } else {
            _withdrawFromYieldProtocol(amountToDeployOrWithdraw);
        }
        
        emit BufferRebalanced(
            IERC20(asset()).balanceOf(address(this)),
            deployedAssets
        );
    }
    
    function getMemberValue(address member) external view returns (uint256) {
        uint256 shares = balanceOf(member);
        return convertToAssets(shares);
    }
    
    function getMemberYield(address member) external view returns (uint256) {
        uint256 currentValue = this.getMemberValue(member);
        uint256 netContributions = members[member].totalContributions - 
                                    members[member].totalWithdrawals;
        
        if (currentValue > netContributions) {
            return currentValue - netContributions;
        }
        return 0;
    }
    
    function getCurrentAPY() external view returns (uint256) {
        if (totalHarvests == 0 || lastHarvestTimestamp == 0) return 0;
        
        uint256 timeElapsed = block.timestamp - lastHarvestTimestamp;
        if (timeElapsed == 0) return 0;
        
        uint256 averageYieldPerSecond = totalYieldEarned / timeElapsed;
        uint256 totalAssets = totalAssets();
        
        if (totalAssets == 0) return 0;
        
        return (averageYieldPerSecond * 365 days * 10000) / totalAssets;
    }
    
    function getVaultStats() external view returns (
        uint256 totalValue,
        uint256 liquidAssets,
        uint256 deployed,
        uint256 memberCount,
        uint256 apy
    ) {
        totalValue = totalAssets();
        liquidAssets = IERC20(asset()).balanceOf(address(this));
        deployed = deployedAssets;
        memberCount = memberList.length;
        apy = this.getCurrentAPY();
    }
    
    function totalAssets() public view virtual override returns (uint256) {
        uint256 liquidAssets = IERC20(asset()).balanceOf(address(this));
        
        uint256 deployedValue = deployedAssets;
        if (deployedAssets > 0) {
            uint256 protocolShares = yieldProtocol.balanceOf(address(this));
            if (protocolShares > 0) {
                deployedValue = yieldProtocol.convertToAssets(protocolShares);
            }
        }
        
        return liquidAssets + deployedValue;
    }
    
    function _addMember(address member) internal {
        if (!members[member].isActive) {
            members[member].isActive = true;
            members[member].joinTimestamp = block.timestamp;
            members[member].lastActivityTime = block.timestamp;
            memberList.push(member);
            
            emit MemberJoined(member, block.timestamp);
        }
    }
    
    function getMemberCount() external view returns (uint256) {
        return memberList.length;
    }
    
    function setYieldProtocol(address newProtocol) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(newProtocol != address(0), "Zero address");
        require(deployedAssets == 0, "Withdraw first");
        yieldProtocol = IYieldProtocol(newProtocol);
    }
    
    function setCommunityFeeRate(uint256 newRate) 
        external 
        onlyRole(ADMIN_ROLE) 
    {
        require(newRate <= 500, "Fee too high");
        communityFeeRate = newRate;
    }
    
    function withdrawReserveFund(uint256 amount, address recipient) 
        external 
        onlyRole(ADMIN_ROLE)
        nonReentrant
    {
        require(amount <= reserveFund, "Insufficient reserve");
        reserveFund -= amount;
        IERC20(asset()).transfer(recipient, amount);
    }
    
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
