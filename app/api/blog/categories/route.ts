import { NextResponse } from 'next/server';
import { WordPressService } from '@/lib/services/wordpress';

export async function GET() {
  try {
    const categories = await WordPressService.getCategories();
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error fetching WordPress categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
}