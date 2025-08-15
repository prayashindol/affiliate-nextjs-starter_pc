/**
 * Test page to demonstrate ViatorGenPost component with contentHtml processing
 */
import ViatorGenPost from '../components/posts/ViatorGenPost'

export default function ViatorContentTestPage() {
  // Mock post data to test the ViatorGenPost component functionality
  const mockViatorPost = {
    _id: 'test-viator-post',
    _type: 'seoGenPostViator',
    title: 'Best Tours for Motueka - Test Post',
    slug: { current: 'test-viator-motueka' },
    city: 'motueka',
    postType: 'Cleaner',
    contentHtml: `
      <h1>This H1 should be removed</h1>
      <p>This paragraph should be removed (first para)</p>
      <p>This paragraph should also be removed (second para)</p>
      <p>This is the introduction to our amazing destination guide for Motueka. 
      This paragraph should remain and shows that content cleaning is working properly.</p>
      
      <h2>Best Things to Do in Motueka</h2>
      <p>Motueka is a beautiful coastal town in New Zealand known for its stunning beaches and outdoor activities.</p>
      
      <table>
        <tr><th>Activity</th><th>Duration</th><th>Price</th></tr>
        <tr><td>Beach Walking</td><td>2 hours</td><td>Free</td></tr>
        <tr><td>Kayaking</td><td>4 hours</td><td>$80</td></tr>
      </table>
      
      <p>This content should have proper cleaning applied, including removal of navigation elements and WordPress artifacts.</p>
      
      <div class="nsg-adjacent-links">This navigation should be removed</div>
      <a href="#">Previous Post</a>
      <a href="#">Next Post</a>
      
      <h2>Accommodation Tips</h2>
      <p>When visiting Motueka, consider staying in one of the many great Airbnb properties available.</p>
    `,
    mainImage: {
      asset: null
    },
    dateModified: '2024-01-15',
    author: 'Test Author',
    location: 'Motueka, New Zealand'
  }

  // Mock Viator tours data
  const mockViatorTours = [
    {
      productCode: 'test-tour-1',
      title: 'Best of Motueka Tour',
      shortDescription: 'Explore the beautiful coastal town of Motueka',
      price: 'From $120',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      link: '#'
    },
    {
      productCode: 'test-tour-2',
      title: 'Motueka Adventure Package',
      shortDescription: 'Full day adventure including kayaking and hiking',
      price: 'From $180',
      thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
      link: '#'
    },
    {
      productCode: 'test-tour-3',
      title: 'Scenic Motueka Photography Tour',
      shortDescription: 'Capture the beauty of Motueka with professional guidance',
      price: 'From $95',
      thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
      link: '#'
    }
  ]

  const mockViatorMetadata = {
    destinationId: '24533',
    apiStatus: 'mock',
    apiError: null,
    rawMeta: 'Using mock data for testing'
  }

  return (
    <div>
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>Test Page:</strong> This page demonstrates the ViatorGenPost component with contentHtml processing.
              The content should show proper cleaning (removed H1, first 2 paragraphs, navigation links) and Viator tours injected after the first H2.
            </p>
          </div>
        </div>
      </div>
      
      <ViatorGenPost 
        post={mockViatorPost}
        viatorTours={mockViatorTours}
        city="motueka"
        viatorMetadata={mockViatorMetadata}
      />
    </div>
  )
}