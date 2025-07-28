// lib/sanity.js
import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: 'ph27cqpd',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-07-01'
})