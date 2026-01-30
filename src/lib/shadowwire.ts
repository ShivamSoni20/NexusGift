import { ShadowWireClient } from '@radr/shadowwire';

export const shadowWireClient = new ShadowWireClient({
  debug: process.env.NODE_ENV === 'development'
});

export type ShadowWirePaymentProps = {
  sender: string;
  recipient: string;
  amount: number;
  token: string;
  type: 'internal' | 'external';
};

export const processPrivatePayment = async ({
  sender,
  recipient,
  amount,
  token,
  type
}: ShadowWirePaymentProps) => {
  try {
    const result = await shadowWireClient.transfer({
      sender,
      recipient,
      amount,
      token,
      type
    });
    return { success: true, signature: result.tx_signature };
  } catch (error) {
    console.error('ShadowWire payment error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
