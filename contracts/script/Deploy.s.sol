// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/TestnetUSDC.sol";
import "../src/YealdStrategy.sol";
import "../src/MantleCoopVault.sol";
import "../src/SocialLending.sol";

contract DeployMantleCoop is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Deployment parameters
        string memory coopName = vm.envString("COOP_NAME");
        string memory shareName = vm.envString("SHARE_NAME");
        string memory shareSymbol = vm.envString("SHARE_SYMBOL");
        uint256 communityFeeRate = vm.envUint("COMMUNITY_FEE_RATE");
        uint256 maxLTV = vm.envUint("MAX_LTV");
        uint256 baseInterestRate = vm.envUint("BASE_INTEREST_RATE");
        uint256 latePenaltyRate = vm.envUint("LATE_PENALTY_RATE");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy USDC (testnet only)
        console.log("Deploying TestnetUSDC...");
        TestnetUSDC usdc = new TestnetUSDC();
        console.log("USDC deployed at:", address(usdc));
        
        // 2. Deploy YieldStrategy
        console.log("Deploying YieldStrategy...");
        YieldStrategy yieldStrategy = new YieldStrategy(address(usdc));
        console.log("YieldStrategy deployed at:", address(yieldStrategy));
        
        // 3. Deploy MantleCoopVault
        console.log("Deploying MantleCoopVault...");
        MantleCoopVault vault = new MantleCoopVault(
            usdc,
            coopName,
            shareName,
            shareSymbol,
            communityFeeRate,
            address(yieldStrategy)
        );
        console.log("MantleCoopVault deployed at:", address(vault));
        
        // 4. Deploy SocialLending
        console.log("Deploying SocialLending...");
        SocialLending lending = new SocialLending(
            address(vault),
            address(usdc),
            maxLTV,
            baseInterestRate,
            latePenaltyRate
        );
        console.log("SocialLending deployed at:", address(lending));
        
        // 5. Approve lending contract in vault
        console.log("Approving lending contract...");
        vault.approveLending(address(lending));
        console.log("Lending approved!");
        
        vm.stopBroadcast();
        
        // Print summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("USDC:", address(usdc));
        console.log("YieldStrategy:", address(yieldStrategy));
        console.log("MantleCoopVault:", address(vault));
        console.log("SocialLending:", address(lending));
        console.log("========================\n");
    }
}
