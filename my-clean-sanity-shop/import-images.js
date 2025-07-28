const { createClient } = require('@sanity/client')
const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
const { nanoid } = require('nanoid') // <--- ADD THIS

const client = createClient({
  projectId: 'ph27cqpd',
  dataset: 'production',
  token: 'skFvysJGPYJDECY4aqOIX1I7tis4dITOUq4LyKPWdS2EUyvcnXhcHIZhvA6AKc4QOTdBjUsEcqaozZgoWjPZ8ePVLkbA5seSeU5gVTA4I1NlA4kJXoK7mcbSvcImTaZRx7RysfPK6gnl8twBjYUgCPB0LiYYCWAAIIRa5RrzAiehqHLtdXIb',
  useCdn: false,
  apiVersion: '2023-07-01'
})

const csvFilePath = 'wc-product-export-28-7-2025-1753730885200.csv'

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

async function uploadImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const filename = path.basename(url.split('?')[0])
  return client.assets.upload('image', buffer, {filename})
}

async function attachImagesToProduct(slug, images) {
  const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]{_id, title, slug}`, { slug })
  if (!product || !product._id) {
    console.warn(`Product not found for slug: ${slug}`)
    return
  }
  await client.patch(product._id).set({ images }).commit()
  console.log(`Updated product: ${product.title}`)
}

;(async () => {
  let totalUpdated = 0
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', async (row) => {
      const title = row['Name'] || row['title']
      if (!title) return
      const slug = slugify(title)

      // Fetch current images (if any)
      const existing = await client.fetch(`*[_type == "product" && slug.current == $slug][0]{images}`, { slug })
      let needsUpdate = false

      if (existing && existing.images && existing.images.length > 0) {
        // Check if any images are missing _key
        for (const img of existing.images) {
          if (!img._key) {
            needsUpdate = true
            break
          }
        }
        if (!needsUpdate) {
          // Already has images WITH keys; skip
          return
        }
      } else {
        needsUpdate = true
      }

      if (!needsUpdate) return

      // Otherwise, upload images from CSV
      const imagesStr = row['Images'] || ''
      const imageUrls = imagesStr.split(',').map(url => url.trim()).filter(Boolean)
      const uploadedImages = []
      for (let url of imageUrls) {
        try {
          const asset = await uploadImage(url)
          uploadedImages.push({
            _key: nanoid(), // Unique key for sanity!
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id }
          })
          console.log(`Uploaded: ${url} -> Asset ID: ${asset._id}`)
          await new Promise(resolve => setTimeout(resolve, 400))
        } catch (err) {
          console.error(`Failed for ${url}: ${err.message}`)
        }
      }
      if (uploadedImages.length) {
        await attachImagesToProduct(slug, uploadedImages)
        totalUpdated++
      }
    })
    .on('end', () => {
      console.log(`Done! Updated ${totalUpdated} products with images.`)
    })
})()
