# 🛡️ NexusGift

### *Anonymous Crypto-Powered Gift Cards on Solana*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0--beta-blue)](#)
[![Demo](https://img.shields.io/badge/Live-Demo-gold)](https://nexus-gift.vercel.app)

NexusGift is a high-end, **stateless privacy protocol** built for the Solana blockchain. It allows users to send confidential on-chain gifts that are instantly converted into spendable virtual Visa/Mastercard credit cards—all without KYC, registration, or leaving a trace on the public ledger.

![NexusGift Hero](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3)

---

## 🚀 Live Demo
- **URL:** [https://nexus-gift.vercel.app](https://nexus-gift.vercel.app)
- **Modes:** 
  - **Simulation (Demo):** Use mock signatures and simulated balances to test the flow instantly.
  - **Production (Live):** Requires real SOL/USDC and a connected wallet for protocol-backed card issuance.

---

## 🚩 The Problem
Traditional crypto gifting is transparent by default. Anyone with a block explorer can see the sender, the recipient, and the amount, permanently linking real-world identities to on-chain wallets. Furthermore, converting crypto into spendable fiat gifts usually requires cumbersome CEX off-ramping, KYC, and centralized gift card providers that sacrifice user privacy.

---

## 🔐 How It Works

NexusGift utilizes a **Stateless Cryptographic Engine** to decouple the sender from the spending instrument.

### 1. Configure Gift
User selects a token (SOL/USDC), amount, and aesthetic theme. No recipient wallet is required—only an optional email.

### 2. ShadowWire Anonymous Transfer
The protocol initiates a confidential transfer via **ShadowWire**. The transaction is shielded using range proofs, masking the sender's origin and the gift value from public observers.

### 3. Escrow & Proof Verification
Funds move to a protocol-controlled **Production Escrow**. The system verifies the on-chain movement and ShadowWire proof before authorizing card issuance.

### 4. Starpay Card Issuance
Upon verification, a real-time call is made to the **Starpay Gateway** to issue a virtual Visa/Mastercard. If the gateway is unreachable, the system activates **Protocol-Backed Issuance** to ensure funds are never lost.

### 5. Stateless Claim
The recipient receives a secure, Base64-encoded URL. Since NexusGift is stateless, the URL *is* the data. Opening it decrypts the card credentials locally in the recipient's browser.

---

## ✨ Key Features
- **Anonymous Funding**: Mask sender identity and transaction amounts using ShadowWire.
- **Multitoken Support**: Send gifts in SOL or USDC with real-time price feeds.
- **Stateless Architecture**: Zero database persistence. All claim data is encrypted inside the URL.
- **Virtual Card Conversion**: Instant conversion from Solana assets to spendable credit cards.
- **Resilient Issuance**: Safety fallbacks to prevent fund loss during API downtime.
- **Premium UX**: High-fidelity animations, responsive design, and automatic URL shortening.

---

## 🛠️ Technology Stack
- **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain**: [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- **Privacy Layer**: ShadowWire Confidential Transfers
- **Card Gateway**: Starpay API
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🖼️ Showcase

### 1. Configure Gift
*Design your digital artifact with custom amounts and themes.*
![Configure](./screenshots/configure-gift.png)

### 2. Live Mode Toggle
*Switch between simulated environments and live production settlement.*
![Mode Toggle](./screenshots/mode-toggle.png)

### 3. Card Decryption
*The stateless claim page allows recipients to reveal their virtual credentials.*
![Claim Page](./screenshots/claim-page.png)

### 4. System Entropy
*Real-time monitoring of ZK-proof generation and network status.*
![Entropy](./screenshots/entropy.png)

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
