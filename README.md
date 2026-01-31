# 🛡️ NexusGift

### *Gifting, Unobserved.*

NexusGift is a high-end, **stateless privacy protocol** built for the Solana blockchain. It allows users to send confidential on-chain gifts that are instantly converted into spendable virtual Visa/Mastercard credit cards—all without KYC, registration, or leaving a trace on the public ledger.

![NexusGift Hero](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2832&ixlib=rb-4.0.3)

---

## 🚀 Key Features

- **Unobserved Gifting**: Leverages **ShadowWire** (ZK-Bulletproofs) to conceal transaction amounts and sender-recipient links.
- **Stateless Architecture**: Zero database persistence. All gift state, metadata, and encrypted credentials are encoded directly into the **Claim Token**.
- **Instant Issuance**: Integrated with the **Starpay Gateway** to provide immediate virtual cards usable anywhere Visa/Mastercard are accepted.
- **Premium UX**: A cinematic "Chrome & Amber" aesthetic with high-fidelity animations and brutalist-luxe interface design.
- **Hackathon-Ready Demo**: Includes a "Protocol Simulation" walkthrough and a robust fallback demo mode.

---

## 🛠️ The Technology Stack

### Core Protocol
- **Solana Ecosystem**: High-speed, low-cost settlement layer.
- **ShadowWire**: Zero-knowledge proof privacy layer for shielded transfers.
- **Starpay**: Gateway for registration-free virtual card issuance.

### Frontend (The "Terminal")
- **Next.js 14**: Server-side rendering and optimized routing.
- **Tailwind CSS**: Custom "Ash & Gold" design system.
- **Framer Motion**: Complex staggered layouts and cinematic transitions.
- **Lucide React**: High-contrast technical iconography.

---

## 🏛️ Project Structure

`NexusGift` is designed for maximum portability and zero-configuration setups.

```
nexus-gift/
├── src/
│   ├── app/            # Next.js App Router (Layouts & Pages)
│   ├── components/     # High-end UI (Navbar, Demo, Card Previews)
│   ├── lib/            # Protocol Logic (ShadowWire & Issuance Mocks)
│   └── actions.ts      # Stateless Server Actions (State-to-Token Encoding)
├── tailwind.config.ts  # Chrome & Amber Design Tokens
└── public/             # Static Assets
```

---

## 🧪 Simulation & Demo Mode

NexusGift features a robust **Stateless Demo Mode** designed for the most reliable jury walkthrough possible:

1. **Protocol Simulation**: The `DemoWalkthrough` component visually breaks down the ZK-proof generation and card issuance sequence.
2. **Mock Gateway**: Simulated Starpay issuance providing deterministic (but realistic) virtual card details.
3. **Wallet Optionality**: The app detects `Phantom` or `Solflare` via the Wallet Standard but allows for a **Demo Fallback** to ensure the flow never breaks due to hardware/extension issues.

---

## 🏃 Getting Started

1. **Clone the artifact**:
   ```bash
   git clone https://github.com/ShivamSoni20/NexusGift.git
   cd nexus-gift
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Launch the Terminal**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to begin the transfer sequence.

---

## ⚖️ Disclaimer

*NexusGift is currently in **Hackathon Demo Mode**. All financial transactions and issuance gates are currently simulated via a stateless mock engine. No actual ZK-circuits are finalized for production use.*

---

<div align="center">
  <p>Built for the frontier of Solana Privacy.</p>
  <p><strong>© 2026 NexusGift Protocol</strong></p>
</div>
