# MantleCoop Smart Contracts

Social-collateralized lending protocol built on Mantle Network.

## Deployed Contracts (Mantle Sepolia)

- **TestnetUSDC**: `0x45639B93D48754ec21266c745e968930EB8b4BB6`
- **YieldStrategy**: `0xd3549d47D09b485d3921E5169596deB47158b490`
- **MantleCoopVault**: `0x64C9197f7051b6908d3a9FEe5b4369ff24E1e21B`
- **SocialLending**: `0x747F40796cD10E72718fC801d3466B03F1755398`

All contracts verified on Sourcify ✅

## Quick Start

```bash
# Install dependencies
forge install

# Build
forge build

# Test
forge test

# Deploy to Mantle Sepolia
forge script script/Deploy.s.sol --rpc-url https://rpc.sepolia.mantle.xyz --broadcast --verify
```

## Architecture

1. **TestnetUSDC** - Mock USDC for testing
2. **YieldStrategy** - Yield generation (10% APY mock)
3. **MantleCoopVault** - Core vault with ERC4626 shares
4. **SocialLending** - Collateralized lending with credit scoring

See [DEPLOY.md](./DEPLOY.md) for full deployment guide.
