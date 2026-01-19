# Adapter Pattern Implementation for Multiple Yield Strategies

## Overview

The Adapter Pattern allows the MantleCoop system to integrate with multiple external yield protocols (Agni Finance, Merchant Moe, Mantle Staking) through a unified `IYieldProtocol` interface. Each adapter translates protocol-specific calls into the standard interface.

## Architecture

```
┌─────────────────────────┐
│   MantleCoopVault       │
│   (Uses IYieldProtocol) │
└───────────┬─────────────┘
            │
            │ Unified Interface
            ▼
    ┌───────────────────┐
    │  IYieldProtocol   │
    │  - deposit()      │
    │  - withdraw()     │
    │  - balanceOf()    │
    │  - convertToAssets()│
    └───────────────────┘
            │
    ┌───────┴────────┬──────────────┐
    │                │              │
    ▼                ▼              ▼
┌─────────┐   ┌──────────┐   ┌──────────┐
│  Agni   │   │Merchant  │   │ Mantle   │
│ Adapter │   │   Moe    │   │ Staking  │
│         │   │ Adapter  │   │ Adapter  │
└────┬────┘   └────┬─────┘   └────┬─────┘
     │             │              │
     ▼             ▼              ▼
┌─────────┐   ┌──────────┐   ┌──────────┐
│  Agni   │   │Merchant  │   │  mETH    │
│ Finance │   │   Moe    │   │ Staking  │
│  DEX    │   │  Vault   │   │ Protocol │
└─────────┘   └──────────┘   └──────────┘
```

## 1. AgniFinanceAdapter - DEX Liquidity Pools

### Purpose
Adapts Agni Finance DEX liquidity pools (USDC-USDT) to the IYieldProtocol interface.

### Key Features
- **Splits deposits** 50-50 between USDC and USDT
- **Adds liquidity** to stable pair pool
- **Returns LP tokens** as "shares"
- **Calculates value** from pool reserves

### Implementation Details

```solidity
contract AgniFinanceAdapter is ReentrancyGuard {
    IAgniRouter public router;      // DEX router for liquidity operations
    IAgniPool public pool;          // LP token contract
    IERC20 public tokenA;           // USDC
    IERC20 public tokenB;           // USDT
    address public vault;           // Only vault can call
    
    // Implements IYieldProtocol
    function deposit(uint256 amount) external onlyVault returns (uint256) {
        // Split amount 50-50
        uint256 halfAmount = amount / 2;
        
        // Transfer both tokens from vault
        tokenA.transferFrom(vault, address(this), halfAmount);
        tokenB.transferFrom(vault, address(this), halfAmount);
        
        // Add liquidity to pool
        (,, uint256 liquidity) = router.addLiquidity(
            address(tokenA),
            address(tokenB),
            halfAmount,
            halfAmount,
            (halfAmount * 98) / 100,  // 2% slippage
            (halfAmount * 98) / 100,
            address(this),
            block.timestamp + 300
        );
        
        return liquidity;  // LP tokens = shares
    }
    
    function withdraw(uint256 shares) external onlyVault returns (uint256) {
        // Remove liquidity
        (uint256 amountA, uint256 amountB) = router.removeLiquidity(
            address(tokenA),
            address(tokenB),
            shares,
            0, 0,
            vault,
            block.timestamp + 300
        );
        
        return amountA + amountB;  // Total value returned
    }
    
    function convertToAssets(uint256 shares) external view returns (uint256) {
        (uint112 reserve0, uint112 reserve1,) = pool.getReserves();
        uint256 totalSupply = pool.totalSupply();
        
        // Proportional share of reserves
        uint256 amount0 = (uint256(reserve0) * shares) / totalSupply;
        uint256 amount1 = (uint256(reserve1) * shares) / totalSupply;
        
        return amount0 + amount1;
    }
}
```

### Use Case
- **Stable yield** from trading fees
- **Low impermanent loss** (stable pair)
- **High liquidity** for quick withdrawals

---

## 2. MerchantMoeAdapter - Yield Vaults

### Purpose
Adapts Merchant Moe ERC4626 yield vaults to the IYieldProtocol interface.

### Key Features
- **Direct ERC4626 integration** (already share-based)
- **Simple pass-through** adapter
- **Leverages existing vault logic**

### Implementation Details

