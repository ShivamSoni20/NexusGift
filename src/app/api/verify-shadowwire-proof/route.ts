import { NextRequest, NextResponse } from 'next/server';
import { verifyShadowWireProofInternal } from '@/lib/shadowwire-verify';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

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
            { verified: false, message: 'Internal verification error' },
            { status: 500 }
        );
    }
}

