// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IYieldProtocol
 * @notice Interface for external yield-generating protocols
 */
interface IYieldProtocol {
    function deposit(uint256 amount) external returns (uint256 shares);
    function withdraw(uint256 shares) external returns (uint256 amount);
    function balanceOf(address account) external view returns (uint256);
    function convertToAssets(uint256 shares) external view returns (uint256);
}

/**
 * @title IMantleCoopVault
 * @notice Interface for MantleCoopVault used by SocialLending
 */
interface IMantleCoopVault {
    struct MemberInfo {
        uint256 totalContributions;
        uint256 totalWithdrawals;
        uint256 joinTimestamp;
        uint256 lastActivityTime;
        bool isActive;
        uint256 lifetimeYieldEarned;
    }
    
    function members(address) external view returns (uint256, uint256, uint256, uint256, bool, uint256);
    function getMemberValue(address) external view returns (uint256);
    function convertToShares(uint256) external view returns (uint256);
    function convertToAssets(uint256) external view returns (uint256);
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function asset() external view returns (address);
}
