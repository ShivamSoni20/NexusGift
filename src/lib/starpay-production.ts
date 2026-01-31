/**
 * PRODUCTION STARPAY INTEGRATION
 * Real virtual card issuance via Starpay API
 */

export interface StarpayCardDetails {
    id: string;
    cardNumber: string;
    cvv: string;
    expiry: string;
    lastFour: string;
    balance: number;
    isReal: boolean;
}

export interface StarpayConfig {
    enabled: boolean;
    apiKey?: string;
    apiEndpoint?: string;
}

/**
 * Initialize Starpay configuration
 * Note: These are server-side only variables
 */
export function initStarpay(): StarpayConfig {
    const apiKey = process.env.STARPAY_API_KEY;
    const apiEndpoint = process.env.STARPAY_ENDPOINT || 'https://api.starpayinfo.com';
    const isPubliclyEnabled = process.env.NEXT_PUBLIC_STARPAY_ENABLED === 'true';

    return {
        enabled: !!apiKey || isPubliclyEnabled,
        apiKey,
        apiEndpoint
    };
}

/**
 * Issue a real Starpay virtual card
 */
export async function issueStarpayCard(
    usdAmount: number,
    recipientEmail: string
): Promise<StarpayCardDetails> {
    const config = initStarpay();

    if (!config.enabled || !config.apiKey) {
        throw new Error('Starpay is not configured. Missing API key.');
    }

    try {
        console.log('[STARPAY PRODUCTION] Issuing card for $', usdAmount);

        // Calculate issuance fee (0.2% with min $5, max $500)
        const feePercent = 0.002;
        const rawFee = usdAmount * feePercent;
        const fee = Math.max(5, Math.min(500, rawFee));
        const totalAmount = usdAmount + fee;

        console.log('[STARPAY] Fee:', fee, 'Total:', totalAmount);

        // Make API call to Starpay
        const response = await fetch(`${config.apiEndpoint}/v1/cards/issue`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${config.apiKey}`,
            },
            body: JSON.stringify({
                amount: usdAmount,
                currency: 'USD',
                cardType: 'BLACK', // Starpay Black - prepaid, non-reloadable
                recipientEmail,
                metadata: {
                    source: 'NexusGift',
                    timestamp: new Date().toISOString()
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Starpay API error: ${error.message || response.statusText}`);
        }

        const data = await response.json();

        // Parse Starpay response
        return {
            id: data.cardId,
            cardNumber: data.cardNumber,
            cvv: data.cvv,
            expiry: data.expiryDate,
            lastFour: data.cardNumber.slice(-4),
            balance: usdAmount,
            isReal: true
        };
    } catch (error: any) {
        console.error('[STARPAY] Card issuance failed:', error);
        throw new Error(`Failed to issue Starpay card: ${error.message}`);
    }
}

/**
 * Get card details by ID
 */
export async function getStarpayCard(cardId: string): Promise<StarpayCardDetails | null> {
    const config = initStarpay();

    if (!config.enabled || !config.apiKey) {
        return null;
    }

    try {
        const response = await fetch(`${config.apiEndpoint}/v1/cards/${cardId}`, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
            }
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return {
            id: data.cardId,
            cardNumber: data.cardNumber,
            cvv: data.cvv,
            expiry: data.expiryDate,
            lastFour: data.cardNumber.slice(-4),
            balance: data.balance,
            isReal: true
        };
    } catch (error) {
        console.error('[STARPAY] Failed to fetch card:', error);
        return null;
    }
}

/**
 * Check Starpay balance and availability
 */
export async function checkStarpayAvailability(): Promise<{
    available: boolean;
    error?: string;
}> {
    const config = initStarpay();

    if (!config.enabled) {
        return {
            available: false,
            error: 'Starpay API key not configured'
        };
    }

    try {
        // Ping the API to check availability
        const response = await fetch(`${config.apiEndpoint}/v1/health`, {
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
            }
        });

        return {
            available: response.ok
        };
    } catch (error: any) {
        return {
            available: false,
            error: error.message
        };
    }
}
