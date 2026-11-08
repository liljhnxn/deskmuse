# DeskMuse 🖥️✨

> **"Show Your Setup. Inspire Others."**  
> *"Build Your Space. Find Your Inspiration."*

DeskMuse is a decentralized workspace inspiration platform built on **Botchain Testnet** where developers, designers, and creators showcase their desk setups, computer workspaces, and creative environments on-chain.

---

## ⚡ Highlights & Architecture

- **Single Smart Contract**: Full workspace state and community engagement managed by [`DeskMuse.sol`](./contracts/DeskMuse.sol).
- **Single-Page Application**: Implemented strictly as one responsive webpage powered by Next.js App Router ([`app/page.tsx`](./app/page.tsx)).
- **Zero Backend / Zero Database**: 100% of setup submissions, metadata, like counts, and author relationships are written and queried directly on-chain via EVM RPC.
- **No Tokens or NFTs**: Pure utility and community workspace inspiration without token gating or NFT friction.
- **Botchain Testnet Integration**: Direct integration with Botchain (Chain ID: `968`, RPC: `https://rpc.bohr.life`, Explorer: `https://scan.bohr.life`).

---

## 🎨 Design System & Palette

Crafted with a premium dark technology-magazine aesthetic:

| Element | Color Value | Description |
| :--- | :--- | :--- |
| **Background** | `#121419` | Deep dark obsidian canvas with ambient grid mesh |
| **Cards** | `#202630` | Sleek slate surface with border illumination |
| **Primary Accent** | `#E0A458` | Warm orange-gold magazine accent & glow |
| **Text Primary** | `#F5F5F5` | Crisp white technology typography |
| **Text Secondary** | `#A1A6AF` | Refined muted secondary details |

---

## ⛓️ Network Specifications

| Parameter | Value |
| :--- | :--- |
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` |
| **RPC Endpoint** | `https://rpc.bohr.life` |
| **Currency Symbol** | `BOHR` |
| **Block Explorer** | [https://scan.bohr.life](https://scan.bohr.life) |

---

## 📜 Smart Contract: `DeskMuse.sol`

### Features Implemented
1. **Publish Desk Setup**: `publishSetup(string title, string description, string imageUrl, string category, string setupType)`
2. **Category Classification**: Gaming Setup, Minimalist, Study Setup, Office Setup, Creative Workspace.
3. **Optional Setup Type**: e.g., Ultrawide Monitor, Standing Desk, Triple OLED, Minimalist Laptop.
4. **Retrieve All Setups**: `getAllSetups()` returns all active submissions.
5. **Appreciate Setups**: `likeSetup(uint256 setupId)` and `unlikeSetup(uint256 setupId)` with duplicate like prevention per wallet address.
6. **Author Moderation**: `removeSetup(uint256 setupId)` allows authors to remove their setup and adjusts global counters.
7. **Counters & Statistics**: `totalSetups` and `totalLikes` tracked globally on-chain.
8. **Events Emitted**: `SetupPublished`, `SetupLiked`, `SetupUnliked`, and `SetupRemoved`.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** or **pnpm**
- **MetaMask** or EVM-compatible browser extension

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in the parameters:
```env
NEXT_PUBLIC_RPC_URL="https://rpc.bohr.life"
BOTCHAIN_RPC_URL="https://rpc.bohr.life"
NEXT_PUBLIC_CONTRACT_ADDRESS="<YOUR_DEPLOYED_CONTRACT_ADDRESS>"
PRIVATE_KEY="<YOUR_PRIVATE_KEY_FOR_DEPLOYMENT>"
```

### 4. Compile & Run Tests
```bash
# Compile Solidity contract
npx hardhat compile

# Run full automated test suite
npx hardhat test
```

### 5. Deploy to Botchain Testnet
```bash
npx hardhat run scripts/deploy.ts --network botchain
```

### 6. Run Next.js Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Smart Contract Test Suite

The test suite covers:
- Initial state verification
- Successful setup publishing & event emissions
- Validation checks (empty title, empty image URL, empty category reverts)
- Like & Unlike mechanics
- Duplicate like prevention
- Author removal permissions and counter re-balancing
- Multiple setups retrieval & filtering

---

## 📄 License
MIT License.

