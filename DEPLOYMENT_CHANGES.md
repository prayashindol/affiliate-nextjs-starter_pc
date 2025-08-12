# Deployment Configuration Changes

## Overview
This document describes the changes made to enable PR deployments to both Vercel preview and production environments as requested in issue #116.

## Changes Made

### 1. Modified `vercel.json`

**Before:**
```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "copilot/*": false
    }
  },
  "ignoreCommand": "bash -c 'if [[ \"$VERCEL_GIT_COMMIT_REF\" == \"main\" ]] || [[ \"$VERCEL_GIT_COMMIT_MESSAGE\" =~ \\[deploy\\] ]]; then exit 1; else exit 0; fi'"
}
```

**After:**
```json
{
  "git": {
    "deploymentEnabled": true
  }
}
```

**Impact:**
- Enables automatic deployments for all branches (not just main)
- Removes the ignore command that was preventing non-main branch deployments
- This allows PRs to automatically create preview deployments on Vercel

### 2. Updated GitHub Workflow (`.github/workflows/vercel-deploy.yml`)

**Before:**
- Only triggered on push to main branch
- Only deployed to production

**After:**
- Triggers on push to main branch AND pull requests
- Deploys to production for both main pushes and PRs
- Better logging to distinguish deployment types

**Key Changes:**
```yaml
on:
  push:
    branches: [ "main" ]
  pull_request:           # NEW: Added PR trigger
    branches: [ "main" ]
  workflow_dispatch:
```

## How It Works Now

### For Pull Requests:
1. **Automatic Preview Deployment:** Vercel automatically creates a preview deployment (due to `deploymentEnabled: true`)
2. **Manual Production Deployment:** GitHub workflow triggers to deploy the same code to production
3. **Result:** PR gets both preview and production deployments

### For Main Branch:
1. **Automatic Preview Deployment:** Vercel creates a preview deployment
2. **Production Deployment:** GitHub workflow deploys to production
3. **Result:** Standard main branch → production flow

## Benefits

1. **Preview Before Merge:** Developers can preview changes in a staging environment
2. **Direct to Production:** Changes also deploy directly to production as requested
3. **Flexible Workflow:** Supports both development preview and immediate production deployment needs
4. **Backward Compatible:** Main branch deployments continue to work as before

## Requirements

- The `VERCEL_DEPLOY_HOOK` secret must be configured in the GitHub repository
- This should be a deploy hook URL from your Vercel project's production environment

## Usage

1. **Create a PR:** Automatically gets both preview and production deployments
2. **Push to main:** Automatically deploys to production
3. **Manual trigger:** Can manually trigger production deployment via GitHub Actions UI

## Note on Best Practices

While this configuration meets the specific request to deploy PRs directly to production, typical deployment strategies would separate preview and production environments. This setup is designed for the development phase where immediate production feedback is desired.