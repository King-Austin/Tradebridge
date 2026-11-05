import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { buyerAddress, amountUSDC } = await req.json();

    if (!buyerAddress || !amountUSDC) {
      return NextResponse.json(
        { error: 'Missing buyerAddress or amountUSDC' },
        { status: 400 }
      );
    }

    // In a live testnet deployment, this executes MockUSDC.mint(buyerAddress, parseUnits(amountUSDC, 6))
    // using the DEPLOYER_PRIVATE_KEY from environment variables.
    console.log(`[Mock Mint] Minting ${amountUSDC} mUSDC to recipient: ${buyerAddress}`);

    const simulatedTxHash = `0xmint${Date.now()}${Math.floor(Math.random() * 100000)}`;

    return NextResponse.json({
      success: true,
      recipient: buyerAddress,
      amount: amountUSDC,
      txHash: simulatedTxHash,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[Mock Mint Error]', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

