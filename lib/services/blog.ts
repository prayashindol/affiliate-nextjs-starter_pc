import { BlogPost, BlogCategory, BlogResponse, BlogFilters } from '../types/blog';

// Generate sample blog posts to simulate imported WordPress content (400+ posts)
const generateSamplePosts = (): BlogPost[] => {
  const baseTopics = [
    'Airbnb Photography',
    'Dynamic Pricing Strategies',
    'Guest Communication',
    'Legal Considerations',
    'Essential Amenities',
    'Channel Management',
    'Property Maintenance',
    'Revenue Optimization',
    'Guest Experience',
    'Marketing Techniques',
    'Cleaning Protocols',
    'Safety Measures',
    'Local SEO',
    'Automation Tools',
    'Interior Design',
    'Seasonal Strategies',
    'Competition Analysis',
    'Customer Service',
    'Tax Planning',
    'Insurance Guide'
  ];

  const categories = ['Marketing', 'Pricing', 'Guest Experience', 'Legal', 'Property Management', 'Technology', 'Design', 'Finance'];
  const authors = [
    { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b94e?w=64&h=64&fit=crop&crop=face' },
    { name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face' },
    { name: 'Emma Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face' },
    { name: 'David Martinez', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face' },
    { name: 'Lisa Park', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face' },
    { name: 'Robert Kim', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face' }
  ];

  const images = [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop'
  ];

  const posts: BlogPost[] = [];
  
  // Generate posts for the last 2 years
  const now = new Date();
  const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
  
  for (let i = 0; i < 120; i++) {
    const topicIndex = i % baseTopics.length;
    const variation = Math.floor(i / baseTopics.length) + 1;
    const topic = baseTopics[topicIndex];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const author = authors[Math.floor(Math.random() * authors.length)];
    const image = images[Math.floor(Math.random() * images.length)];
    
    // Generate a date between two years ago and now
    const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
    const publishDate = new Date(randomTime);
    
    const title = variation === 1 ? 
      `The Complete Guide to ${topic}: Boost Your Bookings with Proven Strategies` :
      variation === 2 ?
      `${topic} in ${publishDate.getFullYear()}: Advanced Tips for Success` :
      variation === 3 ?
      `Mastering ${topic}: Essential Strategies for Short-Term Rental Hosts` :
      variation === 4 ?
      `${topic} Best Practices: From Beginner to Expert Level` :
      variation === 5 ?
      `Ultimate ${topic} Guide: Maximize Your Revenue and Guest Satisfaction` :
      `Professional ${topic}: Industry Secrets for Maximum Results`;
    
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    posts.push({
      id: (i + 1).toString(),
      title,
      slug,
      excerpt: `Discover professional techniques and strategies for ${topic.toLowerCase()} that will help you maximize your short-term rental success. Learn from industry experts and implement proven methods to boost your bookings and revenue.`,
      content: `
        <p>In the competitive world of short-term rentals, mastering ${topic.toLowerCase()} is crucial for success. This comprehensive guide will walk you through everything you need to know to excel in this area.</p>
        
        <h2>Why ${topic} Matters</h2>
        <p>${topic} plays a vital role in your property's success. Studies show that properties that excel in this area see up to 40% higher booking rates and significantly better guest satisfaction scores.</p>
        
        <h2>Getting Started</h2>
        <p>Before diving into advanced techniques, it's important to understand the fundamentals. Here are the key principles you need to know:</p>
        <ul>
          <li>Understand your target market and guest expectations</li>
          <li>Research competitors and industry best practices</li>
          <li>Set clear goals and metrics for success</li>
          <li>Create a systematic approach to implementation</li>
        </ul>
        
        <h2>Advanced Strategies</h2>
        <p>Once you've mastered the basics, these advanced strategies will help you stand out from the competition:</p>
        
        <h3>Strategy 1: Data-Driven Decision Making</h3>
        <p>Use analytics and market data to inform your decisions. Track key performance indicators and adjust your approach based on results.</p>
        
        <h3>Strategy 2: Guest-Centric Approach</h3>
        <p>Always prioritize the guest experience. Put yourself in your guests' shoes and think about what would make their stay memorable.</p>
        
        <h3>Strategy 3: Continuous Improvement</h3>
        <p>The short-term rental market is constantly evolving. Stay updated with industry trends and continuously refine your approach.</p>
        
        <h2>Common Mistakes to Avoid</h2>
        <p>Learn from common pitfalls that many hosts encounter:</p>
        <ul>
          <li>Neglecting regular maintenance and updates</li>
          <li>Underestimating the importance of guest communication</li>
          <li>Failing to adapt to seasonal changes and market conditions</li>
          <li>Overlooking local regulations and compliance requirements</li>
        </ul>
        
        <h2>Tools and Resources</h2>
        <p>Leverage these tools to streamline your operations and improve efficiency:</p>
        <ul>
          <li>Property management software for automation</li>
          <li>Analytics tools for performance tracking</li>
          <li>Communication platforms for guest interaction</li>
          <li>Professional services for specialized tasks</li>
        </ul>
        
        <h2>Measuring Success</h2>
        <p>Track these key metrics to evaluate your performance:</p>
        <ul>
          <li>Booking rate and occupancy percentage</li>
          <li>Average daily rate and revenue per available room</li>
          <li>Guest satisfaction scores and review ratings</li>
          <li>Response time and guest communication quality</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Mastering ${topic.toLowerCase()} requires dedication, continuous learning, and a commitment to excellence. By implementing the strategies outlined in this guide, you'll be well on your way to achieving greater success with your short-term rental property.</p>
        
        <p>Remember, success doesn't happen overnight. Be patient, stay consistent, and always prioritize your guests' experience. With time and effort, you'll see significant improvements in your booking rates, guest satisfaction, and overall revenue.</p>
      `,
      category,
      tags: [topic.toLowerCase().replace(/\s+/g, '-'), category.toLowerCase(), 'strategy', 'tips'],
      author,
      featured_image: image,
      published_at: publishDate.toISOString(),
      status: 'published',
      read_time: Math.floor(Math.random() * 6) + 4 // 4-9 minutes
    });
  }
  
  return posts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
};

const SAMPLE_BLOG_POSTS: BlogPost[] = generateSamplePosts();


const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: '1',
    name: 'Marketing',
    slug: 'marketing',
    description: 'Tips and strategies for marketing your short-term rental property',
    post_count: SAMPLE_BLOG_POSTS.filter(post => post.category === 'Marketing').length
  },
  {
    id: '2',
    name: 'Pricing',
    slug: 'pricing',
    description: 'Pricing strategies and revenue optimization techniques',
    post_count: SAMPLE_BLOG_POSTS.filter(post => post.category === 'Pricing').length
  },
  {
    id: '3',
    name: 'Guest Experience',
    slug: 'guest-experience',
    description: 'Improving guest satisfaction and communication',
    post_count: SAMPLE_BLOG_POSTS.filter(post => post.category === 'Guest Experience').length
  },
  {
    id: '4',
    name: 'Legal',
    slug: 'legal',
    description: 'Legal considerations and compliance for hosts',
    post_count: SAMPLE_BLOG_POSTS.filter(post => post.category === 'Legal').length
  },
  {
    id: '5',
    name: 'Property Management',
    slug: 'property-management',
    description: 'Tips for managing and maintaining your rental property',
    post_count: SAMPLE_BLOG_POSTS.filter(post => post.category === 'Property Management').length
  },
  {
    id: '6',
    name: 'Technology',
    slug: 'technology',
    description: 'Technology tools and automation for short-term rentals',
    post_count: SAMPLE_BLOG_POSTS.filter(post => post.category === 'Technology').length
  },
  {
    id: '7',
    name: 'Design',
    slug: 'design',
    description: 'Interior design and property aesthetics',
    post_count: SAMPLE_BLOG_POSTS.filter(post => post.category === 'Design').length
  },
  {
    id: '8',
    name: 'Finance',
    slug: 'finance',
    description: 'Financial planning and tax considerations',
    post_count: SAMPLE_BLOG_POSTS.filter(post => post.category === 'Finance').length
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

  static async getPostNavigation(currentSlug: string): Promise<{
    previousPost: BlogPost | null;
    nextPost: BlogPost | null;
  }> {
    const currentIndex = SAMPLE_BLOG_POSTS.findIndex(post => post.slug === currentSlug);
    
    if (currentIndex === -1) {
      return { previousPost: null, nextPost: null };
    }

    const previousPost = currentIndex > 0 ? SAMPLE_BLOG_POSTS[currentIndex - 1] : null;
    const nextPost = currentIndex < SAMPLE_BLOG_POSTS.length - 1 ? SAMPLE_BLOG_POSTS[currentIndex + 1] : null;

    return { previousPost, nextPost };
  }
}