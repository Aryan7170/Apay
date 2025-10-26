#!/bin/bash

echo "🚀 CryptoSplit - Complete Setup & Demo Script"
echo "=============================================="
echo ""

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not found. Installing..."
    curl -L https://foundry.paradigm.xyz | bash
    foundryup
fi

# Run tests
echo "📝 Step 1: Running tests..."
forge test
if [ $? -ne 0 ]; then
    echo "❌ Tests failed!"
    exit 1
fi
echo "✅ All tests passed!"
echo ""

# Start Anvil in background
echo "⛓️  Step 2: Starting local blockchain (Anvil)..."
anvil > /dev/null 2>&1 &
ANVIL_PID=$!
echo "✅ Anvil started (PID: $ANVIL_PID)"
sleep 2
echo ""

# Deploy contract
echo "📤 Step 3: Deploying contract..."
DEPLOY_OUTPUT=$(forge script script/Deploy.s.sol \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast 2>&1)

CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep "BillSplitter deployed to:" | awk '{print $4}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "❌ Deployment failed!"
    kill $ANVIL_PID
    exit 1
fi

echo "✅ Contract deployed at: $CONTRACT_ADDRESS"
echo ""

# Update frontend
echo "🎨 Step 4: Updating frontend..."
sed -i.bak "s/let CONTRACT_ADDRESS = \".*\"/let CONTRACT_ADDRESS = \"$CONTRACT_ADDRESS\"/" frontend/app.js
rm frontend/app.js.bak 2>/dev/null
echo "✅ Frontend updated!"
echo ""

# Start frontend server
echo "🌐 Step 5: Starting frontend server..."
cd frontend
python3 -m http.server 8000 > /dev/null 2>&1 &
FRONTEND_PID=$!
cd ..
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "=============================================="
echo "✨ Setup Complete! ✨"
echo "=============================================="
echo ""
echo "📝 Contract Address: $CONTRACT_ADDRESS"
echo "🌐 Frontend URL: http://localhost:8000"
echo "⛓️  RPC URL: http://localhost:8545"
echo "🔑 Test Account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:8000 in your browser"
echo "2. Install MetaMask if you haven't"
echo "3. Add Localhost network to MetaMask:"
echo "   - Network Name: Localhost"
echo "   - RPC URL: http://localhost:8545"
echo "   - Chain ID: 31337"
echo "   - Currency: ETH"
echo "4. Import test account with private key:"
echo "   0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo "5. Connect wallet and start splitting bills!"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $ANVIL_PID $FRONTEND_PID 2>/dev/null; echo '✅ Done!'; exit 0" INT
wait
