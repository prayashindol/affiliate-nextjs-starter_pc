import { NextRequest, NextResponse } from 'next/server';
import { GoogleNewsRSSService } from '@/lib/services/google-news-rss';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const response = await GoogleNewsRSSService.getNewsByPage(page, limit);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' }, 
      { status: 500 }
    );
  }
}