# MantleCoop

Social-collateralized lending protocol built on Mantle Network. Community-driven DeFi that combines traditional collateral with social credit scoring.

## ✅ Live on Mantle Sepolia

**Network**: Mantle Sepolia Testnet  
**Status**: All contracts deployed & verified  
**Gas Used**: 0.787 MNT

### Deployed Contracts

```
TestnetUSDC:       0x45639B93D48754ec21266c745e968930EB8b4BB6
YieldStrategy:     0xd3549d47D09b485d3921E5169596deB47158b490
MantleCoopVault:   0x64C9197f7051b6908d3a9FEe5b4369ff24E1e21B
SocialLending:     0x747F40796cD10E72718fC801d3466B03F1755398
```

[View on Explorer](https://explorer.sepolia.mantle.xyz)

## Features

- 🏦 **ERC4626 Vault** - Deposit USDC, earn yield
- 💰 **Social Lending** - Borrow against collateral + credit score
- 📊 **Yield Strategy** - Automated yield generation (10% APY)
- 🤝 **Community Fees** - 1% fee supports the cooperative
- ⚡ **Low Gas** - Built on Mantle's L2 for cheap transactions

## Quick Start

```bash
# Clone
git clone https://github.com/bethwel3001/mantlecoop.git
cd mantlecoop/contracts

# Install
forge install

# Build
forge build

# Test
forge test

# Deploy
forge script script/Deploy.s.sol --rpc-url https://rpc.sepolia.mantle.xyz --broadcast
```

## Documentation

- [Deployment Guide](docs/DEPLOY.md) - Full deployment instructions
- [Contracts README](contracts/README.md) - Smart contract details
- [Integration Updates](docs/INTEGRATION_UPDATES.md) - Integration notes

## Architecture

1. **MantleCoopVault** - Core ERC4626 vault for deposits
2. **YieldStrategy** - Generates yield on deposited assets
3. **SocialLending** - Lending with collateral + credit scoring
4. **TestnetUSDC** - Mock USDC for testing

## Network Info

- **Chain ID**: 5003
- **RPC**: https://rpc.sepolia.mantle.xyz
- **Explorer**: https://explorer.sepolia.mantle.xyz
- **Faucet**: https://faucet.sepolia.mantle.xyz

## License

MIT
