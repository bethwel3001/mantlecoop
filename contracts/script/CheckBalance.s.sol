// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";

contract CheckBalance is Script {
    function run() external view {
        address wallet = vm.addr(vm.envUint("PRIVATE_KEY"));
        uint256 balance = wallet.balance;
        
        console.log("Address:", wallet);
        console.log("Balance:", balance);
        console.log("Balance (MNT):", balance / 1e18);
    }
}
