# Astro Hosting Layout

## Purpose

This document fixes the physical folder layout for the Astro deployment on the current dhosting server.

The hosting account does not currently provide `node` or `npm` in shell, so Astro build should be executed locally or in CI, and only the generated static output should be uploaded to the server.

## Final Folder Layout

### 1. Astro source code

Astro source should remain outside the public web root.

Recommended server path:

`/home/klient.dhosting.pl/bulwar/astro-site/`

Purpose:

- optional mirror of source code
- deployment helper files
- future server-side scripts if hosting capabilities change

Important:

- this is not the public website directory
- users should never hit files from here directly in browser

### 2. Final public static output

The generated `dist` content should be deployed into a public folder served by the domain.

Recommended server path:

`/home/client-user/domains/client.example/public_html/astro/`

Purpose:

- this is the live public Astro output
- this directory should contain only the generated static build

Important:

- do not copy the entire Astro project here
- copy only the contents of `astro-site/dist`

### 3. Deployment backups

Every Astro deployment should keep a backup snapshot of the previous public output.

Recommended server path:

`/home/klient.dhosting.pl/bulwar/deploy_backups/astro/`

Purpose:

- rollback safety
- comparison between deployments
- disaster recovery if a bad build is published

Each deployment backup should be stored in a timestamped subfolder, for example:

- `/home/klient.dhosting.pl/bulwar/deploy_backups/astro/20260411-171500/`

## Resulting Deployment Model

### Local machine or CI

Build runs here:

- source code location: `astro-site/`
- build command: `npm run build`
- output: `astro-site/dist/`

### Hosting server

Only the built static output is published here:

- public destination: `/home/client-user/domains/client.example/public_html/astro/`

Old public output is copied here before overwrite:

- backup destination: `/home/klient.dhosting.pl/bulwar/deploy_backups/astro/`

## Current Constraint

As verified on 2026-04-11, current shell environment on the hosting account has:

- no `node`
- no `npm`

Therefore the current correct workflow is:

1. build Astro locally or in CI
2. upload generated `dist`
3. unpack to public Astro directory
4. keep timestamped backup of previous public output

## Helper Script

A deployment helper for this layout is stored locally in:

`SCRIPTS/deploy-astro-static.ps1`

Operational local Windows deploy instructions are documented in:

`docs/plan/astro-wordpress-page-builder/local-astro-deploy-from-windows.md`

This script:

- checks that local `astro-site/dist` exists
- creates a deployment archive
- uploads the archive to the server
- ensures the required directories exist
- copies previous public output to the backup folder
- deploys the new static output to the public Astro directory
- fixes permissions to dhosting-safe values
