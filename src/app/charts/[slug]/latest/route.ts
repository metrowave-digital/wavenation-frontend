import { NextResponse } from 'next/server';
import { getCharts, WNChart } from '@/services/charts.api';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  // 🚨 CHANGED: We now look for { slug: string } instead of category
  context: { params: Promise<{ slug: string }> | { slug: string } } 
) {
  try {
    const resolvedParams = await context.params;
    // 🚨 CHANGED: Extracting 'slug' from the params
    const requestedCategory = resolvedParams.slug.toLowerCase();

    const response = await getCharts({ limit: 100 }); 
    const allCharts = (response?.docs || []) as WNChart[];

    const latest = allCharts.find(c => {
      const isMatch = c.chartKey?.toLowerCase() === requestedCategory;
      const isPublished = c._status === 'published' || c.status === 'published';
      return isMatch && isPublished;
    });

    if (latest?.slug) {
      return NextResponse.redirect(new URL(`/charts/${latest.slug}`, request.url));
    }
  } catch (error) {
    console.error("Error fetching charts for redirect:", error);
  }

  return NextResponse.redirect(new URL('/charts', request.url));
}