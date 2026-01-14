// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Interfaces.sol";

/**
 * @title YieldStrategy
 * @notice Mock yield strategy implementing IYieldProtocol interface
 */
contract YieldStrategy is IYieldProtocol, ReentrancyGuard {
    IERC20 public asset;
    uint256 public constant MOCK_APY = 1000; // 10% APY
    
    mapping(address => uint256) public shares;
    mapping(address => uint256) public depositTime;
    uint256 public totalShares;
    uint256 public totalAssets;
    
    constructor(address _asset) {
        asset = IERC20(_asset);
    }
    
    /**
     * @notice Deposit assets and receive shares
     */
    function deposit(uint256 amount) external nonReentrant returns (uint256 newShares) {
        require(amount > 0, "Zero amount");
        
        asset.transferFrom(msg.sender, address(this), amount);
        
        // Calculate shares
        newShares = totalShares == 0 ? amount : (amount * totalShares) / totalAssets;
        
        shares[msg.sender] += newShares;
        totalShares += newShares;
        totalAssets += amount;
        
        if (depositTime[msg.sender] == 0) {
            depositTime[msg.sender] = block.timestamp;
        }
        
        return newShares;
    }
    
    /**
     * @notice Withdraw assets by burning shares, includes accrued yield
     */
    function withdraw(uint256 sharesToWithdraw) external nonReentrant returns (uint256 amount) {
        require(sharesToWithdraw > 0, "Zero shares");
        require(shares[msg.sender] >= sharesToWithdraw, "Insufficient shares");
        
        // Calculate amount with yield
        uint256 baseAmount = _convertToAssets(sharesToWithdraw);
        uint256 timeElapsed = block.timestamp - depositTime[msg.sender];
        uint256 yieldAmount = (baseAmount * MOCK_APY * timeElapsed) / (10000 * 365 days);
        
        amount = baseAmount + yieldAmount;
        
        shares[msg.sender] -= sharesToWithdraw;
        totalShares -= sharesToWithdraw;
        totalAssets = totalAssets > baseAmount ? totalAssets - baseAmount : 0;
        
        if (shares[msg.sender] == 0) {
            depositTime[msg.sender] = 0;
        }
        
        asset.transfer(msg.sender, amount);
        return amount;
    }
    
    /**
     * @notice Get share balance of account
     */
    function balanceOf(address account) external view returns (uint256) {
        return shares[account];
    }
    
    /**
     * @notice Convert shares to asset value
     */
    function convertToAssets(uint256 shareAmount) external view returns (uint256) {
        return _convertToAssets(shareAmount);
    }
    
    /**
     * @notice Internal helper to convert shares to assets
     */
    function _convertToAssets(uint256 shareAmount) internal view returns (uint256) {
        if (totalShares == 0) return shareAmount;
        return (shareAmount * totalAssets) / totalShares;
    }
}
