# Understand the brAInwav Wikidata CLI architecture

This document gives a brief map of the codebase for contributors.

Last updated: 2026-01-03

## Table of contents
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Prerequisites
- Required: Node.js 18+.

## Quickstart
### 1) Read the entry points
- `src/cli.ts`: command routing, flags, and UX.
- `src/wikidata.ts`: API calls for REST, Action API, and SPARQL.

### 2) Verify
Expected outcome:
- You can map a CLI command to its handler quickly.

## Common tasks
### Add a new read-only command
- What you get: a new subcommand wired into the CLI.
- Steps:
  1. Add a command handler in `src/cli.ts`.
  2. Add any network calls in `src/wikidata.ts`.
  3. Add tests in `tests/`.
- Verify: `npm test` passes.

### Update output formatting
- What you get: consistent plain/JSON output across commands.
- Steps:
  1. Update `src/output.ts`.
  2. Verify `--json` output remains a single JSON object.

## Troubleshooting
### Symptom: command handler is hard to typecheck
Cause: missing or incorrect yargs argument typing.
Fix: ensure command handlers use `Arguments` and `Argv` types.

## Reference
- `src/cli.ts`: CLI surface and error handling.
- `src/output.ts`: JSON envelope and output helpers.
- `src/http.ts`: retry and timeout behavior.
- `src/crypto.ts`: AES-256-GCM credential encryption.
- `src/config.ts`: XDG config paths and persistence.
