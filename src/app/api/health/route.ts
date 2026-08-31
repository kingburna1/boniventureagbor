export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const startTime = Date.now();
  try {
    // Perform lightweight database query to keep Supabase pool awake & verify health
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: 'ok',
        database: 'connected',
        latencyMs: `${latencyMs}ms`,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    console.error('❌ Health Check Database Ping Failed:', error?.message || error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        latencyMs: `${latencyMs}ms`,
        error: error?.message || 'Database connection error',
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    );
  }
}
