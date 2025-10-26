# QUICKSTART - Deploy in 5 Minutes! ⚡

## 1. Test the Contract (30 seconds)

```bash
forge test
```

You should see all tests passing ✅

## 2. Deploy Locally (2 minutes)

### Terminal 1 - Start Local Blockchain

```bash
anvil
```

Keep this running. You'll see test accounts with ETH.

### Terminal 2 - Deploy Contract

```bash
forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

**Copy the contract address** from the output!

## 3. Update Frontend (30 seconds)

Open `frontend/app.js` and update line 17:

```javascript
let CONTRACT_ADDRESS = "0xYOUR_CONTRACT_ADDRESS_HERE";
```

## 4. Run Frontend (1 minute)

```bash
cd frontend
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser.

## 5. Connect MetaMask to Local Network

1. Open MetaMask
2. Add Network:

   - Network Name: `Localhost`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `31337`
   - Currency: `ETH`

3. Import test account:
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

## 6. Test the App! 🎉

1. Click "Connect Wallet"
2. Create a bill
3. Add participant addresses (use other Anvil test accounts)
4. Pay shares
5. Withdraw funds

---

## Deploy to Testnet (Optional)

### Sepolia Testnet

1. Get Sepolia ETH from [faucet](https://sepoliafaucet.com/)

2. Create `.env` file:

```bash
PRIVATE_KEY=your_private_key_without_0x
```

3. Deploy:

```bash
source .env
forge script script/Deploy.s.sol \
  --rpc-url https://sepolia.infura.io/v3/YOUR_INFURA_KEY \
  --private-key $PRIVATE_KEY \
  --broadcast
```

4. Update `frontend/app.js` with the new contract address

5. Switch MetaMask to Sepolia network

6. Use the app on testnet!

---

## Troubleshooting

**"Insufficient funds"**: Make sure you have ETH in your wallet

**"User rejected transaction"**: Click approve in MetaMask

**"Contract not found"**: Make sure you updated the contract address in `app.js`

**Anvil not responding**: Restart Anvil and redeploy

---

## Quick Commands Reference

```bash
# Test
forge test

# Test with details
forge test -vvv

# Start local node
anvil

# Deploy locally
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Run frontend
cd frontend && python3 -m http.server 8000

# Check contract on local
cast call YOUR_CONTRACT_ADDRESS "billCounter()" --rpc-url http://localhost:8545
```

---

**That's it! You're ready to demo! 🚀**
