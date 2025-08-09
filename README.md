This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Viator API Integration (for SEO Gen Post (Viator) category posts)
VIATOR_API_KEY=your_viator_api_key_here

# Sanity CMS (already configured)
NEXT_PUBLIC_SANITY_TOKEN=your_sanity_token

# Optional: Other API integrations
AIRTABLE_PERSONAL_TOKEN=your_airtable_token
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_ID=your_table_id
```

### Viator Tours Integration

This project supports special "SEO Gen Post (Viator)" posts that automatically inject Viator tours after the 2nd paragraph. 

**Setup Requirements:**
1. Set `VIATOR_API_KEY` in your environment variables (server-side only, never exposed to client)
2. In Sanity, create posts with category "SEO Gen Post (Viator)" and a `city` field
3. Add city mappings to `data/viatorCityMap.json` for new destinations

**Adding new cities:**
Edit `data/viatorCityMap.json`:
```json
{
  "shannon": "d6207",
  "dublin": "d5036", 
  "galway": "d5156",
  "kerry": "d26008",
  "motueka": "d6218",
  "yourcity": "destination_id_from_viator"
}
```

**How it works:**
- Posts with category "SEO Gen Post (Viator)" automatically show 9 highest-rated tours
- Tours are fetched server-side and cached (ISR with 12h revalidation)
- If city is not mapped or API fails, page renders normally without tours
- Tours appear as a grid after the 2nd paragraph of the post content

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
