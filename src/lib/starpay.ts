export type StarPayCardProps = {
  amount: number;
  currency: string;
  type: 'Visa' | 'Mastercard';
};

export const issueVirtualCard = async ({
  amount,
  currency,
  type
}: StarPayCardProps) => {
  try {
    const mockCard = {
      id: `sp_${Math.random().toString(36).substr(2, 9)}`,
      status: 'active',
      card_token: `tok_${Math.random().toString(36).substr(2, 16)}`,
      last4: '1234',
      expiry: '12/28',
      brand: type,
      amount: amount,
      currency: currency
    };
    return { success: true, card: mockCard };
  } catch (error) {
    console.error('StarPay issuance error:', error);
    return { success: false, error: 'Failed to issue virtual card' };
  }
};
 
 
 
