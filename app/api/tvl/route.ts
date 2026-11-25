import { NextResponse } from 'next/server';
import { getTVL } from '@/lib/stellar';

export async function GET() {
  const { value, ...metric } = await getTVL();
  return NextResponse.json({ tvl: value, ...metric });
}
