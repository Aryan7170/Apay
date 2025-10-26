// Contract ABI
const CONTRACT_ABI = [
  "function createBill(string memory _description, address[] memory _participants) external payable returns (uint256)",
  "function payShare(uint256 _billId) external payable",
  "function withdrawFunds(uint256 _billId) external",
  "function getBill(uint256 _billId) external view returns (address creator, string memory description, uint256 totalAmount, uint256 amountPerPerson, address[] memory participants, uint256 totalPaid, bool isActive)",
  "function hasPaid(uint256 _billId, address _user) external view returns (bool)",
  "function allPaid(uint256 _billId) external view returns (bool)",
  "function billCounter() external view returns (uint256)",
  "event BillCreated(uint256 indexed billId, address indexed creator, string description, uint256 totalAmount, uint256 participantCount)",
  "event PaymentMade(uint256 indexed billId, address indexed payer, uint256 amount)",
  "event BillCompleted(uint256 indexed billId)",
];

// UPDATE THIS AFTER DEPLOYMENT!
let CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Localhost default

// Network configs
const NETWORKS = {
  31337: { name: "Localhost", explorer: "http://localhost:8545" },
  11155111: { name: "Sepolia", explorer: "https://sepolia.etherscan.io" },
  80001: { name: "Mumbai", explorer: "https://mumbai.polygonscan.com" },
  137: { name: "Polygon", explorer: "https://polygonscan.com" },
};

let provider;
let signer;
let contract;
let userAddress;
let chainId;

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    showStatus("Please install MetaMask!", "error");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();

    const network = await provider.getNetwork();
    chainId = network.chainId;

    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    document.getElementById("connectBtn").style.display = "none";
    document.getElementById("walletInfo").style.display = "block";
    document.getElementById("walletAddress").textContent =
      userAddress.slice(0, 6) + "..." + userAddress.slice(-4);

    const networkName = NETWORKS[chainId]?.name || `Chain ${chainId}`;
    document.getElementById(
      "networkInfo"
    ).textContent = `Network: ${networkName}`;

    const explorerUrl = NETWORKS[chainId]?.explorer || "https://etherscan.io";
    const contractLink = document.getElementById("contractLink");
    contractLink.href = `${explorerUrl}/address/${CONTRACT_ADDRESS}`;
    contractLink.textContent =
      CONTRACT_ADDRESS.slice(0, 6) + "..." + CONTRACT_ADDRESS.slice(-4);

    showStatus("Wallet connected! ✅", "success");
    {
    }

    // Listen for account/network changes
    window.ethereum.on("accountsChanged", () => location.reload());
    window.ethereum.on("chainChanged", () => location.reload());
  } catch (error) {
    console.error(error);
    showStatus("Failed to connect wallet", "error");
  }
}

function addPerson() {
  const peopleDiv = document.getElementById("people");
  const personDiv = document.createElement("div");
  personDiv.className = "person";
  personDiv.innerHTML = `
        <input type="text" placeholder="0x..." class="person-address">
        <button class="remove-btn" onclick="this.parentElement.remove()">✕</button>
    `;
  peopleDiv.appendChild(personDiv);
}

