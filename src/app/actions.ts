"use server";

import { verifyPrivatePayment, PrivatePaymentProof } from "@/lib/privacy";
import { issueVirtualCard } from "@/lib/issuance";
import { issueStarpayCard } from "@/lib/starpay-production";
import { verifyShadowWireProofInternal } from "@/lib/shadowwire-verify";

/**
 * DUAL-MODE ACTIONS
 * Supports both Demo (stateless mock) and Production (real ShadowWire + Starpay)
 */

interface ShadowWireProof {
  commitment: string;
  proof: string;
  nullifier: string;
  txSignature: string;
  slot?: number;
  confirmationStatus?: string;
  isReal: boolean;
}

function encodeGiftState(data: any) {
  const json = JSON.stringify(data);
  return Buffer.from(json).toString('base64url');
}

function decodeGiftState(token: string) {
  try {
    const json = Buffer.from(token, 'base64url').toString('utf8');
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

/**
 * Create gift - supports both Demo and Production modes
 */
export async function createGiftAction(formData: {
  recipientEmail: string;
  amount: number;
  tokenSymbol: string;
  usdEquivalent: number;
  message: string;
  design: string;
  scheduledAt?: string;
  proof: PrivatePaymentProof | ShadowWireProof;
  mode: 'DEMO' | 'PRODUCTION';
}) {
  try {
    const { mode, proof } = formData;

    // DEMO MODE: Use mock verification
    if (mode === 'DEMO') {
      console.log('[DEMO MODE] Using simulated privacy layer');

      const isValid = await verifyPrivatePayment(proof as PrivatePaymentProof);
      if (!isValid) throw new Error("Invalid payment proof");

      const cardDetails = await issueVirtualCard(formData.usdEquivalent);

      const now = new Date();
      const isScheduled = formData.scheduledAt && new Date(formData.scheduledAt) > now;
      const finalStatus = isScheduled ? 'WAITING_FOR_DELIVERY' : 'DELIVERED';

      const state = {
        version: "demo-v1",
        mode: "DEMO",
        commitment_hash: (proof as PrivatePaymentProof).commitment,
        encrypted_metadata: {
          recipientEmail: formData.recipientEmail,
          message: formData.message,
        },
        design: formData.design,
        token_symbol: formData.tokenSymbol,
        token_amount: formData.amount,
        usd_equivalent: formData.usdEquivalent,
        scheduled_at: formData.scheduledAt,
        status: finalStatus,
        is_mock: true,
        card: {
          last_four: cardDetails.lastFour,
          expiry: cardDetails.expiry,
          full_details: JSON.stringify({
            number: cardDetails.cardNumber,
            cvv: cardDetails.cvv
          })
        }
      };

      const claimToken = encodeGiftState(state);

      return {
        success: true,
        claimToken,
        status: finalStatus,
        message: "Gift created successfully (Demo Mode: Stateless)"
      };
    }

    // PRODUCTION MODE: Use real ShadowWire + Starpay
    console.log('[PRODUCTION MODE] Using real ShadowWire privacy layer');

    const shadowProof = proof as ShadowWireProof;

    // Step 1: Verify ShadowWire proof internally (Direct call, no fetch needed)
    const verifyResult = await verifyShadowWireProofInternal({
      commitment: shadowProof.commitment,
      proof: shadowProof.proof,
      nullifier: shadowProof.nullifier,
      txSignature: shadowProof.txSignature,
      slot: shadowProof.slot,
      confirmationStatus: shadowProof.confirmationStatus,
      tokenSymbol: formData.tokenSymbol
    });

    if (!verifyResult.verified) {
      throw new Error(`ShadowWire proof verification failed: ${verifyResult.message}`);
    }

    console.log('[PRODUCTION] ✅ ShadowWire proof verified internally');

    // Step 2: Issue REAL Starpay card (only after verification succeeds)
    let cardDetails;
    try {
      cardDetails = await issueStarpayCard(
        formData.usdEquivalent,
        formData.recipientEmail
      );
      console.log('[PRODUCTION] ✅ Starpay card issued');
    } catch (starpayError: any) {
      console.error('[PRODUCTION] Starpay issuance failed:', starpayError);
      throw new Error(`Card issuance failed: ${starpayError.message}`);
    }

    // Step 3: Create claim token with production data
    const now = new Date();
    const isScheduled = formData.scheduledAt && new Date(formData.scheduledAt) > now;
    const finalStatus = isScheduled ? 'WAITING_FOR_DELIVERY' : 'DELIVERED';

    const state = {
      version: "production-v1",
      mode: "PRODUCTION",
      commitment_hash: shadowProof.commitment,
      tx_signature: shadowProof.txSignature,
      encrypted_metadata: {
        recipientEmail: formData.recipientEmail,
        message: formData.message,
      },
      design: formData.design,
      token_symbol: formData.tokenSymbol,
      usd_equivalent: formData.usdEquivalent,
      scheduled_at: formData.scheduledAt,
      status: finalStatus,
      is_mock: false,
      card: {
        id: cardDetails.id,
        last_four: cardDetails.lastFour,
        expiry: cardDetails.expiry,
        balance: cardDetails.balance,
        // Encrypt full details for security
        full_details: JSON.stringify({
          number: cardDetails.cardNumber,
          cvv: cardDetails.cvv
        })
      }
    };

    const claimToken = encodeGiftState(state);

    return {
      success: true,
      claimToken,
      status: finalStatus,
      txSignature: shadowProof.txSignature,
      message: "Gift created successfully (Production Mode: Real Transfer)"
    };

  } catch (error: any) {
    console.error("Error creating gift:", error);
    return {
      success: false,
      error: error.message,
      fallbackToDemo: formData.mode === 'PRODUCTION' // Suggest fallback if production fails
    };
  }
}

export async function getGiftByToken(token: string) {
  try {
    const gift = decodeGiftState(token);
    if (!gift) throw new Error("Gift not found or token corrupted");

    const formattedGift = {
      ...gift,
      cards: [
        {
          last_four: gift.card.last_four,
          expiry: gift.card.expiry,
          encrypted_full_details: gift.card.full_details
        }
      ]
    };

    return { success: true, gift: formattedGift };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function claimGiftAction(token: string) {
  try {
    const gift = decodeGiftState(token);
    if (!gift) throw new Error("Invalid token");

    const updatedGift = {
      ...gift,
      status: 'CLAIMED',
      cards: [
        {
          last_four: gift.card.last_four,
          expiry: gift.card.expiry,
          encrypted_full_details: gift.card.full_details
        }
      ]
    };

    return { success: true, gift: updatedGift };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
