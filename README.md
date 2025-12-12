# Decentralized Scholarship Fund - User & Deployment Guide

## 1. Project Overview
This project is a **Decentralized Scholarship Application (dApp)** built with React, Vite, and Hardhat. It allows an Administrator (Owner) to deposit Ethereum into a smart contract and register students for scholarships. Registered students can then connect their wallets to claim their allocated funds securely and transparently.

## 2. Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **Bun** (Preferred package manager)
- **MetaMask** (Browser extension)

---

## 3. Installation & Deployment

### Step 1: Install Dependencies
Open your terminal and install dependencies for both the backend and frontend.

```bash
# Install Backend Dependencies
cd scholarship-dapp/backend
bun install

# Install Frontend Dependencies
cd ../frontend
bun install
```

### Step 2: Start the Local Blockchain
In the `backend` directory, start the Hardhat local node. This mimics the Ethereum blockchain on your computer.

```bash
# Inside scholarship-dapp/backend
bun run node
```
*Keep this terminal open! It will display a list of 20 accounts with their Private Keys. You will need these later.*

### Step 3: Deploy the Smart Contract
Open a **new** terminal window and deploy the contract to your local network.

```bash
# Inside scholarship-dapp/backend
bun run hardhat run scripts/deploy.ts --network localhost
```
**Output:** `ScholarshipFund deployed to: 0x...`

### Step 4: Configure the Frontend
1. Copy the **Contract Address** from the deployment step above.
2. Open the file `scholarship-dapp/frontend/src/constants.js`.
3. Paste the address into the `CONTRACT_ADDRESS` variable.

```javascript
export const CONTRACT_ADDRESS = "YOUR_COPIED_ADDRESS_HERE";
```

### Step 5: Start the Frontend
```bash
# Inside scholarship-dapp/frontend
bun run dev
```
Open the URL shown (usually `http://localhost:5173`) in your browser.

---

## 4. MetaMask Setup (Critical)
To interact with the local blockchain, you must configure MetaMask.

1. **Add Network:**
   - Open MetaMask -> Settings -> Networks -> Add Network -> "Add a network manually".
   - **Network Name:** Localhost 8545
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** ETH
   - Click **Save**.

2. **Import Accounts:**
   - Go back to the terminal running `bun run node`.
   - Copy the **Private Key** for **Account #0** (This will be the **Admin**).
   - In MetaMask: Click Account Icon -> "Import Account" -> Paste Key -> Import.
   - Repeat for **Account #1** (This will be a **Student**).

---

## 5. How to Use: Admin Control Panel
**Role:** The Deployer (Account #0) is the Owner/Admin.

1. **Connect:** Switch MetaMask to **Account #0** and click "Connect Wallet" on the dApp.
2. **Dashboard:** You will see the **Admin Dashboard**.
3. **Actions:**
   - **Deposit Funds:** Click "Deposit Funds" and enter an ETH amount (e.g., 10.0) to fund the scholarship pool.
   - **Grant Scholarship:** Use the form to register a student.
     - *Name:* "John Doe"
     - *Wallet Address:* Paste the address of Account #1 (Student).
     - *Amount:* 1.0 (ETH).
     - Click "Grant Scholarship".
   - **Pause/Unpause:** Use this button to freeze/unfreeze all claims in case of emergency.
   - **Withdraw All:** Withdraws all remaining contract funds back to your wallet.

---

## 6. How to Use: Student Portal
**Role:** A Beneficiary (e.g., Account #1).

1. **Connect:** Switch MetaMask to **Account #1** (or any registered student wallet).
2. **Dashboard:** You will see the **Student Portal**.
3. **View Status:** You will see your name, the scholarship amount, and a "Ready to Claim" badge.
4. **Claim Funds:**
   - Click **"Claim Scholarship Now"**.
   - Confirm the transaction in MetaMask.
   - Once confirmed, the funds are transferred to your wallet, and the status updates to "Claimed Successfully".
5. **Not Registered:** If you connect a wallet that hasn't been added by the Admin, you will see a "Wallet Not Registered" screen.

---

## 7. Troubleshooting
- **"Nonce too high" Error:** In MetaMask, go to Settings -> Advanced -> Clear Activity Tab Data. This resets the transaction history for the local network.
- **Connection Failed:** Ensure `bun run node` is still running in the background.
