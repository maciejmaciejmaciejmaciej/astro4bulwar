---
description: 'Make.com scenario workflow for Bulwar production AI page editing. Use when generating or updating Make blueprints, deriving output descriptions from block docs, syncing page_builder_schema_for_ai with page_builder_schema, or wiring redeploy webhooks after content edits.'
applyTo: '.github/workflows/**, wordpress-plugin/bulwar-bridge/**, docs/plan/astro-wordpress-page-builder/**, SCRIPTS/**'
---

# Make Scenario Workflow

Use this instruction when the task is about Make.com blueprint generation, production AI page editing, schema-safe content updates, or redeploy orchestration.

## Scenario Purpose

Each page should have a matching Make.com scenario that edits structured content, not arbitrary page HTML or random WordPress fields.

The scenario should operate on:

- current `page_builder_schema_for_ai`
- current `page_builder_schema`
- plain-language user change request

The scenario should return:

- updated `page_builder_schema_for_ai`
- updated `page_builder_schema`

## Recommended 3-Module Pattern

### Module 1: AI Content Editor

Responsibilities:

- start from the current page values as defaults
- update only relevant fields based on user intent
- preserve block identities and structure
- output strict schema-bound payloads

Critical rule:

- output descriptions should be derived from repo-maintained block docs, not invented ad hoc in Make

### Module 2: WordPress Meta Updater

Responsibilities:

- write the updated `page_builder_schema`
- write the updated `page_builder_schema_for_ai`
- set page status or a dedicated flag indicating the page now requires redeployment

### Module 3: Redeploy Trigger

Responsibilities:

- trigger a webhook that can start GitHub Actions deployment
- only do so after an explicit publish or redeploy approval step

## Production Editing Rules

- Make.com is allowed to edit content values inside approved structures.
- Make.com must not invent new block ids.
- Make.com must not silently reorder blocks.
- Make.com must not mutate unsupported fields outside the contract.
- Make.com should be treated as a controlled editor, not as the owner of the schema model.

## WordPress Publish-State Rule

After a production content edit through Make:

- the page should be treated as changed and waiting for redeploy
- the management layer or orchestrating agent should detect this state
- redeploy should be a deliberate step, not a hidden automatic side effect

## Blueprint Generation Rules

When generating or updating a Make blueprint:

1. derive field descriptions from block documentation maintained in repo
2. align Make output structure with the two WordPress meta payloads
3. ensure current page values can populate default output values
4. keep the scenario deterministic enough to be regenerated after deploys

## What To Avoid

- Do not build Make prompts around raw JSX or frontend implementation details.
- Do not let the scenario edit only the AI schema while leaving the render schema stale.
- Do not allow redeploy webhooks to fire without an explicit publish decision.
- Do not put contract truth only inside a Make blueprint.
