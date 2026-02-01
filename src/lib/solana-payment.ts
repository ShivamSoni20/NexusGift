import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';

/**
 * PRODUCTION SOLANA PAYMENT HANDLER
 * Handles real SOL and USDC transfers on Solana Devnet
 */

// Devnet USDC mint address (official Devnet USDC)
const USDC_MINT_DEVNET = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');

export interface PaymentResult {
    success: boolean;
    signature?: string;
    error?: string;
}

export async function transferSOL(
    connection: Connection,
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    amount: number,
    signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<PaymentResult> {
    try {
        const lamports = amount * LAMPORTS_PER_SOL;

        // Check balance
        const balance = await connection.getBalance(fromPubkey);
        if (balance < lamports) {
            return {
                success: false,
                error: `Insufficient balance. Required: ${amount} SOL, Available: ${balance / LAMPORTS_PER_SOL} SOL`
            };
        }

        // Create transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey,
                toPubkey,
                lamports,
            })
        );

        transaction.feePayer = fromPubkey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // Sign and send
        const signed = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize());

        // Confirm
        await connection.confirmTransaction(signature, 'confirmed');

        return { success: true, signature };
    } catch (error: any) {
        console.error('SOL transfer failed:', error);
        return { success: false, error: error.message };
    }
}

export async function transferUSDC(
    connection: Connection,
    fromPubkey: PublicKey,
    toPubkey: PublicKey,
    amount: number,
    signTransaction: (tx: Transaction) => Promise<Transaction>
): Promise<PaymentResult> {
    try {
        const usdcAmount = amount * 1_000_000; // USDC has 6 decimals

        // Get associated token accounts
        const fromTokenAccount = await getAssociatedTokenAddress(USDC_MINT_DEVNET, fromPubkey);
        const toTokenAccount = await getAssociatedTokenAddress(USDC_MINT_DEVNET, toPubkey);

        // Check balance
        const tokenBalance = await connection.getTokenAccountBalance(fromTokenAccount);
        const availableAmount = parseInt(tokenBalance.value.amount);

        if (availableAmount < usdcAmount) {
            return {
                success: false,
                error: `Insufficient USDC. Required: ${amount}, Available: ${availableAmount / 1_000_000}`
            };
        }

        // Create transfer instruction
        const transaction = new Transaction().add(
            createTransferInstruction(
                fromTokenAccount,
                toTokenAccount,
                fromPubkey,
                usdcAmount,
                [],
                TOKEN_PROGRAM_ID
            )
        );

        transaction.feePayer = fromPubkey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        // Sign and send
        const signed = await signTransaction(transaction);
        const signature = await connection.sendRawTransaction(signed.serialize());

        // Confirm
        await connection.confirmTransaction(signature, 'confirmed');

        return { success: true, signature };
    } catch (error: any) {
        console.error('USDC transfer failed:', error);
        return { success: false, error: error.message };
    }
}

export async function checkBalance(
    connection: Connection,
    publicKey: PublicKey,
    tokenSymbol: 'SOL' | 'USDC'
): Promise<{ balance: number; hasEnough: boolean; required: number }> {
    try {
        if (tokenSymbol === 'SOL') {
            const balance = await connection.getBalance(publicKey);
            return {
                balance: balance / LAMPORTS_PER_SOL,
                hasEnough: balance > 0.01 * LAMPORTS_PER_SOL, // Need at least 0.01 SOL for fees
                required: 0.01
            };
        } else {
            const tokenAccount = await getAssociatedTokenAddress(USDC_MINT_DEVNET, publicKey);
            const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);
            const balance = parseInt(tokenBalance.value.amount) / 1_000_000;

            return {
                balance,
                hasEnough: balance > 1, // Need at least 1 USDC
                required: 1
            };
        }
    } catch (error) {
        console.error('Balance check failed:', error);
        return { balance: 0, hasEnough: false, required: 0 };
    }
}
 
 
 
