import { NextResponse } from 'next/server';
import { getTVL } from '@/lib/stellar';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tvl = await getTVL();
    return NextResponse.json({ tvl });
  } catch (error) {
    console.error('Error fetching TVL:', error);
    return NextResponse.json({ error: 'Failed to fetch TVL' }, { status: 502 });
  }
}
