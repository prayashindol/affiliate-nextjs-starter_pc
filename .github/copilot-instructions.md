Your task is to become my expert coding assistant for this repository.
Treat this .github/copilot-instructions.md as your essential project onboarding: it describes how you should work, what this codebase is for, and the technical details you need to help me maintain and improve this affiliate site with confidence.
Act as a knowledgeable, careful developer who wants to make high-quality, production-ready code contributions.
Always use these instructions as your first source of truth—search the codebase only if something is unclear or missing.
High-Level Summary
This repository is a modern affiliate content site built using Next.js (React), Tailwind CSS, and a headless CMS (Sanity.io).
The project is a migration from a WordPress/Elementor stack, aiming for fast, SEO-friendly pages, programmatic affiliate SEO generators, and tight integration with APIs (e.g., Viator, OpenAI, etc.).
The primary languages are JavaScript and TypeScript.
The app is designed for deployment on Vercel, with an emphasis on CI/CD and automated builds.
Repository/Project Information
• Frameworks: Next.js 15.x, React 18.x, Tailwind CSS (with @tailwindcss/typography), Sanity.io for headless CMS.
• Languages: JavaScript, TypeScript, CSS (via Tailwind), minimal vanilla CSS.
• Directory Size: Medium (approx. 50–200 files typical for a Next.js app with content tooling).
• Key Directories:
• /app (Next.js App Router pages/components)
• /lib (utility functions, API clients, e.g. lib/sanity.js)
• /components (shared UI components)
• /public (static assets, images)
• /styles (global styles, e.g., global.css)
• /sanity (Sanity schemas and config, if present)
• Config files: next.config.js, tailwind.config.js, postcss.config.js, .env, .env.local
Build, Run & Validation Steps
1. Install Dependencies
Always run npm install (or pnpm install if using pnpm) before building or starting the project.
2. Local Development
To start the development server:
npm run dev
Visit http://localhost:3000
Errors about missing environment variables (Sanity credentials, API keys, etc.) will block start; check .env.local.
3. Production Build
To build for production:
npm run build
npm start
If npm run build fails, ensure all required env vars are set in .env.local and the lib/sanity.js file exists and is correct.
4. Lint & Format
Run lint checks:
npm run lint
(Tailwind and Next.js use default linters. Custom ESLint rules may be present.)
5. Testing
If present, run tests with:
npm test
(Not all code paths have test coverage yet.)
6. Environment
Requires Node.js 18.x+.
All necessary env variables (Sanity project ID, dataset, etc.) should be defined in .env.local.
Sanity Studio (if present) is usually in /sanity and runs with npm run sanity or npx sanity start.
Project Layout and Architecture
Directory/Key File Structure
• /app: All main Next.js routes and pages (e.g., /app/seo-gen/[slug]/page.jsx)
• /components: Common React components (UI, layout, banners, SEO, etc.)
• /lib/sanity.js: Sanity client, asset builder (urlFor)
• /styles/global.css: Main Tailwind/global CSS file
• /public: Static files and assets
• next.config.js: Next.js build and runtime config
• tailwind.config.js: Tailwind CSS setup
Important Facts
• Affiliate/CTA banners: Added based on the post’s type (postType field from Sanity).
See /app/seo-gen/[slug]/page.jsx or similar for logic.
• Content HTML: Cleaned and injected using cheerio in code, then rendered with dangerouslySetInnerHTML.
• Tables: Styled in /styles/global.css using Tailwind and custom prose overrides.
• Sanity Integration: All post content, images, and metadata come from Sanity via the API.
• Vercel Deployment: Standard Next.js Vercel setup. Build failures are most often due to missing dependencies or bad import paths.
Validation & CI
• Vercel CI: Every push triggers a deploy. Builds must pass before going live.
• No explicit GitHub Actions yet (unless workflow files are present).
• Sanity Studio (if present): See /sanity or a similar directory.
Troubleshooting Tips
• If a build fails with “Module not found: Can’t resolve …”, verify import paths (case-sensitive, especially on Vercel).
• Always check and set up .env.local for required secrets.
• If CSS doesn’t update, try clearing the .next and .vercel build caches, and restart the dev server.
Explicit Agent Instructions
Trust these instructions first. Search the codebase only if information is missing or appears incorrect.
Do not try random bash commands—follow the steps as documented here to avoid build and lint errors.Your task is to become my expert coding assistant for this repository.
Treat this .github/copilot-instructions.md as your essential project onboarding: it describes how you should work, what this codebase is for, and the technical details you need to help me maintain and improve this affiliate site with confidence.
Act as a knowledgeable, careful developer who wants to make high-quality, production-ready code contributions.
Always use these instructions as your first source of truth—search the codebase only if something is unclear or missing.
High-Level Summary
This repository is a modern affiliate content site built using Next.js (React), Tailwind CSS, and a headless CMS (Sanity.io).
The project is a migration from a WordPress/Elementor stack, aiming for fast, SEO-friendly pages, programmatic affiliate SEO generators, and tight integration with APIs (e.g., Viator, OpenAI, etc.).
The primary languages are JavaScript and TypeScript.
The app is designed for deployment on Vercel, with an emphasis on CI/CD and automated builds.
Repository/Project Information
• Frameworks: Next.js 15.x, React 18.x, Tailwind CSS (with @tailwindcss/typography), Sanity.io for headless CMS.
• Languages: JavaScript, TypeScript, CSS (via Tailwind), minimal vanilla CSS.
• Directory Size: Medium (approx. 50–200 files typical for a Next.js app with content tooling).
• Key Directories:
• /app (Next.js App Router pages/components)
• /lib (utility functions, API clients, e.g. lib/sanity.js)
• /components (shared UI components)
• /public (static assets, images)
• /styles (global styles, e.g., global.css)
• /sanity (Sanity schemas and config, if present)
• Config files: next.config.js, tailwind.config.js, postcss.config.js, .env, .env.local
Build, Run & Validation Steps
1. Install Dependencies
Always run npm install (or pnpm install if using pnpm) before building or starting the project.
2. Local Development
To start the development server:
npm run dev
Visit http://localhost:3000
Errors about missing environment variables (Sanity credentials, API keys, etc.) will block start; check .env.local.
3. Production Build
To build for production:
npm run build
npm start
If npm run build fails, ensure all required env vars are set in .env.local and the lib/sanity.js file exists and is correct.
4. Lint & Format
Run lint checks:
npm run lint
(Tailwind and Next.js use default linters. Custom ESLint rules may be present.)
5. Testing
If present, run tests with:
npm test
(Not all code paths have test coverage yet.)
6. Environment
Requires Node.js 18.x+.
All necessary env variables (Sanity project ID, dataset, etc.) should be defined in .env.local.
Sanity Studio (if present) is usually in /sanity and runs with npm run sanity or npx sanity start.
Project Layout and Architecture
Directory/Key File Structure
• /app: All main Next.js routes and pages (e.g., /app/seo-gen/[slug]/page.jsx)
• /components: Common React components (UI, layout, banners, SEO, etc.)
• /lib/sanity.js: Sanity client, asset builder (urlFor)
• /styles/global.css: Main Tailwind/global CSS file
• /public: Static files and assets
• next.config.js: Next.js build and runtime config
• tailwind.config.js: Tailwind CSS setup
Important Facts
• Affiliate/CTA banners: Added based on the post’s type (postType field from Sanity).
See /app/seo-gen/[slug]/page.jsx or similar for logic.
• Content HTML: Cleaned and injected using cheerio in code, then rendered with dangerouslySetInnerHTML.
• Tables: Styled in /styles/global.css using Tailwind and custom prose overrides.
• Sanity Integration: All post content, images, and metadata come from Sanity via the API.
• Vercel Deployment: Standard Next.js Vercel setup. Build failures are most often due to missing dependencies or bad import paths.
Validation & CI
• Vercel CI: Every push triggers a deploy. Builds must pass before going live.
• No explicit GitHub Actions yet (unless workflow files are present).
• Sanity Studio (if present): See /sanity or a similar directory.
Troubleshooting Tips
• If a build fails with “Module not found: Can’t resolve …”, verify import paths (case-sensitive, especially on Vercel).
• Always check and set up .env.local for required secrets.
• If CSS doesn’t update, try clearing the .next and .vercel build caches, and restart the dev server.
Explicit Agent Instructions
Trust these instructions first. Search the codebase only if information is missing or appears incorrect.
Do not try random bash commands—follow the steps as documented here to avoid build and lint errors.
