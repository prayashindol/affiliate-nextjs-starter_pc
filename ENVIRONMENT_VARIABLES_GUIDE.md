# Environment Variables Setup Guide

This guide explains how to properly configure environment variables for the STR Specialist Next.js application, particularly focusing on resolving issues with Viator and Sanity API keys not being detected in Vercel deployments.

## Overview

The application uses two types of environment variables:

1. **Server-side variables** (secure, not exposed to browser)
2. **Client-side variables** (prefixed with `NEXT_PUBLIC_`, available in browser)

## Required Environment Variables

### Server-Side Variables (Secure)
- `VIATOR_API_KEY` - For Viator tours integration
- `NEXTAUTH_SECRET` - For authentication

### Client-Side Variables (Public)
- `NEXT_PUBLIC_SANITY_TOKEN` - For Sanity CMS access
- `NEXT_PUBLIC_SITE_URL` - Your site URL

## Common Issues & Solutions

### Issue 1: "Can't find Viator/Sanity API key"

**Symptoms:**
- Viator tours show "Tours Temporarily Unavailable"
- Sanity content doesn't load
- Environment diagnostics page shows variables as "NOT SET"

**Root Causes:**
1. Variables not set in correct Vercel environment
2. Incorrect variable names
3. Variables not applied to all environments (Production, Preview, Development)
4. Application not redeployed after setting variables

**Solution Steps:**

#### Step 1: Verify Variable Names
Ensure exact naming in Vercel dashboard:
```
✅ VIATOR_API_KEY          (not VIATOR_API or VIATOR-API-KEY)
✅ NEXT_PUBLIC_SANITY_TOKEN (not SANITY_TOKEN or SANITY_API_KEY)  
✅ NEXTAUTH_SECRET
✅ NEXT_PUBLIC_SITE_URL
```

#### Step 2: Set Variables in Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add each variable with these settings:
   - **Name**: Exact variable name (see above)
   - **Value**: Your API key/token
   - **Environments**: Select ALL - Production, Preview, Development

#### Step 3: Verify Token Formats
- **Sanity Token**: Should start with `sk` (e.g., `skAbCdEf123...`)
- **Viator API Key**: Usually 32+ characters long
- **NextAuth Secret**: 32+ character random string

#### Step 4: Redeploy Application
After setting variables, you **MUST** trigger a new deployment:
- Go to **Deployments** tab in Vercel
- Click **Redeploy** on latest deployment
- Or push a new commit to trigger automatic deployment

### Issue 2: Variables Available in Development but Not Production

**Cause:** Variables set only for Development environment

**Solution:**
1. In Vercel Environment Variables settings
2. Check that each variable is enabled for **Production** environment
3. Redeploy production

### Issue 3: Next.js 15 Environment Variable Changes

**Potential Issue:** Next.js 15 may have different behavior for environment variable loading

**Solution:**
We've added explicit diagnostics to detect this. Visit `/test/env-diagnostics` on your deployed site to check variable availability.

## Verification Steps

### 1. Use the Diagnostics Page
Visit `https://your-site.vercel.app/test/env-diagnostics` to check:
- Which variables are detected
- Variable format validation
- Environment-specific availability

### 2. Test Viator Integration
Visit `https://your-site.vercel.app/test/viator-motueka` to verify:
- Viator API key is working
- Tours are loading correctly
- Error messages if there are issues

### 3. Check Build Logs
In Vercel dashboard:
1. Go to **Deployments**
2. Click on latest deployment
3. Check **Build Logs** for environment variable errors

## Alternative Configuration Methods

### Method 1: Local .env File (Development Only)
For local development, create `.env.local`:
```bash
VIATOR_API_KEY=your-actual-viator-key
NEXT_PUBLIC_SANITY_TOKEN=your-actual-sanity-token
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Method 2: Vercel CLI (Advanced)
```bash
# Set environment variables via CLI
vercel env add VIATOR_API_KEY
vercel env add NEXT_PUBLIC_SANITY_TOKEN

# Pull environment variables to local
vercel env pull .env.local
```

## Security Best Practices

### Server-Side Variables (No NEXT_PUBLIC_ prefix)
- ✅ `VIATOR_API_KEY` - Secure, not exposed to browser
- ✅ `NEXTAUTH_SECRET` - Secure, not exposed to browser

### Client-Side Variables (NEXT_PUBLIC_ prefix)  
- ✅ `NEXT_PUBLIC_SANITY_TOKEN` - Public, visible in browser
- ✅ `NEXT_PUBLIC_SITE_URL` - Public, visible in browser

**Important:** Only use `NEXT_PUBLIC_` prefix for values that are safe to expose publicly.

## Troubleshooting Checklist

- [ ] Variable names match exactly (case-sensitive)
- [ ] Variables set for all environments (Production, Preview, Development)
- [ ] Application redeployed after setting variables
- [ ] Sanity token starts with 'sk'
- [ ] Viator API key is 32+ characters
- [ ] No typos in variable names
- [ ] Diagnostics page shows variables as "SET"

## Getting Help

If issues persist after following this guide:

1. **Check diagnostics page**: `/test/env-diagnostics`
2. **Review Vercel build logs** for specific error messages
3. **Verify API keys** are valid in their respective dashboards
4. **Test locally** with `.env.local` file to isolate Vercel-specific issues

## Quick Fix Commands

```bash
# Test environment variables locally
npm run dev
# Visit: http://localhost:3000/test/env-diagnostics

# Verify build with environment variables
npm run build

# Deploy with Vercel CLI (if needed)
vercel --prod
```

This comprehensive setup should resolve most environment variable detection issues in Vercel deployments.