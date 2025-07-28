import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'price', title: 'Price', type: 'number' }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image' }]
    }),
    defineField({
      name: 'type',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          { title: 'Digital', value: 'digital' },
          { title: 'Dropship', value: 'dropship' }
        ]
      }
    }),
    defineField({ name: 'sku', title: 'SKU', type: 'string' }),
    defineField({
      name: 'downloadFile',
      title: 'Digital Download File',
      type: 'file',
      hidden: ({ parent }) => parent.type !== 'digital'
    }),
    defineField({ name: 'affiliateLink', title: 'Affiliate Link', type: 'url' }),
    defineField({
      name: 'supplier',
      title: 'Supplier Info',
      type: 'string',
      hidden: ({ parent }) => parent.type !== 'dropship'
    }),
    defineField({
      name: 'shippingDetails',
      title: 'Shipping Details',
      type: 'text',
      hidden: ({ parent }) => parent.type !== 'dropship'
    }),
  ]
})
