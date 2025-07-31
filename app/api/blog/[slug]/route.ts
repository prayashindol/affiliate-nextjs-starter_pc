import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/lib/services/blog';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const post = await BlogService.getPostBySlug(slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('API Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' }, 
      { status: 500 }
    );
  }
}