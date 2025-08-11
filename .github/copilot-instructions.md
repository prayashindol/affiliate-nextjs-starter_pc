# STR Specialist Next.js - Developer Instructions

**ALWAYS follow these instructions first.** Search the codebase or use bash commands ONLY if information here is incomplete or found to be incorrect. These instructions are your primary source of truth for working effectively in this codebase.

## Project Overview

This is an affiliate content site built with Next.js 15.x, React 18.x, Tailwind CSS, and Sanity.io headless CMS. It's a migration from a WordPress/Elementor stack, focusing on fast, SEO-friendly pages with programmatic affiliate SEO generators and API integrations (Viator, OpenAI, etc.). Deployed on Vercel with automated CI/CD.

**Languages:** JavaScript, TypeScript  
**Environment:** Node.js 20.x+ (verified with v20.19.4)  
**Package Manager:** npm (verified with v10.8.2)

## Bootstrap & Environment Setup

### 1. Install Dependencies
**TIMING:** Takes ~3 minutes. **NEVER CANCEL** - set timeout to 5+ minutes.
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` with required variables (see `.env.example`):
```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SITE_URL` - Site URL (http://localhost:3000 for development)
- `NEXT_PUBLIC_SANITY_TOKEN` - Sanity API token  
- `VIATOR_API_KEY` - Viator API key (for SEO Gen Post (Viator) category posts)
- Optional: `AIRTABLE_PERSONAL_TOKEN`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`

## Development Workflow

### Start Development Server
**TIMING:** Ready in ~1 second. Works with test/placeholder env vars.
```bash
npm run dev
```
- Runs on http://localhost:3000
- Uses Turbopack for fast development builds
- Hot reload enabled
- **Will start even with test environment variables**

### Production Build
**TIMING:** Takes ~30-45 seconds for successful compilation (may fail at build-time due to missing real Sanity tokens). **NEVER CANCEL** - set timeout to 10+ minutes.
```bash
npm run build
```
**Note:** Build may fail with "Unauthorized - Session not found" if using test Sanity tokens. This is expected in a fresh clone environment.

### Linting
**TIMING:** Takes ~5-10 seconds.
```bash
npm run lint
```
- Uses Next.js/ESLint configuration
- **ALWAYS** run before committing changes
- Warnings about unused variables and `<img>` vs `<Image />` are common and acceptable

### Testing
**No `npm test` script configured.** Test files exist in `__tests__/` but require Jest configuration for ES modules. Tests are present but not currently executable without additional setup.

## Validation & Manual Testing

### Essential Validation Steps
After making any changes, **ALWAYS** perform these validation steps:

1. **Build validation:**
   ```bash
   npm run build  # Timeout: 10 minutes
   npm run lint   # Should complete successfully
   ```

2. **Development server test:**
   ```bash
   npm run dev    # Should start in ~1 second
   curl http://localhost:3000  # Should return HTML
   ```

3. **Manual functionality test:**
   - Navigate to main page (should show affiliate tools directory)
   - Check navigation menu (Home, Posts, Blog, Tools)
   - Verify responsive design on different screen sizes
   - Test any forms or interactive elements you've modified

## Project Structure

### Key Directories
- `/app` - Next.js App Router pages and layouts
- `/lib` - Utility functions and API clients (especially `lib/sanity.js`)
- `/components` - Shared React components
- `/public` - Static assets and images
- `/data` - Data files (e.g., `viatorCityMap.json`)
- `/__tests__` - Test files (Jest tests, not currently executable)
- `/docs` - Project documentation (see `DEPLOYMENT.md`)

### Important Files
- `app/globals.css` - Main Tailwind/CSS styles with table and prose overrides
- `lib/sanity.js` - Sanity client configuration and image URL builder
- `lib/viator.js` - Viator API integration
- `next.config.js` - Next.js configuration with image domains and redirects
- `tailwind.config.js` - Tailwind CSS configuration
- `package.json` - Dependencies and available scripts

### Available Scripts
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production (may fail without real API tokens)
npm run start        # Start production server (after build)
npm run lint         # Run ESLint
npm run build:analyze # Build with bundle analysis
npm run deploy:production # Deploy to Vercel production
npm run deploy:preview   # Deploy to Vercel preview
```

## Architecture & Features

### Sanity CMS Integration
- Content fetched from Sanity.io headless CMS
- Project ID: `ph27cqpd`, dataset: `production`
- Image optimization via `urlFor()` function in `lib/sanity.js`
- **Build failures without valid tokens are expected in fresh environments**

### Viator Tours Integration
- Special "SEO Gen Post (Viator)" posts inject Viator tours after 2nd paragraph
- City mappings in `data/viatorCityMap.json`
- Server-side rendering with 12h ISR revalidation
- Graceful fallback if API fails or city not mapped

### Affiliate/CTA System
- Dynamic banners based on post's `postType` field from Sanity
- HTML content cleaned with cheerio before rendering
- See `/app/[slug]/page.jsx` for implementation logic

### Styling
- Tailwind CSS with `@tailwindcss/typography` for prose content
- Custom table styles in `app/globals.css`
- Responsive design with mobile-first approach

## Deployment & CI/CD

### Vercel Deployment
- Automatic deployment on push to `main` branch
- GitHub Actions workflow: `.github/workflows/vercel-deploy.yml`
- Deploy hooks configured for production deployments
- See `docs/DEPLOYMENT.md` for detailed deployment instructions

### Build Optimization
- Next.js standalone output for better performance
- Package imports optimization for `@heroicons/react` and `react-icons`
- Console removal in production builds
- Selective deployment (main branch only, `[deploy]` tag support)

## Common Issues & Troubleshooting

### Build Failures
- **"Module not found"** - Check import paths (case-sensitive on Vercel)
- **"Unauthorized - Session not found"** - Expected with test Sanity tokens
- **Missing environment variables** - Ensure `.env.local` is properly configured

### Development Issues
- **CSS not updating** - Clear `.next` and `.vercel` caches, restart dev server
- **TypeScript errors** - Check `tsconfig.json` configuration and import paths
- **Image loading issues** - Verify domains in `next.config.js` remotePatterns

### Performance
- **Slow builds** - Normal for first build (~30-45 seconds)
- **Large bundle size** - Use `npm run build:analyze` to investigate

## File Editing Guidelines

### When editing components:
- Check affiliate banner logic in dynamic page components
- Maintain Tailwind class consistency
- Test responsive behavior on mobile and desktop

### When editing content processing:
- Verify cheerio HTML cleaning in content pipeline
- Test table styling with prose overrides
- Ensure SEO meta tags are properly generated

### When adding new features:
- Follow existing patterns in `/app` directory structure
- Add appropriate TypeScript types in `/types` directory
- Consider ISR requirements for dynamic content

## Exact Commands Summary

**Environment Setup:**
```bash
node --version  # Should be 20.x+
npm install     # 3 minutes, timeout: 5 minutes
```

**Development:**
```bash
npm run dev     # 1 second startup
npm run lint    # 5-10 seconds
```

**Production (with real tokens):**
```bash
npm run build   # 30-45 seconds, timeout: 10 minutes
npm start       # After successful build
```

**CRITICAL:** Never cancel long-running operations. Build times are normal and expected.