const { Keypair } = require('@solana/web3.js');

async function generateWallet() {
    // Handling bs58 import for different versions/module types
    let bs58;
    try {
        bs58 = require('bs58');
        if (bs58.default) bs58 = bs58.default;
    } catch (e) {
        // Fallback or dynamic import if needed
    }

    const keypair = Keypair.generate();

    console.log('\n--- NEW SOLANA WALLET GENERATED ---');
    console.log('Public Key (Wallet Address):');
    console.log(keypair.publicKey.toBase58());

    console.log('\nSecret Key (Array format - for code/CLI):');
    console.log(`[${keypair.secretKey.toString()}]`);

    if (bs58 && typeof bs58.encode === 'function') {
        console.log('\nSecret Key (Base58 format):');
        console.log(bs58.encode(keypair.secretKey));
    }

    console.log('-----------------------------------');
    console.log('⚠️  KEEP YOUR SECRET KEY PRIVATE! NEVER SHARE IT! ⚠️');
    console.log('Use the Public Key for PRODUCTION_ESCROW_PUBLIC_KEY in .env');
}

generateWallet();
