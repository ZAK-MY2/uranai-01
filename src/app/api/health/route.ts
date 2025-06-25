import { NextResponse } from 'next/server';
import { getHealthMetrics } from '@/lib/monitoring/setup';

export async function GET() {
  try {
    const healthMetrics = getHealthMetrics();
    
    const status = healthMetrics.status === 'healthy' ? 200 : 
                  healthMetrics.status === 'degraded' ? 200 : 503;
    
    return NextResponse.json({
      status: healthMetrics.status,
      timestamp: new Date().toISOString(),
      uptime: healthMetrics.uptime,
      memory: healthMetrics.memory,
      performance: healthMetrics.performance,
      errors: healthMetrics.errors,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV
    }, { status });
    
  } catch (_error) {
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}