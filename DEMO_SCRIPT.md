# 🎬 CryptoSplit - Demo Script (3 minutes)

## Intro (30 seconds)

"Hi! I'm presenting **CryptoSplit** - a decentralized bill splitter on Ethereum."

**Show the frontend on screen**

"Ever split a dinner bill with friends and struggle to track who paid? CryptoSplit solves this with blockchain transparency."

## Problem Statement (30 seconds)

"Traditional bill splitting apps:"

- ❌ Centralized - you trust the app
- ❌ No transparency - can't verify payments
- ❌ Multiple payment methods - Venmo, PayPal, cash...
- ❌ Trust issues - did they really pay?

"CryptoSplit uses Ethereum smart contracts to make it trustless and transparent."

## Demo (90 seconds)

### 1. Connect Wallet (15 seconds)

_Click "Connect Wallet"_
"First, I connect my MetaMask wallet. This authenticates me on-chain."

### 2. Create Bill (30 seconds)

_Fill in the form_

- Description: "Team Pizza Night"
- Amount: 0.03 ETH (≈ $75)
- Add 3 wallet addresses

_Click "Create Bill"_
"I'm creating a bill to split $75 between 3 people. The smart contract automatically calculates 0.01 ETH per person."

_Approve MetaMask transaction_
"Transaction confirmed! Bill created on-chain."

### 3. View Bills (15 seconds)

_Switch to "My Bills" tab_
"Here I can see all my bills - ones I created and ones I need to pay."

### 4. Pay Share (30 seconds)

_Click on the bill > Pay My Share_
"Now Alice pays her share. The smart contract ensures she can only pay once."

_Approve transaction_
"Payment confirmed! The smart contract tracks this on-chain."

## Technical Highlights (30 seconds)

**Show code briefly**
"Under the hood:"

- ✅ **Solidity Smart Contract** - immutable business logic
- ✅ **Tested with Foundry** - 5/5 tests passing
- ✅ **Zero backend** - completely decentralized
- ✅ **Multi-chain ready** - works on any EVM chain

## Closing (30 seconds)

"CryptoSplit makes bill splitting:"

- ✅ **Trustless** - smart contract enforces rules
- ✅ **Transparent** - all payments on-chain
- ✅ **Simple** - familiar UI, Web3 backend
- ✅ **Secure** - battle-tested patterns

"View the contract on Etherscan, test on Sepolia testnet, or run locally."

"Thank you! Questions?"

---

## Quick Setup for Live Demo

```bash
# One command to start everything
./setup.sh

# Then open browser to http://localhost:8000
```

---

## Key Points to Emphasize

1. **No Trust Required** - Smart contract holds and releases funds
2. **Complete Transparency** - Anyone can verify payments on-chain
3. **Production Ready** - Tested, documented, deployable
4. **Real Use Case** - Everyone splits bills!

---

## If Asked Technical Questions

**Q: Why blockchain for this?**
A: Trust and transparency. Traditional apps can manipulate data. Blockchain provides immutable proof of payment.

**Q: What about gas fees?**
A: Deploy on L2s like Polygon for <$0.01 transactions. Or bundle payments.

**Q: How does it scale?**
A: Smart contract is simple and gas-optimized. Can handle thousands of bills.

**Q: Future features?**
A: ERC20 token support, recurring payments, group management, mobile app, NFT receipts.

---

## Backup Demo (if live demo fails)

Have screenshots or video recording ready showing:

1. ✅ Tests passing
2. ✅ Contract deployed
3. ✅ Bill creation
4. ✅ Payment flow
5. ✅ Etherscan verification
