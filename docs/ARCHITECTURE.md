# Understand the brAInwav Wikidata CLI architecture

This document gives a brief map of the codebase for contributors.
It is a quick orientation. It is not a deep design spec.

Last updated: 2026-01-04

## Table of contents
- [Document requirements](#document-requirements)
- [Overview](#overview)
- [Key modules](#key-modules)
- [Common changes](#common-changes)
- [Risks and assumptions](#risks-and-assumptions)
- [Troubleshooting](#troubleshooting)

## Document requirements
- Audience: contributors who need to navigate the codebase.
- Scope: high-level module map and extension points.
- Non-scope: detailed API docs or implementation walkthroughs.
- Owner: repository maintainers.
- Review cadence: every release or at least quarterly.
- Required approvals: maintainers for public changes.

## Overview
The CLI has a single entry point. It validates global flags, enforces safety checks, and routes subcommands to request handlers.

## Key modules
- `src/cli.ts`: command routing, flags, output handling, and UX.
- `src/wikidata.ts`: REST, Action API, and SPARQL calls.
- `src/http.ts`: retry, timeout, and error translation.
- `src/output.ts`: JSON envelope and plain output formatting.
- `src/config.ts`: XDG config paths and persistence.
- `src/crypto.ts`: AES-256-GCM credential encryption.
- `src/io.ts`: stdin, file, and prompt helpers.

## Common changes
### Add a new read-only command
- Add a command handler in `src/cli.ts`.
- Add any network calls in `src/wikidata.ts`.
- Add tests in `tests/`.
- Verify `npm test` passes.

### Update output formatting
- Update `src/output.ts`.
- Verify `--json` output remains a single JSON object.

## Risks and assumptions
- All commands are read-only by design. New features must preserve that policy.
- CLI safety defaults depend on the `--network` gate and User-Agent enforcement.

## Troubleshooting
### Symptom: command handler is hard to typecheck
Cause: missing or incorrect yargs argument typing.
Fix: ensure command handlers use `Arguments` and `Argv` types.