async function createBill() {
  if (!contract) {
    showStatus("Please connect wallet first!", "error");
    return;
  }

  const description = document.getElementById("description").value.trim();
  const totalAmount = document.getElementById("totalAmount").value;
  const addressInputs = document.querySelectorAll(".person-address");

  if (!description) {
    showStatus("Please enter a description!", "error");
    return;
  }

  if (!totalAmount || parseFloat(totalAmount) <= 0) {
    showStatus("Please enter a valid amount!", "error");
    return;
  }

  const participants = [];
  addressInputs.forEach((input) => {
    const addr = input.value.trim();
    if (addr && ethers.utils.isAddress(addr)) {
      participants.push(addr);
    }
  });

  if (participants.length === 0) {
    showStatus("Add at least one valid wallet address!", "error");
    return;
  }

  try {
    const btn = document.getElementById("createBtn");
    btn.disabled = true;
    btn.innerHTML = 'Creating...<span class="loading"></span>';

    showStatus("Creating bill... Please confirm transaction", "info");

    const amountWei = ethers.utils.parseEther(totalAmount);
    const tx = await contract.createBill(description, participants, {
      value: amountWei,
    });

    showStatus("Transaction sent! Waiting for confirmation...", "info");

    const receipt = await tx.wait();

    // Get bill ID from event
    const event = receipt.events.find((e) => e.event === "BillCreated");
    const billId = event.args.billId.toString();

    showStatus(`Bill created successfully! ID: ${billId} ✅`, "success");

    // Clear form
    document.getElementById("description").value = "";
    document.getElementById("totalAmount").value = "";
    document.getElementById("people").innerHTML =
      '<div class="person"><input type="text" placeholder="0x..." class="person-address"></div>';

    btn.disabled = false;
    btn.innerHTML = "Create Bill";

    // Switch to view tab
    setTimeout(() => {
      switchTab("view");
      loadBills();
    }, 2000);
  } catch (error) {
    console.error(error);
    showStatus(
      "Transaction failed: " + (error.message || "Unknown error"),
      "error"
    );
    document.getElementById("createBtn").disabled = false;
    document.getElementById("createBtn").innerHTML = "Create Bill";
  }
}

async function loadBills() {
  if (!contract) return;

  try {
    const billCounter = await contract.billCounter();
    const billList = document.getElementById("billList");
    billList.innerHTML = "";

    if (billCounter.toNumber() === 0) {
      billList.innerHTML =
        '<p style="text-align: center; color: #999;">No bills found. Create one to get started!</p>';
      return;
    }

    for (let i = 0; i < billCounter.toNumber(); i++) {
      const bill = await contract.getBill(i);
      const [
        creator,
        description,
        totalAmount,
        amountPerPerson,
        participants,
        totalPaid,
        isActive,
      ] = bill;

      // Check if user is involved
      const isCreator = creator.toLowerCase() === userAddress.toLowerCase();
      const isParticipant = participants.some(
        (p) => p.toLowerCase() === userAddress.toLowerCase()
      );

      if (!isCreator && !isParticipant) continue;

      const hasPaid = isParticipant
        ? await contract.hasPaid(i, userAddress)
        : false;

      const billCard = document.createElement("div");
      billCard.className = "bill-card";
      billCard.onclick = () => showBillDetails(i);

      billCard.innerHTML = `
                <div class="bill-header">
                    <span class="bill-id">Bill #${i}</span>
                    <span class="badge ${
                      isActive ? "badge-active" : "badge-completed"
                    }">
                        ${isActive ? "Active" : "Completed"}
                    </span>
                </div>
                <h3>${description}</h3>
                <div style="margin-top: 10px;">
                    <div>Total: ${ethers.utils.formatEther(
                      totalAmount
                    )} ETH</div>
                    <div>Per Person: ${ethers.utils.formatEther(
                      amountPerPerson
                    )} ETH</div>
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        ${isCreator ? "👤 You created this" : ""}
                        ${
                          isParticipant && !isCreator
                            ? hasPaid
                              ? "✅ You paid"
                              : "⏳ You need to pay"
                            : ""
                        }
                    </div>
                </div>
            `;

      billList.appendChild(billCard);
    }
  } catch (error) {
    console.error(error);
    showStatus("Failed to load bills", "error");
  }
}

