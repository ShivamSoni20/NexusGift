import { NextRequest, NextResponse } from 'next/server';
import { verifyShadowWireProofInternal } from '@/lib/shadowwire-verify';

export async function POST(request: NextRequest) {
    try {
        // REQUIREMENT 1: Trace raw body
        const rawBody = await request.text();
        console.log("[API RAW BODY]", rawBody);

        const body = JSON.parse(rawBody);

        // REQUIREMENT 2 & 4: Payload validation
        if (!body.txSignature) {
            console.error('[API] Missing txSignature in payload');
            return NextResponse.json(
                { verified: false, message: 'txSignature missing from payload' },
                { status: 400 }
            );
        }

        console.log("[API] Processing txSignature:", body.txSignature, typeof body.txSignature, body.txSignature?.length);

        const result = await verifyShadowWireProofInternal(body);

        if (!result.verified) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json({
            ...result,
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        console.error('[API] Verification error:', error);
        return NextResponse.json(
            { verified: false, message: error.message || 'Internal verification error' },
            { status: 500 }
        );
    }
}

