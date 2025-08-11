# Production Deployments (Vercel)

This project deploys to Vercel. To guarantee that merges to `main` trigger a production deploy, this repo includes a GitHub Actions workflow that calls a Vercel Deploy Hook.

## One-time Setup

1. In Vercel, open your Project → Settings → Deploy Hooks.
2. Create a Deploy Hook for Production and copy its URL.
3. In this GitHub repository, go to Settings → Secrets and variables → Actions → New repository secret:
   - Name: `VERCEL_DEPLOY_HOOK`
   - Value: the hook URL from step 2

## How It Works

- The workflow `.github/workflows/vercel-deploy.yml` runs on:
  - `push` to `main` (e.g., when PRs are merged)
  - Manual trigger via the "Run workflow" button (Actions tab)
- When the secret is configured, the workflow will `POST` to the Vercel Deploy Hook to request a production deployment.

## Manual Deployment

- Go to Actions → Vercel Production Deploy → Run workflow and click Run.

## Notes About vercel.json and Forcing Deploys

- If you use an `ignoreCommand` in `vercel.json` to reduce unnecessary builds, ensure that:
  - Builds on `main` (and optionally commit messages including `[deploy]`) are NOT ignored.
  - Example allow-main / allow-[deploy] pattern:
    ```
    "ignoreCommand": "bash -c 'if [[ \"$VERCEL_GIT_COMMIT_REF\" == \"main\" ]] || [[ \"$VERCEL_GIT_COMMIT_MESSAGE\" =~ \\[deploy\\] ]]; then exit 1; else exit 0; fi'"
    ```
- You can also force a deploy by pushing a commit with `[deploy]` in the message.

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
1. **Batch changes**: Group related changes into single commits
2. **Use feature branches**: Develop on branches, merge to main when ready
3. **Tag deployments**: Use `[deploy]` only when necessary
4. **Test locally**: Use `npm run build` to test before deploying