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
- **Solana Ecosystem**: High-speed settlement for SOL and USDC assets.
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

## 🎭 Dual-Mode Architecture

NexusGift operates in **two distinct modes** to serve both demonstration and production use cases:

### 🎪 Demo Mode (Default)
Perfect for hackathons, presentations, and testing without real funds:
- **Mocked Payments**: Simulated SOL/USDC transfers (no blockchain interaction)
- **Simulated Privacy**: Mock ZK-proof generation for demonstration
- **Virtual Cards**: Realistic-looking but non-functional card credentials
- **Zero Setup**: Works immediately without API keys or wallet funds
- **Safe**: No risk of accidental real transactions

### 🚀 Production Mode
Real Solana Devnet integration for actual use:
- **Real Payments**: Actual SOL and USDC transfers on Solana Devnet
- **ShadowWire Privacy**: True zero-knowledge proofs for confidential transfers
- **Starpay Cards**: Real, spendable virtual Visa/Mastercard credentials
- **Wallet Required**: Must connect Phantom/Solflare with sufficient balance
- **API Keys**: Requires Starpay API key for card issuance

### Mode Toggle
Users can switch between modes via the **navbar toggle button**:
- **Demo** (Gold badge): Simulation mode active
- **Live** (Green badge): Production mode with real transactions

The app automatically falls back to Demo mode if:
- API keys are missing
- Wallet is not connected (in Production mode)
- Insufficient balance detected
- Any production service fails

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

4. **Configure Production Mode** (Optional):
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   NEXT_PUBLIC_STARPAY_API_KEY=your_starpay_key_here
   NEXT_PUBLIC_SHADOWWIRE_ENABLED=true
   ```
   
   Without these keys, the app runs in Demo mode (fully functional for testing).

---

## ⚖️ Disclaimer

**Demo Mode**: All transactions are simulated. No real funds are transferred, and virtual cards are non-functional placeholders.

**Production Mode**: Uses real Solana Devnet. While Devnet tokens have no monetary value, this mode demonstrates production-ready integration with ShadowWire privacy and Starpay card issuance APIs.

---

<div align="center">
  <p>Built for the frontier of Solana Privacy.</p>
  <p><strong>© 2026 NexusGift Protocol</strong></p>
</div>
