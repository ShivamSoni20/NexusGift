"use server";

import { verifyPrivatePayment, PrivatePaymentProof } from "@/lib/privacy";
import { issueVirtualCard } from "@/lib/issuance";

/**
 * STATELESS ACTIONS FOR HACKATHON DEMO
 * All state is encoded into the claim token itself.
 * No database required.
 */

function encodeGiftState(data: any) {
  // In a real app, this would be a signed JWT.
  // For the demo, we use Base64 encoding.
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

export async function createGiftAction(formData: {
  recipientEmail: string;
  amount: number;
  tokenSymbol: string;
  usdEquivalent: number;
  message: string;
  design: string;
  scheduledAt?: string;
  proof: PrivatePaymentProof;
}) {
  try {
    // 1. Verify Private Payment Proof (Simulated)
    const isValid = await verifyPrivatePayment(formData.proof);
    if (!isValid) throw new Error("Invalid payment proof");

    // 2. Issue Virtual Card via Mock Starpay
    const cardDetails = await issueVirtualCard(formData.usdEquivalent);

    // 3. Determine Initial Status
    const now = new Date();
    const isScheduled = formData.scheduledAt && new Date(formData.scheduledAt) > now;
    const finalStatus = isScheduled ? 'WAITING_FOR_DELIVERY' : 'DELIVERED';

    // 4. Encode EVERYTHING into the claim token
    // This makes the project completely stateless
    const state = {
      version: "demo-v1",
      commitment_hash: formData.proof.commitment,
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
        // In demo mode, we "encrypt" (encode) the full details into the token
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
  } catch (error: any) {
    console.error("Error creating gift:", error);
    return { success: false, error: error.message };
  }
}

export async function getGiftByToken(token: string) {
  try {
    const gift = decodeGiftState(token);
    if (!gift) throw new Error("Gift not found or token corrupted");

    // Format for frontend compatibility
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

    // Since we are stateless, "claiming" just returns the gift with a CLAIMED status
    // In a real app, the database prevents double claims.
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
