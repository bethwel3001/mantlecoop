// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol"

/**
 * @title YieldStrategy
 * @notice Mock yield strategy for demonstration
 */
contract YieldStrategy {
    IERC20 public asset;
    uint256 public constant MOCK_APY = 1000; // 10% APY
    
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public depositTime;
    
    constructor(address _asset) {
        asset = IERC20(_asset);
    }
    
    function deposit(uint256 amount) external {
        asset.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] += amount;
        depositTime[msg.sender] = block.timestamp;
    }
    
    function withdraw() external returns (uint256) {
        uint256 principal = deposits[msg.sender];
        uint256 timeElapsed = block.timestamp - depositTime[msg.sender];
        uint256 yield = (principal * MOCK_APY * timeElapsed) / (10000 * 365 days);
        
        uint256 total = principal + yield;
        deposits[msg.sender] = 0;
        
        asset.transfer(msg.sender, total);
        return total;
    }
    
    function getBalance(address user) external view returns (uint256) {
        uint256 principal = deposits[user];
        uint256 timeElapsed = block.timestamp - depositTime[user];
        uint256 yield = (principal * MOCK_APY * timeElapsed) / (10000 * 365 days);
        return principal + yield;
    }
}