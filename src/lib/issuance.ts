// Mocked Starpay Card Issuance API for Hackathon
export interface CardDetails {
  id: string;
  cardNumber: string;
  cvv: string;
  expiry: string;
  lastFour: string;
}

export async function issueVirtualCard(amount: number): Promise<CardDetails> {
  // Simulate Starpay API call
  console.log(`Issuing virtual card loaded with $${amount}...`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const id = "starpay_" + Math.random().toString(36).substring(2, 10);
  const cardNumber = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join(" ");
  const cvv = Math.floor(100 + Math.random() * 900).toString();
  const expiry = "12/28";
  const lastFour = cardNumber.slice(-4);
  
  return { id, cardNumber, cvv, expiry, lastFour };
}
