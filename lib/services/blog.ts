import { BlogPost, BlogCategory, BlogResponse, BlogFilters } from '../types/blog';

// Sample blog posts that simulate imported WordPress content
const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Complete Guide to Airbnb Photography: Boost Your Bookings with Stunning Images',
    slug: 'complete-guide-airbnb-photography-boost-bookings',
    excerpt: 'Learn professional photography techniques to showcase your short-term rental property and attract more guests with compelling visuals.',
    content: `
      <p>Professional photography is one of the most important investments you can make for your short-term rental property. Studies show that listings with high-quality photos receive 40% more bookings than those with amateur photos.</p>
      
      <h2>Essential Equipment</h2>
      <p>You don't need expensive equipment to take great photos. A modern smartphone with a good camera can produce excellent results when used correctly.</p>
      
      <h2>Lighting Tips</h2>
      <p>Natural light is your best friend. Shoot during the "golden hour" - the hour after sunrise or before sunset - for the most flattering light.</p>
      
      <h2>Composition Techniques</h2>
      <p>Use the rule of thirds, leading lines, and symmetry to create visually appealing photos that tell a story about your space.</p>
    `,
    category: 'Marketing',
    tags: ['photography', 'marketing', 'airbnb', 'bookings'],
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b94e?w=64&h=64&fit=crop&crop=face'
    },
    featured_image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
    published_at: '2024-01-15T10:00:00Z',
    status: 'published',
    read_time: 8
  },
  {
    id: '2',
    title: 'Dynamic Pricing Strategies for Short-Term Rentals in 2024',
    slug: 'dynamic-pricing-strategies-short-term-rentals-2024',
    excerpt: 'Maximize your revenue with advanced pricing strategies that adapt to market demand, seasonality, and local events.',
    content: `
      <p>Dynamic pricing is crucial for maximizing revenue in the competitive short-term rental market. By adjusting your rates based on demand, you can increase profits by up to 30%.</p>
      
      <h2>Understanding Market Demand</h2>
      <p>Monitor local events, holidays, and seasonal trends that affect demand in your area. Tools like AirDNA and PriceLabs can provide valuable market insights.</p>
      
      <h2>Automation Tools</h2>
      <p>Consider using pricing automation tools that adjust your rates in real-time based on market conditions and competitor pricing.</p>
    `,
    category: 'Pricing',
    tags: ['pricing', 'revenue', 'automation', 'strategy'],
    author: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face'
    },
    featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    published_at: '2024-01-12T14:30:00Z',
    status: 'published',
    read_time: 6
  },
  {
    id: '3',
    title: 'Guest Communication Best Practices: From Inquiry to Checkout',
    slug: 'guest-communication-best-practices-inquiry-checkout',
    excerpt: 'Master the art of guest communication to improve reviews, reduce issues, and create memorable experiences for your guests.',
    content: `
      <p>Excellent communication is the foundation of successful short-term rental hosting. It starts before the guest arrives and continues even after they leave.</p>
      
      <h2>Pre-Arrival Communication</h2>
      <p>Send a welcome message with check-in instructions, local recommendations, and answers to frequently asked questions.</p>
      
      <h2>During the Stay</h2>
      <p>Be available for questions but respect your guests' privacy. A simple check-in message can prevent small issues from becoming big problems.</p>
    `,
    category: 'Guest Experience',
    tags: ['communication', 'guest-experience', 'reviews', 'hosting'],
    author: {
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
    },
    featured_image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    published_at: '2024-01-10T09:15:00Z',
    status: 'published',
    read_time: 5
  },
  {
    id: '4',
    title: 'Legal Considerations for Short-Term Rental Hosts in 2024',
    slug: 'legal-considerations-short-term-rental-hosts-2024',
    excerpt: 'Stay compliant with local regulations, tax requirements, and insurance considerations for your short-term rental business.',
    content: `
      <p>The regulatory landscape for short-term rentals continues to evolve. It's crucial to stay informed about local laws and compliance requirements.</p>
      
      <h2>Local Regulations</h2>
      <p>Many cities have specific licensing requirements, occupancy limits, and operational restrictions for short-term rentals.</p>
      
      <h2>Tax Obligations</h2>
      <p>Understand your tax obligations, including income tax, occupancy tax, and sales tax that may apply to your rental income.</p>
    `,
    category: 'Legal',
    tags: ['legal', 'regulations', 'compliance', 'taxes'],
    author: {
      name: 'David Martinez',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face'
    },
    featured_image: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&h=400&fit=crop',
    published_at: '2024-01-08T16:45:00Z',
    status: 'published',
    read_time: 7
  },
  {
    id: '5',
    title: 'Essential Amenities That Guests Love in 2024',
    slug: 'essential-amenities-guests-love-2024',
    excerpt: 'Discover which amenities modern travelers value most and how to provide them without breaking your budget.',
    content: `
      <p>Guest expectations continue to evolve. Providing the right amenities can significantly impact your booking rate and guest satisfaction scores.</p>
      
      <h2>Tech Amenities</h2>
      <p>High-speed Wi-Fi, smart TVs, and USB charging stations are now considered essential by most guests.</p>
      
      <h2>Comfort Upgrades</h2>
      <p>Quality bedding, blackout curtains, and temperature control can dramatically improve guest satisfaction.</p>
    `,
    category: 'Property Management',
    tags: ['amenities', 'guest-satisfaction', 'property-improvement', 'technology'],
    author: {
      name: 'Lisa Park',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
    },
    featured_image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=400&fit=crop',
    published_at: '2024-01-05T11:20:00Z',
    status: 'published',
    read_time: 4
  },
  {
    id: '6',
    title: 'Channel Management: Maximizing Visibility Across Platforms',
    slug: 'channel-management-maximizing-visibility-platforms',
    excerpt: 'Learn how to effectively manage your listings across multiple booking platforms to increase exposure and bookings.',
    content: `
      <p>Multi-channel distribution is essential for maximizing your property's visibility and booking potential. However, managing multiple platforms requires strategy and organization.</p>
      
      <h2>Platform Selection</h2>
      <p>Choose platforms based on your target market, property type, and local demand patterns. Airbnb, VRBO, and Booking.com each serve different traveler segments.</p>
      
      <h2>Pricing Synchronization</h2>
      <p>Ensure consistent pricing across platforms while accounting for different commission structures and fee models.</p>
    `,
    category: 'Marketing',
    tags: ['channel-management', 'distribution', 'marketing', 'platforms'],
    author: {
      name: 'Robert Kim',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face'
    },
    featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    published_at: '2024-01-03T13:10:00Z',
    status: 'published',
    read_time: 6
  }
];

