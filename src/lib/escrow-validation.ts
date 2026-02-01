import { PublicKey } from '@solana/web3.js';

/**
 * PRODUCTION ESCROW VALIDATION
 * Ensures the escrow wallet is properly configured before allowing production mode
 */

export interface EscrowValidation {
    isValid: boolean;
    escrowPublicKey?: PublicKey;
    error?: string;
}

/**
 * Validates the production escrow configuration
 * REQUIREMENT 1: Validate escrow public key on startup
 */
export function validateProductionEscrow(): EscrowValidation {
    const escrowAddress = process.env.NEXT_PUBLIC_PRODUCTION_ESCROW_PUBLIC_KEY;

    // Check if escrow address is configured
    if (!escrowAddress) {
        return {
            isValid: false,
            error: 'PRODUCTION_ESCROW_PUBLIC_KEY not configured'
        };
    }

    // Validate it's a valid Solana public key
    try {
        const escrowPublicKey = new PublicKey(escrowAddress);

        // Additional validation: ensure it's not a system program or null address
        const nullAddress = '11111111111111111111111111111111';
        const systemProgram = 'Sysvar1111111111111111111111111111111111111';

        if (escrowAddress === nullAddress || escrowAddress === systemProgram) {
            return {
                isValid: false,
                error: 'Escrow cannot be a system program or null address'
            };
        }

        console.log('[ESCROW] ✅ Production escrow validated:', escrowPublicKey.toBase58());

        return {
            isValid: true,
            escrowPublicKey
        };
    } catch (error) {
        return {
            isValid: false,
            error: `Invalid Solana public key: ${escrowAddress}`
        };
    }
}

/**
 * Gets the validated escrow public key or throws an error
 * Use this in production flows to ensure escrow is configured
 */
export function getProductionEscrow(): PublicKey {
    const validation = validateProductionEscrow();

    if (!validation.isValid) {
        throw new Error(`Production escrow validation failed: ${validation.error}`);
    }

    return validation.escrowPublicKey!;
}
 
 
 
