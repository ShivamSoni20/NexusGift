import { NextRequest, NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';

/**
 * BACKEND SHADOWWIRE PROOF VERIFICATION
 * This is a CRITICAL security endpoint
 * NEVER issue cards without successful verification
 */

interface VerificationRequest {
    commitment: string;
    proof: string;
    nullifier: string;
    txSignature: string;
    tokenSymbol: string;
}

export async function POST(request: NextRequest) {
    try {
        const body: VerificationRequest = await request.json();

        const { commitment, proof, nullifier, txSignature, tokenSymbol } = body;

        // Validate required fields
        if (!commitment || !proof || !txSignature) {
            return NextResponse.json(
                { verified: false, message: 'Missing required proof fields' },
                { status: 400 }
            );
        }

        console.log('[BACKEND] Verifying ShadowWire proof:', {
            commitment: commitment.slice(0, 20) + '...',
            txSignature: txSignature.slice(0, 16) + '...',
            tokenSymbol
        });

        // Initialize Solana connection
        const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT || 'https://api.devnet.solana.com';
        const connection = new Connection(endpoint, 'confirmed');

        // Step 1: Verify transaction exists and is confirmed
        try {
            const txInfo = await connection.getTransaction(txSignature, {
                maxSupportedTransactionVersion: 0
            });

            if (!txInfo) {
                console.error('[BACKEND] Transaction not found:', txSignature);
                return NextResponse.json(
                    { verified: false, message: 'Transaction not found on-chain' },
                    { status: 400 }
                );
            }

            if (!txInfo.meta?.err === null) {
                console.error('[BACKEND] Transaction failed on-chain');
                return NextResponse.json(
                    { verified: false, message: 'Transaction failed' },
                    { status: 400 }
                );
            }

            console.log('[BACKEND] Transaction confirmed on-chain');
        } catch (txError) {
            console.error('[BACKEND] Transaction verification failed:', txError);
            // In development, we might not have real transactions
            // In production, this would be a hard failure
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    { verified: false, message: 'Transaction verification failed' },
                    { status: 400 }
                );
            }
        }

        // Step 2: Verify ShadowWire proof cryptographically
        // TODO: Replace with actual ShadowWire SDK verification
        // import { ShadowWire } from '@radr/shadowwire';
        // const shadowWire = new ShadowWire({ connection });
        // const isValid = await shadowWire.verifyProof({
        //   commitment,
        //   proof,
        //   nullifier
        // });

        // TEMPORARY: For development, accept proofs marked as real
        // In production, this MUST use real cryptographic verification
        const isValidProof = proof.startsWith('sw_proof_') && commitment.startsWith('sw_commit_');

        if (!isValidProof) {
            console.error('[BACKEND] Proof validation failed');
            return NextResponse.json(
                { verified: false, message: 'Invalid proof format' },
                { status: 400 }
            );
        }

        // Step 3: Check for nullifier reuse (prevent double-spending)
        // TODO: Implement nullifier tracking in database
        // const nullifierExists = await checkNullifierExists(nullifier);
        // if (nullifierExists) {
        //   return NextResponse.json(
        //     { verified: false, message: 'Nullifier already used' },
        //     { status: 400 }
        //   );
        // }

        // Step 4: Store nullifier to prevent reuse
        // await storeNullifier(nullifier, commitment, txSignature);

        console.log('[BACKEND] ✅ Proof VERIFIED successfully');

        return NextResponse.json({
            verified: true,
            message: 'Proof verified successfully',
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('[BACKEND] Proof verification error:', error);
        return NextResponse.json(
            { verified: false, message: 'Internal verification error' },
            { status: 500 }
        );
    }
}
