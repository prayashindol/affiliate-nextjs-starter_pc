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
```

### Viator Tours Integration

This project supports special "SEO Gen Post (Viator)" posts that automatically inject Viator tours after the 2nd paragraph. To add support for new cities:

1. Add the city mapping to `data/viatorCityMap.json`:
```json
{
  "shannon": "d6207",
  "dublin": "d5036", 
  "galway": "d5156",
  "kerry": "d26008",
  "yourcity": "destination_id_from_viator"
}
```

2. In Sanity, create posts with:
   - Category: "SEO Gen Post (Viator)"
   - City field: set to the city name (lowercase, matching the key in viatorCityMap.json)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
