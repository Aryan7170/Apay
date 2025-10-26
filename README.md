# CryptoSplit - Decentralized Bill Splitter

> Split bills with friends using Web3. Trustless. Transparent. Simple.

A fully decentralized Web3 application for splitting bills with friends using cryptocurrency.

## 🚀 Features

- ✅ **Create Bills**: Split any amount between multiple people
- ✅ **Smart Contract Based**: Fully on-chain, no backend needed
- ✅ **Track Payments**: See who has paid and who hasn't
- ✅ **Withdraw Funds**: Creators can withdraw collected payments
- ✅ **Multi-Chain Support**: Works on Ethereum, Polygon, and testnets
- ✅ **Transparent**: All transactions verifiable on-chain

## 🏗️ Architecture

### Smart Contract (`BillSplitter.sol`)

- Manages bill creation and splitting logic
- Tracks participants and payments
- Handles fund collection and withdrawal
- Fully tested with Foundry

### Frontend

- Vanilla JavaScript with ethers.js
- Clean, responsive UI
- Real-time blockchain interaction

## 📦 Quick Start

### 1. Test Smart Contract

```shell
forge test
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### 2. Deploy Contract

#### Local (Anvil)

```shell
# Terminal 1: Start local node
anvil

# Terminal 2: Deploy
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
```

#### Testnet (Sepolia)

```shell
export PRIVATE_KEY=your_private_key
forge script script/Deploy.s.sol --rpc-url https://sepolia.infura.io/v3/YOUR_KEY --private-key $PRIVATE_KEY --broadcast
```

### 3. Update Frontend

After deployment, update `frontend/app.js`:

```javascript
let CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

### 4. Run Frontend

```shell
cd frontend
python3 -m http.server 8000
```

Open http://localhost:8000

## 🎮 How to Use

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask
2. **Create Bill**: Enter description, amount, add participant addresses
3. **Pay Share**: Participants view the bill and pay their share
4. **Withdraw**: Creator withdraws collected funds

## 📝 Contract Functions

- `createBill()` - Create a new bill split
- `payShare()` - Pay your portion of the bill
- `withdrawFunds()` - Withdraw collected payments (creator only)
- `getBill()` - View bill details
- `hasPaid()` - Check if someone paid

## 🔒 Security Features

- ✅ Reentrancy protection
- ✅ Participant validation
- ✅ Double payment prevention
- ✅ Access control
- ✅ Automatic refunds

## 🌐 Supported Networks

- Ethereum Mainnet/Sepolia
- Polygon/Mumbai
- Any EVM-compatible chain

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity 0.8.20
- **Development**: Foundry
- **Frontend**: HTML/CSS/JavaScript
- **Web3**: ethers.js v5

## 📂 Project Structure

```
Apay/
├── contracts/BillSplitter.sol    # Main contract
├── script/Deploy.s.sol            # Deployment
├── test/BillSplitter.t.sol        # Tests
├── frontend/
│   ├── index.html                 # UI
│   └── app.js                     # Web3 logic
└── README.md
```

## 📄 License

MIT

---

Built with ❤️ for Web3
