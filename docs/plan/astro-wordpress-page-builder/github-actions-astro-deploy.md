# GitHub Actions Astro Deploy

This repository now includes a GitHub Actions workflow for Astro static deployment to the current dhosting server.

Workflow file:

- `.github/workflows/deploy-astro-dhosting.yml`

## What It Does

- runs on `push` to `main` when `astro-site/` or the workflow file changes
- supports manual trigger with `workflow_dispatch`
- installs dependencies in `astro-site/`
- builds Astro static output
- packs `astro-site/dist`
- uploads the archive to dhosting over SSH
- creates a timestamped backup of the current `/public_html/astro`
- deploys the new static files
- fixes permissions to `755` for directories and `644` for files

## Required GitHub Repository Secrets

- `DHOSTING_SSH_HOST`
- `DHOSTING_SSH_USER`
- `DHOSTING_SSH_KEY`

## Remote Paths Used By The Workflow

- public output: `/home/client-user/domains/client.example/public_html/astro`
- backups: `/home/klient.dhosting.pl/bulwar/deploy_backups/astro`

## Trigger Strategy

Default deployment strategy is now:

- automatic deploy on `main` changes inside `astro-site/`
- manual deploy from Actions tab when needed

For the canonical local Windows fallback deploy, use:

- `docs/plan/astro-wordpress-page-builder/local-astro-deploy-from-windows.md`

This keeps Astro deployment isolated from the existing React deployment.
