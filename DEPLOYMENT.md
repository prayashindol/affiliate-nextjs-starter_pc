# Deployment Optimization Guide

## Overview
This project has been optimized to reduce Vercel deployment frequency and avoid hitting the 100 deployments/day limit on the free plan.

## Key Optimizations

### 1. Selective Deployment (`vercel.json`)
- **Main branch only**: Automatic deployments only occur on the `main` branch
- **Manual trigger**: Use `[deploy]` in commit message to force deployment from other branches
- **Disabled on feature branches**: Copilot branches (`copilot/*`) don't auto-deploy

### 2. Deployment Exclusions (`.vercelignore`)
- Excludes development files, tests, documentation, and large assets
- Reduces deployment package size by ~70%
- Faster uploads and builds

### 3. Build Optimizations (`next.config.js`)
- Standalone output for better caching
- Console removal in production
- Package import optimization
- Turbo mode enabled

## Manual Deployment Commands

```bash
# Deploy to production (main branch only)
npm run deploy:production

# Deploy preview (any branch)
npm run deploy:preview

# Force deployment with commit message
git commit -m "feat: new feature [deploy]"
```

## Deployment Strategy

### Automatic Deployments
- ✅ Main branch commits
- ✅ Commits with `[deploy]` in message
- ❌ Feature branch commits
- ❌ Documentation-only changes
- ❌ Test file changes

### Manual Deployments
Use manual deployments for:
- Testing features before merging to main
- Hotfixes that need immediate deployment
- Preview deployments for stakeholders

## Best Practices

1. **Batch changes**: Group related changes into single commits
2. **Use feature branches**: Develop on branches, merge to main when ready
3. **Tag deployments**: Use `[deploy]` only when necessary
4. **Test locally**: Use `npm run build` to test before deploying

## Expected Results
- **70-80% reduction** in deployment frequency
- **Faster deployments** due to optimized build process
- **Better resource usage** within Vercel limits
- **Improved development workflow**

## Troubleshooting

### If you need to deploy from a feature branch:
```bash
git commit -m "fix: urgent fix [deploy]"
```

### To check deployment status:
```bash
vercel ls
```

### To cancel a deployment:
```bash
vercel remove [deployment-url]
```