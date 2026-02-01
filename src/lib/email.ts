import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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
    if (!resend) {
        console.log('------------------------------------------');
        console.log('[MOCK EMAIL SERVICE]');
        console.log(`TO: ${recipientEmail}`);
        console.log(`SUBJECT: You received a confidential gift!`);
        console.log(`MESSAGE: ${message}`);
        console.log(`AMOUNT: ${amount} ${tokenSymbol}`);
        console.log(`CLAIM LINK: ${claimLink}`);
        console.log('------------------------------------------');
        return { success: true, mocked: true };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'NexusGift <onboarding@resend.dev>', // Replace with your domain in production
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
          <p style="font-size: 12px; color: #666666;">This gift was sent via ShadowWire protocol on Solana. It is stateless and encrypted until claimed.</p>
        </div>
      `,
        });

        if (error) {
            console.error('[EMAIL ERROR]', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('[EMAIL EXCEPTION]', err);
        return { success: false, error: err };
    }
}