async function showBillDetails(billId) {
  if (!contract) return;

  try {
    const bill = await contract.getBill(billId);
    const [
      creator,
      description,
      totalAmount,
      amountPerPerson,
      participants,
      totalPaid,
      isActive,
    ] = bill;

    const isCreator = creator.toLowerCase() === userAddress.toLowerCase();
    const isParticipant = participants.some(
      (p) => p.toLowerCase() === userAddress.toLowerCase()
    );
    const userHasPaid = isParticipant
      ? await contract.hasPaid(billId, userAddress)
      : false;
    const allHavePaid = await contract.allPaid(billId);

    let html = `
            <h2>${description}</h2>
            <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <div><strong>Bill ID:</strong> ${billId}</div>
                <div><strong>Status:</strong> <span class="badge ${
                  isActive ? "badge-active" : "badge-completed"
                }">${isActive ? "Active" : "Completed"}</span></div>
                <div><strong>Total:</strong> ${ethers.utils.formatEther(
                  totalAmount
                )} ETH</div>
                <div><strong>Per Person:</strong> ${ethers.utils.formatEther(
                  amountPerPerson
                )} ETH</div>
                <div><strong>Collected:</strong> ${ethers.utils.formatEther(
                  totalPaid
                )} ETH</div>
                <div><strong>Creator:</strong> ${creator.slice(
                  0,
                  6
                )}...${creator.slice(-4)} ${isCreator ? "(You)" : ""}</div>
            </div>
            
            <h3>Participants (${participants.length})</h3>
        `;

    for (let participant of participants) {
      const hasPaid = await contract.hasPaid(billId, participant);
      const isMe = participant.toLowerCase() === userAddress.toLowerCase();

      html += `
                <div class="split-item ${hasPaid ? "paid" : ""}">
                    <div><strong>${participant.slice(
                      0,
                      10
                    )}...${participant.slice(-8)}</strong> ${
        isMe ? "(You)" : ""
      }</div>
                    <div class="amount">${ethers.utils.formatEther(
                      amountPerPerson
                    )} ETH</div>
                    ${
                      hasPaid
                        ? '<div style="color: #4CAF50; margin-top: 5px;">✅ Paid</div>'
                        : isMe && isActive
                        ? `<button class="pay-btn" onclick="payShare(${billId})">Pay My Share</button>`
                        : '<div style="color: #999; margin-top: 5px;">⏳ Pending</div>'
                    }
                </div>
            `;
    }

    if (isCreator && totalPaid.gt(0)) {
      html += `<button class="withdraw-btn" onclick="withdrawFunds(${billId})">Withdraw ${ethers.utils.formatEther(
        totalPaid
      )} ETH</button>`;
    }

    document.getElementById("billList").style.display = "none";
    document.getElementById("billDetails").style.display = "block";
    document.getElementById("billDetailsContent").innerHTML = html;
  } catch (error) {
    console.error(error);
    showStatus("Failed to load bill details", "error");
  }
}

function backToBills() {
  document.getElementById("billDetails").style.display = "none";
  document.getElementById("billList").style.display = "block";
  loadBills();
}

async function payShare(billId) {
  if (!contract) return;

  try {
    const bill = await contract.getBill(billId);
    const amountPerPerson = bill[3];

    showStatus("Sending payment... Please confirm transaction", "info");

    const tx = await contract.payShare(billId, { value: amountPerPerson });

    showStatus("Transaction sent! Waiting for confirmation...", "info");

    await tx.wait();

    showStatus("Payment successful! ✅", "success");

    // Refresh details
    setTimeout(() => showBillDetails(billId), 2000);
  } catch (error) {
    console.error(error);
    showStatus(
      "Payment failed: " + (error.message || "Unknown error"),
      "error"
    );
  }
}

async function withdrawFunds(billId) {
  if (!contract) return;

  try {
    showStatus("Withdrawing funds... Please confirm transaction", "info");

    const tx = await contract.withdrawFunds(billId);

    showStatus("Transaction sent! Waiting for confirmation...", "info");

    await tx.wait();

    showStatus("Withdrawal successful! ✅", "success");

    // Refresh details
    setTimeout(() => showBillDetails(billId), 2000);
  } catch (error) {
    console.error(error);
    showStatus(
      "Withdrawal failed: " + (error.message || "Unknown error"),
      "error"
    );
  }
}

function switchTab(tab) {
  // Update buttons
  document
    .querySelectorAll(".tab-btn")
    .forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  // Update content
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  if (tab === "create") {
    document.getElementById("createTab").classList.add("active");
  } else {
    document.getElementById("viewTab").classList.add("active");
    loadBills();
  }

  // Hide bill details
  document.getElementById("billDetails").style.display = "none";
  document.getElementById("billList").style.display = "block";
}

function showStatus(message, type) {
  const container = document.getElementById("statusContainer");
  const statusDiv = document.createElement("div");
  statusDiv.className = `status ${type}`;
  statusDiv.textContent = message;

  container.innerHTML = "";
  container.appendChild(statusDiv);

  if (type !== "info") {
    setTimeout(() => statusDiv.remove(), 5000);
  }
}

// Auto-connect if previously connected
window.addEventListener("load", async () => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    connectWallet();
  }
});
