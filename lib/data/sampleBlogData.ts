import { BlogPost, WordPressCategory } from '../types/wordpress';

// Sample blog posts to simulate WordPress data when the API is not accessible
export const SAMPLE_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Airbnb Property Management in 2024",
    content: `<p>Managing an Airbnb property successfully requires a combination of strategy, attention to detail, and understanding of guest expectations. In this comprehensive guide, we'll explore the essential aspects of property management that can help you maximize your rental income and guest satisfaction.</p>

<h2>Getting Started with Your Airbnb Property</h2>

<p>When you first list your property on Airbnb, the foundation of your success lies in three key areas: presentation, pricing, and communication. Let's dive into each of these components.</p>

<h3>Professional Photography Makes All the Difference</h3>

<p>High-quality photos are absolutely crucial for your listing's success. Studies show that professionally photographed listings earn up to 40% more than those with amateur photos. Consider investing in:</p>

<ul>
<li>Wide-angle shots that showcase room layouts</li>
<li>Natural lighting that makes spaces feel welcoming</li>
<li>Detail shots of amenities and unique features</li>
<li>Exterior photos that highlight curb appeal</li>
</ul>

<h3>Strategic Pricing for Maximum Occupancy</h3>

<p>Dynamic pricing is essential in today's competitive short-term rental market. Consider factors such as:</p>

<ul>
<li>Seasonal demand fluctuations</li>
<li>Local events and conferences</li>
<li>Competitor pricing analysis</li>
<li>Your property's unique value proposition</li>
</ul>

<p>Tools like <a href="https://www.pricelabs.co/" target="_blank">PriceLabs</a> and <a href="https://beyond.stays/" target="_blank">Beyond Pricing</a> can help automate this process and ensure you're always competitively priced.</p>

<h2>Guest Communication Excellence</h2>

<p>Exceptional communication sets successful hosts apart from the competition. Your response time, tone, and helpfulness directly impact guest satisfaction and reviews.</p>

<blockquote>
<p>"A quick, friendly response to guest inquiries can be the difference between a booking and a missed opportunity." - Sarah Johnson, Superhost with 500+ reviews</p>
</blockquote>

<h3>Pre-Arrival Communication</h3>

<p>Once a guest books your property, maintain regular contact leading up to their stay. Send them:</p>

<ol>
<li>A welcome message with check-in details</li>
<li>Local recommendations and house rules</li>
<li>Contact information for any issues</li>
<li>Wi-Fi passwords and other essential info</li>
</ol>

<h2>Maintaining Your Property</h2>

<p>Regular maintenance is crucial for maintaining high ratings and avoiding costly repairs. Create a maintenance schedule that includes:</p>

<ul>
<li>Monthly deep cleaning sessions</li>
<li>Quarterly HVAC system checks</li>
<li>Annual safety equipment inspections</li>
<li>Seasonal preparation tasks</li>
</ul>

<p>Remember, happy guests leave better reviews, which leads to more bookings and higher revenue. Investing in your property's upkeep is investing in your business's future success.</p>`,
    excerpt: "A comprehensive guide covering everything from professional photography and dynamic pricing to guest communication and property maintenance for successful Airbnb hosting.",
    slug: "ultimate-guide-airbnb-property-management-2024",
    date: "2024-12-15T10:00:00.000Z",
    modified: "2024-12-15T10:00:00.000Z",
    author: "Sarah Martinez",
    authorId: 1,
    categories: ["Property Management", "Airbnb Tips"],
    categoryIds: [1, 2],
    tags: ["airbnb", "property management", "hosting tips"],
    featuredImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    link: "https://strspecialist.com/ultimate-guide-airbnb-property-management-2024",
    status: "publish"
  },
  {
    id: 2,
    title: "5 Revenue-Boosting Amenities Every Short-Term Rental Needs",
    content: `<p>In the competitive world of short-term rentals, the right amenities can significantly impact your property's appeal and revenue potential. After analyzing thousands of successful listings, we've identified the top amenities that consistently drive higher bookings and allow hosts to command premium rates.</p>

<h2>1. High-Speed Wi-Fi and Smart TV Setup</h2>

<p>In today's digital age, reliable internet connectivity isn't just a luxury—it's an absolute necessity. Guests expect seamless connectivity for work, entertainment, and staying connected with family.</p>

<h3>What You Need:</h3>
<ul>
<li>Minimum 50 Mbps download speed</li>
<li>Smart TV with popular streaming apps pre-loaded</li>
<li>Multiple Wi-Fi access points for larger properties</li>
<li>Guest network separate from your personal devices</li>
</ul>

<p>Pro tip: Test your internet speed regularly and provide the Wi-Fi password prominently in your welcome materials.</p>

<h2>2. Coffee Station with Premium Supplies</h2>

<p>A well-stocked coffee station creates an immediate wow factor and sets a welcoming tone for your guests' stay. This relatively small investment can significantly enhance the guest experience.</p>

<h3>Essential Items:</h3>
<ul>
<li>Quality coffee maker (Keurig or espresso machine)</li>
<li>Variety of coffee pods or beans</li>
<li>Tea selection for non-coffee drinkers</li>
<li>Sugar, creamer, and sweetener options</li>
<li>Quality mugs and spoons</li>
</ul>

<h2>3. Keyless Entry System</h2>

<p>Smart locks eliminate the hassle of key exchanges and provide security for both you and your guests. They also allow for seamless self-check-in, which modern travelers increasingly expect.</p>

<blockquote>
<p>"Installing a smart lock was one of the best investments I made. It eliminated 90% of my check-in headaches and guests love the convenience." - Michael Chen, Airbnb Superhost</p>
</blockquote>

<h3>Popular Options:</h3>
<ul>
<li><a href="https://august.com/" target="_blank">August Smart Lock</a></li>
<li><a href="https://schlage.com/" target="_blank">Schlage Encode</a></li>
<li><a href="https://www.yale.com/" target="_blank">Yale Assure Lock</a></li>
</ul>

<h2>4. Comprehensive First-Aid and Safety Kit</h2>

<p>Safety should never be compromised. A well-equipped safety kit not only protects your guests but also demonstrates your commitment to their well-being.</p>

<h3>Must-Have Items:</h3>
<ul>
<li>First-aid supplies (bandages, antiseptic, pain relievers)</li>
<li>Flashlights with fresh batteries</li>
<li>Smoke and carbon monoxide detectors (check batteries monthly)</li>
<li>Fire extinguisher in kitchen area</li>
<li>Emergency contact information clearly posted</li>
</ul>

<h2>5. Local Experience Package</h2>

<p>Help your guests discover the best your area has to offer with a curated local experience package. This personal touch often leads to glowing reviews and repeat bookings.</p>

<h3>Ideas to Include:</h3>
<ul>
<li>Customized guidebook with your favorite local spots</li>
<li>Restaurant menus and business cards</li>
<li>Maps highlighting walking routes and points of interest</li>
<li>Discount coupons for local attractions</li>
<li>Transportation information (bus routes, ride-share tips)</li>
</ul>

<h2>Return on Investment</h2>

<p>While these amenities require upfront investment, the data speaks for itself:</p>

<ul>
<li>Properties with smart locks see 23% fewer booking inquiries about check-in</li>
<li>High-speed Wi-Fi is mentioned in 67% of 5-star reviews</li>
<li>Coffee stations increase guest satisfaction scores by an average of 0.3 points</li>
<li>Local guidebooks are referenced in 45% of positive reviews</li>
</ul>

<p>Remember, in the short-term rental business, exceptional guest experiences lead to exceptional reviews, which drive more bookings and allow you to charge premium rates. These amenities are investments in your property's long-term success.</p>`,
    excerpt: "Discover the five essential amenities that successful short-term rental hosts use to boost bookings, increase guest satisfaction, and command higher rates.",
    slug: "5-revenue-boosting-amenities-short-term-rental",
    date: "2024-12-12T14:30:00.000Z",
    modified: "2024-12-12T14:30:00.000Z",
    author: "David Wilson",
    authorId: 2,
    categories: ["Amenities", "Revenue Optimization"],
    categoryIds: [3, 4],
    tags: ["amenities", "guest experience", "revenue"],
    featuredImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "https://strspecialist.com/5-revenue-boosting-amenities-short-term-rental",
    status: "publish"
  },
  {
    id: 3,
    title: "Understanding VRBO vs Airbnb: Which Platform is Right for Your Property?",
    content: `<p>Choosing the right platform for your vacation rental can significantly impact your booking success and revenue. Both VRBO and Airbnb offer unique advantages, and understanding their differences is crucial for making an informed decision.</p>

<h2>Platform Overview and Target Audience</h2>

<h3>Airbnb: The Community-Focused Platform</h3>
<p>Airbnb has revolutionized the travel industry by creating a platform that emphasizes unique experiences and community connections. Originally focused on spare rooms and unique accommodations, Airbnb has expanded to include entire homes, luxury properties, and even exotic locations like treehouses and castles.</p>

<h3>VRBO: The Family-Focused Vacation Rental Specialist</h3>
<p>VRBO (Vacation Rental By Owner) has been in the vacation rental business since 1995, making it one of the pioneers in the industry. The platform primarily focuses on entire home rentals and caters specifically to families and groups looking for traditional vacation experiences.</p>

<h2>Key Differences to Consider</h2>

<h3>Guest Demographics</h3>
<ul>
<li><strong>Airbnb:</strong> Attracts younger travelers (25-35), business travelers, and solo adventurers seeking unique experiences</li>
<li><strong>VRBO:</strong> Appeals to families, groups, and older travelers (35-55) planning traditional vacations</li>
</ul>

<h3>Booking Patterns</h3>
<ul>
<li><strong>Airbnb:</strong> More last-minute bookings, shorter stays (1-3 nights), urban locations</li>
<li><strong>VRBO:</strong> Advanced planning, longer stays (4-7 nights), vacation destinations</li>
</ul>

<h3>Fee Structures</h3>
<p>Understanding the fee structure is crucial for calculating your net revenue:</p>

<h4>Airbnb Fees:</h4>
<ul>
<li>Host service fee: 3% of booking subtotal</li>
<li>Guest service fee: 0-20% (typically 14-16%)</li>
<li>Payment processing: 3% for most countries</li>
</ul>

<h4>VRBO Fees:</h4>
<ul>
<li>Annual subscription: $499 for unlimited bookings</li>
<li>Pay-per-booking: 8% commission + 3% payment processing</li>
<li>Booking fee paid by guest: 6-12%</li>
</ul>

<h2>Marketing and Visibility</h2>

<h3>Search Algorithm Factors</h3>
<p>Both platforms use complex algorithms to determine listing visibility. Key factors include:</p>

<ul>
<li>Response rate and response time</li>
<li>Booking acceptance rate</li>
<li>Guest review scores</li>
<li>Listing completeness and quality</li>
<li>Pricing competitiveness</li>
</ul>

<blockquote>
<p>"I've found that Airbnb rewards hosts who are highly responsive and flexible, while VRBO values consistency and reliability in hosting standards." - Jennifer Rodriguez, Multi-platform host</p>
</blockquote>

<h2>Property Types That Perform Best</h2>

<h3>Ideal for Airbnb:</h3>
<ul>
<li>Urban apartments and condos</li>
<li>Unique or unconventional properties</li>
<li>Shared spaces and spare rooms</li>
<li>Properties in trendy neighborhoods</li>
<li>Business travel-friendly locations</li>
</ul>

<h3>Ideal for VRBO:</h3>
<ul>
<li>Vacation homes and beach properties</li>
<li>Large family-friendly homes</li>
<li>Mountain cabins and lake houses</li>
<li>Properties with pools and outdoor amenities</li>
<li>Traditional vacation destinations</li>
</ul>

<h2>Multi-Platform Strategy</h2>

<p>Many successful hosts use both platforms simultaneously to maximize exposure and revenue. Here's how to manage a multi-platform approach effectively:</p>

<h3>Channel Management Tools</h3>
<ul>
<li><a href="https://www.guesty.com/" target="_blank">Guesty</a> - Comprehensive property management</li>
<li><a href="https://www.hostfully.com/" target="_blank">Hostfully</a> - Automated messaging and booking management</li>
<li><a href="https://www.yourporter.com/" target="_blank">YourPorter</a> - Multi-platform calendar synchronization</li>
</ul>

<h3>Calendar Synchronization</h3>
<p>Prevent double bookings by syncing calendars across platforms. Most channel management tools offer this feature, or you can manually sync using iCal feeds.</p>

<h2>Making Your Decision</h2>

<p>Consider these factors when choosing your platform strategy:</p>

<ol>
<li><strong>Property Location:</strong> Urban vs. vacation destination</li>
<li><strong>Target Guest:</strong> Business travelers vs. families</li>
<li><strong>Property Size:</strong> Single rooms vs. entire homes</li>
<li><strong>Booking Goals:</strong> Quick turnovers vs. extended stays</li>
<li><strong>Management Capacity:</strong> Time available for guest communication</li>
</ol>

<h2>Success Metrics to Track</h2>

<p>Regardless of which platform you choose, monitor these key performance indicators:</p>

<ul>
<li>Occupancy rate</li>
<li>Average daily rate (ADR)</li>
<li>Revenue per available room (RevPAR)</li>
<li>Guest review scores</li>
<li>Response time and acceptance rate</li>
</ul>

<p>Remember, success on either platform requires dedication to providing exceptional guest experiences, maintaining your property to high standards, and staying responsive to market changes. The best platform for your property is the one where your target guests are actively searching and booking.</p>`,
    excerpt: "Compare Airbnb and VRBO platforms to determine which is best suited for your vacation rental property based on guest demographics, fee structures, and property types.",
    slug: "vrbo-vs-airbnb-which-platform-right-property",
    date: "2024-12-10T09:15:00.000Z",
    modified: "2024-12-10T09:15:00.000Z",
    author: "Lisa Chen",
    authorId: 3,
    categories: ["Platform Comparison", "Marketing"],
    categoryIds: [5, 6],
    tags: ["airbnb", "vrbo", "platform comparison"],
    featuredImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    link: "https://strspecialist.com/vrbo-vs-airbnb-which-platform-right-property",
    status: "publish"
  }
];

