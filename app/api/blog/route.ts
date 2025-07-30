import { NextRequest, NextResponse } from 'next/server';
import { WordPressService } from '@/lib/services/wordpress';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '10');
    const categoryId = searchParams.get('category') ? parseInt(searchParams.get('category')!) : undefined;
    const search = searchParams.get('search') || undefined;
    
    const response = await WordPressService.getPosts(page, perPage, categoryId, search);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error fetching WordPress posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' }, 
      { status: 500 }
    );
  }
}