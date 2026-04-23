---
description: 'Foundation workflow for the Bulwar agentic page-builder system. Use when setting up a repo, defining .env requirements, copying operational scripts, preparing deployment workflow, or checking non-negotiable project safety rules.'
applyTo: '.github/**, SCRIPTS/**, docs/plan/astro-wordpress-page-builder/**, docs/setup/**'
---

# Project Foundation

Use this instruction when the task is about repository setup, environment preparation, deployment operations, or copying required scripts into the project.

## Core Model

- The repo is the source of truth for workflow rules, block contracts, scenario templates, and page-building conventions.
- WordPress is runtime storage for page instances and their meta payloads.
- Make.com is the execution layer for production AI content updates.

## Non-Negotiable Rules

- Never commit secrets, API keys, SSH keys, webhook secrets, or production credentials.
- Every required secret must appear in `.env.example` with a description, but without a real value.
- Real `.env` files must stay gitignored.
- Never improvise deployment commands if a repo script already exists.
- Never deploy to dhosting without fixing permissions to `755` for directories and `644` for files.
- Never store the page-builder contract only in WordPress. WordPress stores instances, not system truth.

## Required Setup Artifacts

Every page-builder-capable repo should have or grow toward these artifacts:

- `.env.example`
- gitignored local `.env`
- deploy script for static frontend output
- rollback script for static frontend output
- docs describing the page-builder architecture and workflow
- docs describing block contracts and page schemas
- scripts for Make.com scenario creation or update

Current known required operational scripts in this repo include:

- `SCRIPTS/deploy-astro-static.ps1`
- `SCRIPTS/rollback-astro-static.ps1`

## Setup Workflow

When preparing a repo or new environment:

1. Verify the current repo structure and existing scripts before proposing additions.
2. List all required environment variables in `.env.example`.
3. Keep secret acquisition separate from repo documentation.
4. Ensure deployment and rollback scripts exist before relying on them in instructions.
5. Document the canonical deploy path once and reuse it everywhere else.

## Script Copying Rules

- Treat scripts as operational assets with ownership, not throwaway snippets.
- If a script is copied from another repo or prototype, adapt paths, hostnames, and assumptions explicitly.
- After adding a script, document what inputs it expects, what it mutates, and what success looks like.
- Avoid duplicate scripts that do nearly the same thing under different names.

## Deliverables For Setup Tasks

For setup-related tasks, the expected result should usually include:

- updated or created `.env.example`
- verified gitignore coverage for secrets and generated artifacts
- canonical deploy and rollback scripts
- one primary setup or deployment document
- explicit list of remaining external credentials the operator must provide manually

## What To Avoid

- Do not hide required credentials inside chat-only knowledge.
- Do not let deployment knowledge live only in one shell history.
- Do not add a second “temporary” deployment path if a primary one already exists.
- Do not treat generated build artifacts as required source files.
