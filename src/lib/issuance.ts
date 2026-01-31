// Mock Starpay Card Issuance Service for Hackathon Demo
export interface CardDetails {
  id: string;
  cardNumber: string;
  cvv: string;
  expiry: string;
  lastFour: string;
}

export async function issueVirtualCard(amount: number): Promise<CardDetails> {
  // MOCKED: Simulation of Starpay Virtual Card Issuance
  console.log(`[MOCK STARPAY] Issuing virtual card loaded with $${amount}...`);
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Deterministic but realistic mock data
  const id = "mock_starpay_" + Math.random().toString(36).substring(2, 10);

  // Generate a realistic looking card number (mocked)
  const cardNumber = `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
  const cvv = Math.floor(100 + Math.random() * 900).toString();
  const expiry = "12/28";
  const lastFour = cardNumber.slice(-4);

  return { id, cardNumber, cvv, expiry, lastFour };
}