const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: '1',
    name: 'Marketing',
    slug: 'marketing',
    description: 'Tips and strategies for marketing your short-term rental property',
    post_count: 2
  },
  {
    id: '2',
    name: 'Pricing',
    slug: 'pricing',
    description: 'Pricing strategies and revenue optimization techniques',
    post_count: 1
  },
  {
    id: '3',
    name: 'Guest Experience',
    slug: 'guest-experience',
    description: 'Improving guest satisfaction and communication',
    post_count: 1
  },
  {
    id: '4',
    name: 'Legal',
    slug: 'legal',
    description: 'Legal considerations and compliance for hosts',
    post_count: 1
  },
  {
    id: '5',
    name: 'Property Management',
    slug: 'property-management',
    description: 'Tips for managing and maintaining your rental property',
    post_count: 1
  }
];

export class BlogService {
  static async getAllPosts(filters: BlogFilters = {}): Promise<BlogResponse> {
    let filteredPosts = [...SAMPLE_BLOG_POSTS];

    // Apply category filter
    if (filters.category) {
      filteredPosts = filteredPosts.filter(post => 
        post.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }

    // Apply tag filter
    if (filters.tag) {
      filteredPosts = filteredPosts.filter(post =>
        post.tags.some(tag => tag.toLowerCase().includes(filters.tag?.toLowerCase() || ''))
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );
    }

    // Apply author filter
    if (filters.author) {
      filteredPosts = filteredPosts.filter(post =>
        post.author.name.toLowerCase().includes(filters.author?.toLowerCase() || '')
      );
    }

    // Sort by published date (newest first)
    filteredPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

    return {
      pagination: {
        page,
        limit,
        total: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / limit)
      },
      posts: paginatedPosts,
      categories: BLOG_CATEGORIES
    };
  }

  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    return SAMPLE_BLOG_POSTS.find(post => post.slug === slug) || null;
  }

  static async getCategories(): Promise<BlogCategory[]> {
    return BLOG_CATEGORIES;
  }

  static async getPostsByCategory(categorySlug: string, limit: number = 10): Promise<BlogPost[]> {
    const category = BLOG_CATEGORIES.find(cat => cat.slug === categorySlug);
    if (!category) return [];

    return SAMPLE_BLOG_POSTS
      .filter(post => post.category.toLowerCase() === category.name.toLowerCase())
      .slice(0, limit);
  }

  static async getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
    const currentPost = SAMPLE_BLOG_POSTS.find(post => post.id === postId);
    if (!currentPost) return [];

    // Find posts with similar tags or same category
    const relatedPosts = SAMPLE_BLOG_POSTS
      .filter(post => post.id !== postId)
      .filter(post => 
        post.category === currentPost.category ||
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, limit);

    return relatedPosts;
  }
}