export const SAMPLE_CATEGORIES: WordPressCategory[] = [
  {
    id: 1,
    count: 8,
    description: "Tips and strategies for effective property management",
    link: "https://strspecialist.com/category/property-management",
    name: "Property Management",
    slug: "property-management",
    taxonomy: "category",
    parent: 0,
    meta: {},
    _links: {
      self: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories/1" }],
      collection: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories" }],
      about: [{ href: "https://strspecialist.com/wp-json/wp/v2/taxonomies/category" }],
      "wp:post_type": [{ href: "https://strspecialist.com/wp-json/wp/v2/posts?categories=1" }],
      curies: [{ name: "wp", href: "https://api.w.org/{rel}", templated: true }]
    }
  },
  {
    id: 2,
    count: 12,
    description: "Expert tips for successful Airbnb hosting",
    link: "https://strspecialist.com/category/airbnb-tips",
    name: "Airbnb Tips",
    slug: "airbnb-tips",
    taxonomy: "category",
    parent: 0,
    meta: {},
    _links: {
      self: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories/2" }],
      collection: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories" }],
      about: [{ href: "https://strspecialist.com/wp-json/wp/v2/taxonomies/category" }],
      "wp:post_type": [{ href: "https://strspecialist.com/wp-json/wp/v2/posts?categories=2" }],
      curies: [{ name: "wp", href: "https://api.w.org/{rel}", templated: true }]
    }
  },
  {
    id: 3,
    count: 6,
    description: "Essential amenities for short-term rentals",
    link: "https://strspecialist.com/category/amenities",
    name: "Amenities",
    slug: "amenities",
    taxonomy: "category",
    parent: 0,
    meta: {},
    _links: {
      self: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories/3" }],
      collection: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories" }],
      about: [{ href: "https://strspecialist.com/wp-json/wp/v2/taxonomies/category" }],
      "wp:post_type": [{ href: "https://strspecialist.com/wp-json/wp/v2/posts?categories=3" }],
      curies: [{ name: "wp", href: "https://api.w.org/{rel}", templated: true }]
    }
  },
  {
    id: 4,
    count: 9,
    description: "Strategies to maximize rental revenue",
    link: "https://strspecialist.com/category/revenue-optimization",
    name: "Revenue Optimization",
    slug: "revenue-optimization",
    taxonomy: "category",
    parent: 0,
    meta: {},
    _links: {
      self: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories/4" }],
      collection: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories" }],
      about: [{ href: "https://strspecialist.com/wp-json/wp/v2/taxonomies/category" }],
      "wp:post_type": [{ href: "https://strspecialist.com/wp-json/wp/v2/posts?categories=4" }],
      curies: [{ name: "wp", href: "https://api.w.org/{rel}", templated: true }]
    }
  },
  {
    id: 5,
    count: 4,
    description: "Comparing different rental platforms",
    link: "https://strspecialist.com/category/platform-comparison",
    name: "Platform Comparison",
    slug: "platform-comparison",
    taxonomy: "category",
    parent: 0,
    meta: {},
    _links: {
      self: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories/5" }],
      collection: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories" }],
      about: [{ href: "https://strspecialist.com/wp-json/wp/v2/taxonomies/category" }],
      "wp:post_type": [{ href: "https://strspecialist.com/wp-json/wp/v2/posts?categories=5" }],
      curies: [{ name: "wp", href: "https://api.w.org/{rel}", templated: true }]
    }
  },
  {
    id: 6,
    count: 7,
    description: "Marketing strategies for vacation rentals",
    link: "https://strspecialist.com/category/marketing",
    name: "Marketing",
    slug: "marketing",
    taxonomy: "category",
    parent: 0,
    meta: {},
    _links: {
      self: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories/6" }],
      collection: [{ href: "https://strspecialist.com/wp-json/wp/v2/categories" }],
      about: [{ href: "https://strspecialist.com/wp-json/wp/v2/taxonomies/category" }],
      "wp:post_type": [{ href: "https://strspecialist.com/wp-json/wp/v2/posts?categories=6" }],
      curies: [{ name: "wp", href: "https://api.w.org/{rel}", templated: true }]
    }
  }
];