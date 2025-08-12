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

## Troubleshooting Deployment Errors

### Common Issues Fixed (v2024.08.12)

#### 1. Workflow Syntax Errors
**Problem**: GitHub Actions workflows failing due to incorrect secret checking syntax.
**Fix**: Updated workflows to use proper GitHub Actions secret syntax:
- Changed `!secrets.SECRET_NAME` to `secrets.SECRET_NAME == ''`
- Added fallback handling for missing secrets
- Improved error handling and environment variable safety

#### 2. Missing Permissions
**Problem**: Workflows failing due to missing permissions.
**Fix**: Added explicit permissions to all workflows:
```yaml
permissions:
  contents: read
```

#### 3. Environment Variable Safety
**Problem**: Bash scripts failing when environment variables are undefined.
**Fix**: Added proper variable handling:
```bash
if [ -n "${PREVIEW_DEPLOY_HOOK:-}" ]; then
  # Safe variable handling with fallbacks
fi
```

#### 4. Concurrency Issues
**Problem**: Multiple workflows running simultaneously causing conflicts.
**Fix**: Added proper concurrency control:
```yaml
concurrency:
  group: vercel-pr-deploy-${{ github.event.pull_request.number || github.run_id }}
  cancel-in-progress: true
```

### Debugging Failed Deployments

1. **Check GitHub Actions**: Go to the "Actions" tab to see workflow run details
2. **Verify Secrets**: Ensure `VERCEL_DEPLOY_HOOK` is configured in repository secrets
3. **Check Vercel Deploy Hooks**: Verify hooks exist and are active in Vercel project settings
4. **Manual Test**: Try running the workflow manually to isolate issues

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

## Best Practices

1. **Development Cycle**: Create PR → Review preview deployment → Merge when ready
2. **Testing**: Use both preview and production deployments to catch environment-specific issues
3. **Coordination**: PRs now deploy to production automatically - coordinate team deployments carefully
4. **Monitoring**: Watch deployment status in GitHub PR checks
5. **Secret Management**: Regularly rotate Vercel deploy hook URLs for security