"use server";

import { supabase } from "@/lib/supabase";
import { verifyPrivatePayment, PrivatePaymentProof } from "@/lib/privacy";
import { issueVirtualCard } from "@/lib/issuance";

export async function createGiftAction(formData: {
  recipientEmail: string;
  amount: number;
  message: string;
  design: string;
  proof: PrivatePaymentProof;
}) {
  try {
    // 1. Create Gift Record in Supabase (State: CREATED)
    const claimToken = crypto.randomUUID();
    const { data: gift, error: giftError } = await supabase
      .from('gifts')
      .insert({
        commitment_hash: formData.proof.commitment,
        encrypted_metadata: {
          recipientEmail: formData.recipientEmail,
          message: formData.message,
        },
        design: formData.design,
        status: 'CREATED',
        claim_token: claimToken
      })
      .select()
      .single();

    if (giftError) throw giftError;

    // 2. Verify Private Payment Proof (Move to FUNDED)
    const isValid = await verifyPrivatePayment(formData.proof);
    if (!isValid) {
      await supabase.from('gifts').update({ status: 'FAILED' }).eq('id', gift.id);
      throw new Error("Invalid payment proof");
    }

    await supabase.from('gifts').update({ status: 'FUNDED' }).eq('id', gift.id);

    // 3. Issue Virtual Card via Starpay (Move to CARD_ISSUED)
    const cardDetails = await issueVirtualCard(formData.amount);

    // 4. Store Card Details
    const { error: cardError } = await supabase
      .from('cards')
      .insert({
        gift_id: gift.id,
        card_id_external: cardDetails.id,
        last_four: cardDetails.lastFour,
        expiry: cardDetails.expiry,
        encrypted_full_details: JSON.stringify({
          number: cardDetails.cardNumber,
          cvv: cardDetails.cvv
        })
      });

    if (cardError) throw cardError;

    await supabase.from('gifts').update({ status: 'CARD_ISSUED' }).eq('id', gift.id);

    // 5. Mock Delivery (Move to DELIVERED)
    // In a real app, this is where SendGrid would be called
    await supabase.from('gifts').update({ status: 'DELIVERED' }).eq('id', gift.id);

    return { success: true, claimToken, status: 'DELIVERED' };
  } catch (error: any) {
    console.error("Error creating gift:", error);
    return { success: false, error: error.message };
  }
}

export async function getGiftByToken(token: string) {
  try {
    const { data: gift, error: giftError } = await supabase
      .from('gifts')
      .select('*, cards(*)')
      .eq('claim_token', token)
      .single();

    if (giftError) throw giftError;
    return { success: true, gift };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function claimGiftAction(token: string) {
  try {
    const { data: gift, error: giftError } = await supabase
      .from('gifts')
      .update({ status: 'CLAIMED' })
      .eq('claim_token', token)
      .select()
      .single();

    if (giftError) throw giftError;
    return { success: true, gift };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
