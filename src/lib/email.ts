import { Resend } from 'resend';

// Helper to get safe sender address
const getSender = () => {
    const customFrom = process.env.RESEND_FROM_EMAIL;
    if (customFrom) return customFrom;
    return 'NexusGift <onboarding@resend.dev>';
};

interface SendGiftEmailParams {
    recipientEmail: string;
    claimLink: string;
    message: string;
    amount: number;
    tokenSymbol: string;
}

export async function sendGiftEmail({
    recipientEmail,
    claimLink,
    message,
    amount,
    tokenSymbol
}: SendGiftEmailParams) {
    const apiKey = process.env.RESEND_API_KEY;

    // runtime check for API key
    if (!apiKey) {
        console.warn('[EMAIL] RESEND_API_KEY is missing. Falling back to mock logger.');
        console.log('------------------------------------------');
        console.log('[MOCK EMAIL SERVICE]');
        console.log(`TO: ${recipientEmail}`);
        console.log(`FROM: ${getSender()}`);
        console.log(`SUBJECT: You received a confidential gift!`);
        console.log(`MESSAGE: ${message}`);
        console.log(`CLAIM LINK: ${claimLink}`);
        console.log('------------------------------------------');
        return { success: true, mocked: true };
    }

    const resend = new Resend(apiKey);

    try {
        const { data, error } = await resend.emails.send({
            from: getSender(),
            to: recipientEmail,
            subject: 'You received a confidential gift via NexusGift!',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #050505; color: #ffffff; border: 1px solid #d4af37;">
          <h1 style="color: #d4af37; font-style: italic;">NexusGift</h1>
          <p style="font-size: 16px; line-height: 1.5;">You have received a confidential digital gift.</p>
          <div style="background-color: #1a1a1a; padding: 20px; margin: 20px 0; border-left: 4px solid #d4af37;">
            <p style="font-style: italic; color: #a0a0a0; margin: 0;">"${message || 'A confidential gift has been secured for you.'}"</p>
          </div>
          <p style="font-size: 18px; font-weight: bold;">Amount: <span style="color: #d4af37;">${amount} ${tokenSymbol}</span></p>
          <div style="margin: 40px 0; text-align: center;">
            <a href="${claimLink}" style="background-color: #ffffff; color: #050505; padding: 15px 30px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">Claim Your Gift Card</a>
          </div>
          <div style="margin-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #666666;">Or copy this link: <a href="${claimLink}" style="color: #d4af37;">${claimLink}</a></p>
          </div>
          <p style="font-size: 12px; color: #666666; margin-top: 30px; border-top: 1px solid #333; padding-top: 10px;">
            This gift was sent via ShadowWire protocol on Solana. It is stateless and encrypted until claimed.
          </p>
        </div>
      `,
        });

        if (error) {
            console.error('[EMAIL ERROR] Resend API returned error:', error);
            return { success: false, error };
        }

        console.log(`[EMAIL] Sent successfully to ${recipientEmail} (ID: ${data?.id})`);
        return { success: true, data };
    } catch (err) {
        console.error('[EMAIL EXCEPTION] Unexpected error sending email:', err);
        return { success: false, error: err };
    }
}
