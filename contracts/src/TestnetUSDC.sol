// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TestnetUSDC
 * @notice USDC stablecoin for testnet deployment
 */
contract TestnetUSDC is ERC20, Ownable {
    constructor() ERC20("USD Coin", "USDC") Ownable(msg.sender) {
        _mint(msg.sender, 10000000 * 10**6); // Mint 10 million USDC to deployer
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    function faucet(uint256 amount) external {
        require(amount <= 10000 * 10**6, "Max 10,000 USDC per request");
        _mint(msg.sender, amount);
    }
}
