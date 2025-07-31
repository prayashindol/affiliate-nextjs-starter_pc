import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const search = searchParams.get('search') || undefined;
    const author = searchParams.get('author') || undefined;
    
    const response = await BlogService.getAllPosts({
      page,
      limit,
      category,
      tag,
      search,
      author
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' }, 
      { status: 500 }
    );
  }
}