```solidity
contract MerchantMoeAdapter is ReentrancyGuard {
    IMerchantMoeVault public moeVault;  // External yield vault
    IERC20 public asset;                // Underlying asset
    address public vault;               // Only vault can call
    
    // Implements IYieldProtocol
    function deposit(uint256 amount) external onlyVault returns (uint256) {
        // Transfer assets from vault
        asset.transferFrom(vault, address(this), amount);
        
        // Deposit into Moe vault
        asset.approve(address(moeVault), amount);
        uint256 shares = moeVault.deposit(amount);
        
        return shares;
    }
    
    function withdraw(uint256 shares) external onlyVault returns (uint256) {
        // Withdraw from Moe vault
        uint256 assets = moeVault.withdraw(shares);
        
        // Transfer back to vault
        asset.transfer(vault, assets);
        
        return assets;
    }
    
    function balanceOf(address account) external view returns (uint256) {
        return moeVault.balanceOf(account);
    }
    
    function convertToAssets(uint256 shares) external view returns (uint256) {
        return moeVault.convertToAssets(shares);  // Direct pass-through
    }
}
```

### Use Case
- **Automated yield strategies** managed by Merchant Moe
- **Compounding returns**
- **Professional risk management**

---

## 3. MantleStakingAdapter - Liquid Staking

### Purpose
Adapts Mantle's mETH liquid staking protocol to the IYieldProtocol interface.

### Key Features
- **ETH → mETH staking**
- **Withdrawal queue** management
- **Handles async withdrawals**

### Implementation Details

```solidity
contract MantleStakingAdapter is ReentrancyGuard {
    IMantleStaking public mantleStaking;
    address public vault;
    
    mapping(uint256 => WithdrawRequest) public withdrawRequests;
    uint256 public nextRequestId;
    
    struct WithdrawRequest {
        address requester;
        uint256 shares;
        uint256 timestamp;
        bool claimed;
    }
    
    // Implements IYieldProtocol
    function deposit(uint256 amount) external payable onlyVault returns (uint256) {
        require(msg.value == amount, "ETH mismatch");
        
        // Stake ETH for mETH
        uint256 mETHReceived = mantleStaking.stake{value: amount}();
        
        return mETHReceived;  // mETH = shares
    }
    
    function withdraw(uint256 shares) external onlyVault returns (uint256) {
        // Request withdrawal (enters queue)
        uint256 requestId = mantleStaking.requestWithdraw(shares);
        
        // Track request
        withdrawRequests[nextRequestId] = WithdrawRequest({
            requester: vault,
            shares: shares,
            timestamp: block.timestamp,
            claimed: false
        });
        
        nextRequestId++;
        return requestId;
    }
    
    function claimWithdraw(uint256 requestId) external onlyVault {
        WithdrawRequest storage request = withdrawRequests[requestId];
        require(!request.claimed, "Already claimed");
        
        // Claim after waiting period
        mantleStaking.claimWithdraw(requestId);
        request.claimed = true;
        
        // Transfer ETH back to vault
        (bool success,) = vault.call{value: address(this).balance}("");
        require(success, "ETH transfer failed");
    }
    
    function convertToAssets(uint256 shares) external view returns (uint256) {
        // mETH trades at premium (staking rewards)
        return (shares * 102) / 100;  // Assume 2% yield
    }
    
    receive() external payable {}
}
```

### Use Case
- **ETH staking rewards** (~4-5% APY)
- **Liquid staking** (mETH is tradeable)
- **Network security** participation

---

## 4. YieldStrategyManager - Multi-Strategy Orchestration

### Purpose
Manages multiple adapters and automatically allocates funds based on APY performance.

### Key Features
- **Multi-strategy tracking**
- **Automatic rebalancing**
- **APY-based allocation**
- **Risk limits per strategy**

### Implementation Details

```solidity
contract YieldStrategyManager is AccessControl, ReentrancyGuard {
    bytes32 public constant STRATEGY_MANAGER_ROLE = keccak256("STRATEGY_MANAGER_ROLE");
    
    address[] public activeStrategies;
    mapping(address => StrategyInfo) public strategies;
    
    struct StrategyInfo {
        string name;
        address adapter;
        uint256 allocatedAmount;
        uint256 shares;
        uint256 lastAPY;
        bool isActive;
        StrategyType strategyType;
    }
    
    enum StrategyType {
        LiquidityPool,    // AgniFinanceAdapter
        YieldVault,       // MerchantMoeAdapter
        LiquidStaking     // MantleStakingAdapter
    }
    
    uint256 public maxStrategyAllocation = 4000;  // 40% max per strategy
    uint256 public minAPYThreshold = 300;         // 3% minimum APY
    
    function addStrategy(
        address adapter,
        string calldata name,
        StrategyType strategyType
    ) external onlyRole(STRATEGY_MANAGER_ROLE) {
        strategies[adapter] = StrategyInfo({
            name: name,
            adapter: adapter,
            allocatedAmount: 0,
            shares: 0,
            lastAPY: 0,
            isActive: true,
            strategyType: strategyType
        });
        
        activeStrategies.push(adapter);
    }
    
    function rebalance() external onlyRole(STRATEGY_MANAGER_ROLE) {
        _updateAllAPYs();
        
        // Find best performing strategy
        address bestStrategy;
        uint256 bestAPY = 0;
        
        for (uint256 i = 0; i < activeStrategies.length; i++) {
            if (strategies[activeStrategies[i]].lastAPY > bestAPY) {
                bestAPY = strategies[activeStrategies[i]].lastAPY;
                bestStrategy = activeStrategies[i];
            }
        }
        
        // Reallocate from underperforming strategies
        for (uint256 i = 0; i < activeStrategies.length; i++) {
            address strategyAddr = activeStrategies[i];
            if (strategyAddr == bestStrategy) continue;
            
            StrategyInfo storage strategy = strategies[strategyAddr];
            
            // If APY difference > 2% and below minimum
            if (bestAPY > strategy.lastAPY + 200 && 
                strategy.lastAPY < minAPYThreshold) {
                
                // Withdraw 25% and reallocate
                uint256 sharesToMove = strategy.shares / 4;
                uint256 amount = this.deallocateFromStrategy(strategyAddr, sharesToMove);
                this.allocateToStrategy(bestStrategy, amount);
            }
        }
    }
}
```

