import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://leetcode-stats-api.herokuapp.com/adarsh__singh_',
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!res.ok) throw new Error(`Heroku API returned ${res.status}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[api/leetcode] fetch failed, serving fallback data:', error);
    // Fallback to static stats so the UI never breaks when Heroku is down
    return NextResponse.json({
      status: 'success',
      totalSolved: 554,
      rating: 1637,
      contributionPoints: 248, // used as streak fallback
    });
  }
}
