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
- **Financial Integrity**: Production mode enforces real fund movement with escrow validation and strict card issuance verification.

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

## 🔐 Production Mode Setup (CRITICAL)

NexusGift operates in two distinct modes:

### DEMO Mode (Default)
- Simulated transfers and card issuance
- No real funds move
- Perfect for testing and demonstrations

### PRODUCTION Mode (Real Money)
**⚠️ PRODUCTION MODE REQUIRES STRICT CONFIGURATION**

1. **Set Up Production Escrow**
   ```bash
   # Generate a new Solana keypair for escrow
   solana-keygen new -o escrow-keypair.json
   
   # Get the public key
   solana-keygen pubkey escrow-keypair.json
   ```

2. **Configure Environment Variables**
   ```bash
   # Required for Production Mode
   PRODUCTION_ESCROW_PUBLIC_KEY=<your_escrow_public_key>
   STARPAY_API_KEY=<your_starpay_api_key>
   STARPAY_ENDPOINT=https://api.starpayinfo.com
   
   # Enable production features
   NEXT_PUBLIC_STARPAY_ENABLED=true
   NEXT_PUBLIC_SHADOWWIRE_ENABLED=true
   ```

3. **Production Safety Guarantees**
   - ✅ Real SOL/USDC transfers to controlled escrow
   - ✅ Pre/post balance validation
   - ✅ Strict Starpay API response validation
   - ✅ No mock fallbacks
   - ✅ Card rendered ONLY from real issuance response
   - ❌ NO placeholder addresses
   - ❌ NO optimistic UI updates

---

## 🏛️ Project Structure

`NexusGift` is designed for maximum portability and zero-configuration setups.

```
nexus-gift/
├── src/
│   ├── app/            # Next.js App Router (Layouts & Pages)
│   ├── components/     # High-end UI (Navbar, Demo, Card Previews)
│   ├── lib/            # Protocol Logic (ShadowWire & Starpay Integration)
│   └── actions.ts      # Stateless Server Actions (State-to-Token Encoding)
├── tailwind.config.ts  # Chrome & Amber Design Tokens
└── public/             # Static Assets
```

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nexus-gift.git
cd nexus-gift

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## 🎯 Usage

### Creating a Gift (Demo Mode)

1. Navigate to the "Create Gift" page
2. Enter recipient email and amount
3. Select token (SOL or USDC)
4. Add a personal message
5. Choose a card design
6. Click "Authorize & Create"
7. Share the generated claim link

### Creating a Gift (Production Mode)

1. Ensure production environment variables are configured
2. Connect your Solana wallet
3. Follow the same steps as Demo mode
4. **Real funds will be transferred to escrow**
5. **Real Starpay card will be issued**
6. Transaction is verified on-chain

### Claiming a Gift

1. Recipient receives claim link
2. Opens link in browser
3. Sees virtual card details instantly
4. Can use card immediately for purchases

---

## 🔒 Security & Privacy

- **Zero-Knowledge Proofs**: ShadowWire ensures transaction amounts and links are hidden
- **Stateless Design**: No server-side data storage
- **Encrypted Claim Tokens**: All sensitive data is encrypted in the URL
- **Production Escrow**: Funds are held in a controlled wallet, not lost to null addresses
- **Balance Verification**: Pre/post transfer validation ensures funds actually move

---

## 🚧 Development Roadmap

- [x] Core stateless architecture
- [x] ShadowWire privacy integration
- [x] Starpay card issuance
- [x] Production fund movement validation
- [x] Escrow balance verification
- [ ] USDC support (currently SOL only in production)
- [ ] Multi-chain support
- [ ] Mobile app
- [ ] Nullifier tracking for double-spend prevention

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

**Built with ❤️ for the Solana ecosystem**
