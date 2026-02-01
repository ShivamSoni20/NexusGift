## Project Summary
NexusGift is a privacy-first crypto gifting platform on Solana. It enables users to send gifts anonymously via confidential on-chain payments, delivered as spendable virtual cards (Starpay integration), without revealing sender identity or gift amount.

## Architecture
### 1. High-Level Architecture
- **Frontend**: Next.js (App Router) + Tailwind + Framer Motion.
- **Privacy Layer**: ShadowWire SDK for ZK-proof shielded transactions.
- **Card Issuance**: Starpay API (mocked for demo) for Visa/Mastercard creation.
- **Persistence**: Supabase for gift tracking and metadata (zero-knowledge of PII).
- **Delivery**: SendGrid for secure claim link delivery.

### 2. End-to-End Workflow
1. **Creation**: Sender connects wallet, chooses gift amount, and designs card visuals.
2. **Payment**: Sender generates ZK proof using ShadowWire; tokens are moved to a shielded vault.
3. **Commitment**: Backend receives commitment hash and proof; verifies but cannot see amount/sender.
4. **Issuance**: On verification, backend calls Starpay to issue a virtual card with the committed value.
5. **Delivery**: Secure one-time claim link emailed to recipient (scheduled or immediate).
6. **Claim**: Recipient clicks link, views card details (CVV/Exp/Number), no wallet/KYC needed.

### 3. API Design
- `POST /api/gifts/create`: Initialize gift with commitment hash and proof.
- `GET /api/gifts/claim/[token]`: Retrieve card details for recipient.
- `POST /api/gifts/schedule`: Set delivery time for the gift.

### 4. Backend Data Models
- **Gifts**: `id`, `commitment_hash`, `encrypted_metadata`, `status`, `claim_token`, `scheduled_at`.
- **Cards**: `id`, `gift_id`, `card_id_external`, `last_four`, `expiry`, `encrypted_full_details`.

## Tech Stack
- **Frontend**: Next.js 14, Tailwind, Lucide, Framer Motion
- **Blockchain**: Solana, ShadowWire
- **Issuance**: Starpay
- **Backend**: Supabase, Resend/SendGrid
- **Visuals**: HTML5 Canvas

## User Preferences
- Use functional components.
- No comments unless requested.

## Project Guidelines
- Follow Next.js App Router conventions.
- Keep interactive elements as small client components.
- Wrap `useSearchParams()` in Suspense.
- Ensure security best practices for private transactions.
- Never log private payment amounts or sender wallet addresses.
 
