import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    const totalRequests = await redis.get('total_requests') || 0;
    return NextResponse.json({ totalRequests });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ totalRequests: 0 });
  }
} 
