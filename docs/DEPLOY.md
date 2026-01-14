# MantleCoop Deployment Guide

## ✅ Live Deployment (Mantle Sepolia)

**Deployed on**: Block 33436278-33436290  
**Total Gas Used**: 0.787 MNT  
**Status**: All contracts verified ✅

### Contract Addresses

```
TestnetUSDC:       0x45639B93D48754ec21266c745e968930EB8b4BB6
YieldStrategy:     0xd3549d47D09b485d3921E5169596deB47158b490
MantleCoopVault:   0x64C9197f7051b6908d3a9FEe5b4369ff24E1e21B
SocialLending:     0x747F40796cD10E72718fC801d3466B03F1755398
```

### Network Details

- **Network**: Mantle Sepolia
- **Chain ID**: 5003
- **RPC**: https://rpc.sepolia.mantle.xyz
- **Explorer**: https://explorer.sepolia.mantle.xyz
- **Faucet**: https://faucet.sepolia.mantle.xyz

## Deploy Command

```bash
forge script script/Deploy.s.sol \
  --rpc-url https://rpc.sepolia.mantle.xyz \
  --broadcast \
  --verify
```

## Environment Variables

Create `.env` file:

```env
PRIVATE_KEY=0x...

COOP_NAME=MantleCoop
SHARE_NAME=MantleCoop Shares
SHARE_SYMBOL=MCOOP

COMMUNITY_FEE_RATE=100      # 1%
MAX_LTV=8000                # 80%
BASE_INTEREST_RATE=50       # 0.5%
LATE_PENALTY_RATE=50        # 0.5%
```

## Deployment Order

1. **TestnetUSDC** - Mock USDC token
2. **YieldStrategy** - Yield generation (linked to USDC)
3. **MantleCoopVault** - Core vault (linked to USDC + YieldStrategy)
4. **SocialLending** - Lending protocol (linked to Vault + USDC)
5. **Approve Lending** - Wire lending contract to vault

## Verification

Contracts auto-verify on Sourcify. For manual verification:

```bash
forge verify-contract <ADDRESS> <CONTRACT_NAME> \
  --chain-id 5003 \
  --verifier sourcify
```
