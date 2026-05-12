import { NextRequest, NextResponse } from 'next/server';
import { dadataQuery } from '@/lib/dadata/client';
import { rateLimit } from '@/lib/rate-limit';
import type { DadataEntity } from '@/lib/dadata/constants';
import { DADATA_ENDPOINTS } from '@/lib/dadata/constants';

export async function GET(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const { entity } = await params;
  const q = req.nextUrl.searchParams.get('q') || '';

  if (!(entity in DADATA_ENDPOINTS)) {
    return NextResponse.json({ error: 'Unknown entity' }, { status: 400 });
  }

  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for') || 'unknown';
  const limit = rateLimit(ip, 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const data = await dadataQuery(entity as DadataEntity, q);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
}
