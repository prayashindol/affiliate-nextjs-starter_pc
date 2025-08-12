# Production Deployments (Vercel)

This project deploys to Vercel with both automatic PR previews and production deployments. 

## Deployment Configuration

### PR Deployments (Preview + Production)
- **Automatic**: All pull requests to `main` trigger deployments to both preview and production environments
- **Purpose**: Allows testing changes in both environments before merging
- **Workflow**: `.github/workflows/vercel-pr-deploy.yml`

### Main Branch Deployments (Production Only)
- **Automatic**: Pushes to `main` branch trigger production deployments
- **Purpose**: Final production deployment after PR merge
- **Workflow**: `.github/workflows/vercel-deploy.yml`

## One-time Setup

### Required Secrets
1. In Vercel, open your Project → Settings → Deploy Hooks.
2. Create a Deploy Hook for **Production** and copy its URL.
3. (Optional) Create a Deploy Hook for **Preview** and copy its URL.
4. In this GitHub repository, go to Settings → Secrets and variables → Actions:

**Required:**
- Name: `VERCEL_DEPLOY_HOOK`
- Value: Production hook URL from step 2

**Optional (for separate preview deployments):**
- Name: `VERCEL_PREVIEW_DEPLOY_HOOK` 
- Value: Preview hook URL from step 3
- Note: If not set, PRs will use the production hook for preview deployments

## How It Works

### Pull Request Deployments
- The workflow `.github/workflows/vercel-pr-deploy.yml` runs on:
  - Pull request events: `opened`, `synchronize`, `reopened`
  - Manual trigger via the "Run workflow" button (Actions tab)
- **Dual Deployment**: Each PR triggers both preview and production deployments
- **Preview Environment**: Uses `VERCEL_PREVIEW_DEPLOY_HOOK` if configured, otherwise falls back to production hook
- **Production Environment**: Uses `VERCEL_DEPLOY_HOOK` for immediate production testing

### Main Branch Deployments  
- The workflow `.github/workflows/vercel-deploy.yml` runs on:
  - `push` to `main` (e.g., when PRs are merged)
  - Manual trigger via the "Run workflow" button (Actions tab)
- When the secret is configured, the workflow will `POST` to the Vercel Deploy Hook to request a production deployment.

## Manual Deployment

### From GitHub Actions
- **PR Deployment**: Go to Actions → "Vercel PR Deploy (Preview + Production)" → Run workflow
- **Main Branch Deployment**: Go to Actions → "Vercel Production Deploy (Main Branch)" → Run workflow

### From Command Line
```bash
# Deploy to production
npm run deploy:production

# Deploy preview 
npm run deploy:preview
```

## Vercel Configuration Changes

### What Changed
- **Enabled PR Deployments**: `vercel.json` now allows deployments from feature branches and PRs
- **Removed Build Restrictions**: Removed the restrictive `ignoreCommand` that was preventing PR builds
- **GitHub Integration**: Changed `silent: false` to show deployment status in GitHub

### vercel.json Key Changes
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "copilot/*": true  // Now enabled for PR branches
    }
  },
  "github": {
    "silent": false  // Show deployment status in PRs
  }
  // Removed restrictive ignoreCommand
}
```

## Development Workflow

### For Pull Requests
1. **Create PR**: Open a pull request against `main` branch
2. **Automatic Deployment**: GitHub Actions automatically triggers deployments to:
   - Preview environment (for testing)
   - Production environment (for immediate validation)
3. **Preview Changes**: Use the preview URL to review changes before merging
4. **Merge**: Once satisfied, merge the PR to main

### For Emergency Deployments
- Use `[deploy]` in commit message on any branch to force deployment
- Example: `git commit -m "hotfix: critical bug [deploy]"`

## Notes About vercel.json and Forcing Deploys

### Current Configuration
- **All Branches**: PRs and feature branches now deploy automatically
- **No Build Restrictions**: Removed the `ignoreCommand` that was preventing builds
- **GitHub Integration**: Deployment status visible in GitHub PRs

## Additional Deployment Optimizations

The project includes several optimizations to reduce Vercel deployment frequency and avoid hitting limits:

### Selective Deployment
- **Main branch only**: Automatic deployments only occur on the `main` branch
- **Manual trigger**: Use `[deploy]` in commit message to force deployment from other branches
- **Disabled on feature branches**: Copilot branches (`copilot/*`) don't auto-deploy

### Manual Deployment Commands
```bash
# Deploy to production (main branch only)
npm run deploy:production

# Deploy preview (any branch)
npm run deploy:preview

# Force deployment with commit message
git commit -m "feat: new feature [deploy]"
```

### Best Practices
1. **Development Cycle**: Create PR → Review preview deployment → Merge when ready
2. **Testing**: Use both preview and production deployments to catch environment-specific issues
3. **Coordination**: PRs now deploy to production automatically - coordinate team deployments carefully
4. **Monitoring**: Watch deployment status in GitHub PR checks