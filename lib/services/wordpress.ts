import { 
  WordPressPost, 
  WordPressCategory, 
  WordPressMedia, 
  WordPressUser, 
  BlogPost, 
  WordPressApiResponse 
} from '../types/wordpress';
import { SAMPLE_BLOG_POSTS, SAMPLE_CATEGORIES } from '../data/sampleBlogData';

const WORDPRESS_API_BASE = 'https://strspecialist.com/wp-json/wp/v2';

// WordPress Application Password credentials
const WP_USERNAME = 'Nextjs Migration';
const WP_PASSWORD = 'M1hi 8jId kzJW Asfq cTxd KT2Z';

export class WordPressService {
  private static getAuthHeaders(): HeadersInit {
    const credentials = btoa(`${WP_USERNAME}:${WP_PASSWORD}`);
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };
  }

  private static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      // Cache for 5 minutes to avoid excessive requests
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`WordPress API error: ${response.status} ${response.statusText}`);
    }

    return response;
  }

  static async getPosts(
    page: number = 1, 
    perPage: number = 10,
    categoryId?: number,
    search?: string
  ): Promise<WordPressApiResponse<BlogPost>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        status: 'publish',
        _embed: 'true', // Include embedded data like author, featured media
      });

      if (categoryId) {
        params.append('categories', categoryId.toString());
      }

      if (search) {
        params.append('search', search);
      }

      const url = `${WORDPRESS_API_BASE}/posts?${params.toString()}`;
      const response = await this.fetchWithAuth(url);
      
      const posts: WordPressPost[] = await response.json();
      const totalHeader = response.headers.get('X-WP-Total');
      const totalPagesHeader = response.headers.get('X-WP-TotalPages');
      
      // Transform WordPress posts to our BlogPost format
      const transformedPosts = await Promise.all(
        posts.map(post => this.transformPost(post))
      );

      return {
        data: transformedPosts,
        total: totalHeader ? parseInt(totalHeader) : posts.length,
        totalPages: totalPagesHeader ? parseInt(totalPagesHeader) : 1,
        page,
        perPage
      };
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      
      // Return sample data when WordPress API is not accessible
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      let filteredPosts = SAMPLE_BLOG_POSTS;
      
      // Filter by category if specified
      if (categoryId) {
        filteredPosts = SAMPLE_BLOG_POSTS.filter(post => 
          post.categoryIds.includes(categoryId)
        );
      }
      
      // Filter by search if specified
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = filteredPosts.filter(post =>
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          post.excerpt.toLowerCase().includes(searchLower)
        );
      }
      
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
      
      return {
        data: paginatedPosts,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / perPage),
        page,
        perPage
      };
    }
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const url = `${WORDPRESS_API_BASE}/posts?slug=${slug}&_embed=true`;
      const response = await this.fetchWithAuth(url);
      const posts: WordPressPost[] = await response.json();
      
      if (posts.length === 0) {
        return null;
      }

      return this.transformPost(posts[0]);
    } catch (error) {
      console.error('Error fetching WordPress post by slug:', error);
      
      // Return sample data when WordPress API is not accessible
      const post = SAMPLE_BLOG_POSTS.find(p => p.slug === slug);
      return post || null;
    }
  }

  static async getCategories(): Promise<WordPressCategory[]> {
    try {
      const url = `${WORDPRESS_API_BASE}/categories?per_page=100`;
      const response = await this.fetchWithAuth(url);
      return response.json();
    } catch (error) {
      console.error('Error fetching WordPress categories:', error);
      
      // Return sample data when WordPress API is not accessible
      return SAMPLE_CATEGORIES;
    }
  }

  private static async transformPost(post: WordPressPost): Promise<BlogPost> {
    // Get author name from embedded data or fetch separately
    let authorName = 'Unknown Author';
    if (post._embedded?.author?.[0]?.name) {
      authorName = post._embedded.author[0].name;
    }

    // Get category names from embedded data or fetch separately  
    let categoryNames: string[] = [];
    if (post._embedded?.['wp:term']?.[0]) {
      categoryNames = post._embedded['wp:term'][0].map((cat: Record<string, unknown>) => (cat.name as string) || 'Unknown');
    }

    // Get featured image from embedded data
    let featuredImage: string | undefined;
    if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
    }

    return {
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      author: authorName,
      authorId: post.author,
      categories: categoryNames,
      categoryIds: post.categories,
      tags: [], // Will be populated if needed
      featuredImage,
      link: post.link,
      status: post.status,
    };
  }

  // Get recent posts for homepage or sidebar
  static async getRecentPosts(limit: number = 5): Promise<BlogPost[]> {
    try {
      const response = await this.getPosts(1, limit);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      
      // Return sample data when WordPress API is not accessible
      return SAMPLE_BLOG_POSTS.slice(0, limit);
    }
  }

  // Get posts by category
  static async getPostsByCategory(categoryId: number, page: number = 1, perPage: number = 10): Promise<WordPressApiResponse<BlogPost>> {
    return this.getPosts(page, perPage, categoryId);
  }

  // Search posts
  static async searchPosts(query: string, page: number = 1, perPage: number = 10): Promise<WordPressApiResponse<BlogPost>> {
    return this.getPosts(page, perPage, undefined, query);
  }
}