// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title MantleCoopVault
 * @notice ERC-4626 compliant vault for cooperative savings with automated yield
 * @dev Implements share-based accounting with yield distribution
 */
contract MantleCoopVault is ERC4626, AccessControl, ReentrancyGuard, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant SECRETARY_ROLE = keccak256("SECRETARY_ROLE");
    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");
    
    // Cooperative metadata
    string public coopName;
    uint256 public totalYieldEarned;
    uint256 public communityFeeRate; // in basis points (100 = 1%)
    uint256 public reserveFund;
    
    // Member tracking
    mapping(address => MemberInfo) public members;
    address[] public memberList;
    
    struct MemberInfo {
        uint256 totalContributions;
        uint256 totalWithdrawals;
        uint256 lastActivityTime;
        bool isActive;
    }
    
    // Events
    event YieldHarvested(uint256 amount, uint256 timestamp);
    event CommunityFeeCollected(uint256 amount);
    event MemberJoined(address indexed member, uint256 timestamp);
    event EmergencyWithdrawal(address indexed member, uint256 amount);
    
    constructor(
        IERC20 _asset,
        string memory _coopName,
        string memory _shareName,
        string memory _shareSymbol,
        uint256 _communityFeeRate
    ) 
        ERC4626(_asset)
        ERC20(_shareName, _shareSymbol)
    {
        coopName = _coopName;
        communityFeeRate = _communityFeeRate;
        
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(TREASURER_ROLE, msg.sender);
    }
    
    /**
     * @notice Override deposit to track member activity
     */
    function deposit(uint256 assets, address receiver) 
        public 
        virtual 
        override 
        nonReentrant 
        whenNotPaused 
        returns (uint256 shares) 
    {
        // Add member if first deposit
        if (!members[receiver].isActive) {
            _addMember(receiver);
        }
        
        // Standard ERC-4626 deposit
        shares = super.deposit(assets, receiver);
        
        // Update member info
        members[receiver].totalContributions += assets;
        members[receiver].lastActivityTime = block.timestamp;
        
        // Collect community fee
        uint256 fee = (assets * communityFeeRate) / 10000;
        if (fee > 0) {
            reserveFund += fee;
            emit CommunityFeeCollected(fee);
        }
        
        return shares;
    }
    
    /**
     * @notice Override withdraw to track member activity
     */
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
        shares = super.withdraw(assets, receiver, owner);
        
        members[owner].totalWithdrawals += assets;
        members[owner].lastActivityTime = block.timestamp;
        
        return shares;
    }
    
    /**
     * @notice Harvest yield from external protocols
     * @dev Called by treasurer to update vault value
     */
    function harvestYield(uint256 yieldAmount) 
        external 
        onlyRole(TREASURER_ROLE) 
    {
        require(yieldAmount > 0, "No yield to harvest");
        
        totalYieldEarned += yieldAmount;
        
        // Transfer yield to vault (assumes yield is in same asset)
        IERC20(asset()).transferFrom(msg.sender, address(this), yieldAmount);
        
        emit YieldHarvested(yieldAmount, block.timestamp);
    }
    
    /**
     * @notice Get member's total value including yield
     */
    function getMemberValue(address member) external view returns (uint256) {
        uint256 shares = balanceOf(member);
        return convertToAssets(shares);
    }
    
    /**
     * @notice Get member's yield earned
     */
    function getMemberYield(address member) external view returns (uint256) {
        uint256 currentValue = this.getMemberValue(member);
        uint256 netContributions = members[member].totalContributions - 
                                    members[member].totalWithdrawals;
        
        if (currentValue > netContributions) {
            return currentValue - netContributions;
        }
        return 0;
    }
    
    /**
     * @notice Add new member to cooperative
     */
    function _addMember(address member) internal {
        if (!members[member].isActive) {
            members[member].isActive = true;
            members[member].lastActivityTime = block.timestamp;
            memberList.push(member);
            
            emit MemberJoined(member, block.timestamp);
        }
    }
    
    /**
     * @notice Get total number of active members
     */
    function getMemberCount() external view returns (uint256) {
        return memberList.length;
    }
    
    /**
     * @notice Emergency pause
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }
    
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }
}
