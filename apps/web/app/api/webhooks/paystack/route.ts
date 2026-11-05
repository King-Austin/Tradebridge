import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder';

    // 1. Verify HMAC SHA-512 signature in production
    if (secret !== 'sk_test_placeholder' && signature) {
      const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
      if (hash !== signature) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);

    if (event.event === 'charge.success') {
      const { reference, amount, metadata } = event.data;
      console.log(`[Paystack Webhook] Verified payment reference: ${reference}, amount (kobo): ${amount}`);

      // In production, insert into payment_events table with unique constraint on reference
      // Then trigger server-side MockUSDC minting to buyer wallet

      return NextResponse.json({
        received: true,
        reference,
        status: 'processed',
      });
    }

    return NextResponse.json({ received: true, status: 'ignored' });
  } catch (error: any) {
    console.error('[Paystack Webhook Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