---

## Integration Flow

### 1. Setup Phase
```solidity
// Deploy adapters
AgniFinanceAdapter agniAdapter = new AgniFinanceAdapter(router, pool, usdc, usdt, vault);
MerchantMoeAdapter moeAdapter = new MerchantMoeAdapter(moeVault, usdc, vault);
MantleStakingAdapter stakeAdapter = new MantleStakingAdapter(mantleStaking, vault);

// Deploy manager
YieldStrategyManager manager = new YieldStrategyManager(vault, usdc);

// Register strategies
manager.addStrategy(address(agniAdapter), "Agni USDC-USDT", StrategyType.LiquidityPool);
manager.addStrategy(address(moeAdapter), "Merchant Moe Vault", StrategyType.YieldVault);
manager.addStrategy(address(stakeAdapter), "mETH Staking", StrategyType.LiquidStaking);
```

### 2. Allocation Phase
```solidity
// Allocate 40% to each strategy
manager.allocateToStrategy(address(agniAdapter), 400_000e6);   // 400k USDC
manager.allocateToStrategy(address(moeAdapter), 400_000e6);    // 400k USDC
manager.allocateToStrategy(address(stakeAdapter), 200 ether);  // 200 ETH
```

### 3. Rebalancing Phase
```solidity
// Automatic rebalancing based on APY
manager.rebalance();  // Moves funds from low APY to high APY strategies
```

---

## Benefits of Adapter Pattern

### 1. **Unified Interface**
- Vault doesn't need to know protocol-specific details
- Easy to add new protocols

### 2. **Risk Diversification**
- Spread funds across multiple protocols
- Reduce single-point-of-failure risk

### 3. **Automatic Optimization**
- Rebalance based on performance
- Maximize yield automatically

### 4. **Modularity**
- Add/remove strategies without changing vault
- Test strategies independently

### 5. **Protocol Abstraction**
- Handle different withdrawal mechanisms (instant vs queued)
- Normalize share calculations
- Manage protocol-specific quirks

---

## Usage Example

```solidity
// Vault automatically uses best strategy
vault.deposit(1000e6, alice);  // Deposits 1000 USDC

// Manager allocates to best performing adapter
// - If Agni has 8% APY → allocate there
// - If Merchant Moe has 12% APY → reallocate there
// - If mETH has 5% APY → keep minimum allocation

// Harvest yield from all strategies
manager.rebalance();  // Optimizes allocation

// Withdraw works seamlessly
vault.withdraw(500e6, alice, alice);  // Pulls from most liquid strategy
```

---

## Comparison Table

| Feature | AgniFinanceAdapter | MerchantMoeAdapter | MantleStakingAdapter |
|---------|-------------------|-------------------|---------------------|
| **Asset Type** | USDC + USDT | USDC | ETH |
| **Yield Source** | Trading fees | Automated strategies | Staking rewards |
| **APY Range** | 3-8% | 8-15% | 4-6% |
| **Withdrawal** | Instant | Instant | Queued (7 days) |
| **Risk Level** | Low | Medium | Low |
| **Liquidity** | High | High | Medium |
| **Complexity** | Medium | Low | High |

---

## Conclusion

The Adapter Pattern enables MantleCoop to:
1. **Integrate multiple yield sources** seamlessly
2. **Optimize returns** through automatic rebalancing
3. **Manage risk** through diversification
4. **Scale easily** by adding new adapters
5. **Maintain clean architecture** with separation of concerns

This design makes the system flexible, maintainable, and optimized for maximum yield generation.
