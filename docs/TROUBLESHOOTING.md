# Fix common brAInwav Wikidata CLI issues quickly

This guide lists the most common errors and how to fix them.

Last updated: 2026-01-03

## Table of contents
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Prerequisites
- Required: Node.js 18+, npm.

## Quickstart
### 1) Confirm the CLI is installed
```sh
wikidata --version
```

### 2) Verify network and User-Agent
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

### 3) Verify
Expected output:
- JSON entity data or a helpful error.

## Common tasks
### Capture errors for debugging
- What you get: detailed diagnostics in stderr.
- Steps:
```sh
wikidata --network --debug --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```
- Verify: stderr includes debug output.

## Troubleshooting
### Symptom: "Network access is disabled"
Cause: the CLI defaults to no network.
Fix: add `--network` to any API request.

### Symptom: "User-Agent is required"
Cause: missing or empty User-Agent.
Fix: add `--user-agent` or set `WIKIDATA_USER_AGENT`.

### Symptom: 429 rate limit or 5xx responses
Cause: server throttling or temporary outage.
Fix: retry with backoff or wait before re-running.

### Symptom: "Passphrase entry requires a TTY"
Cause: encrypted token entry needs interactive input.
Fix: run in a TTY without `--no-input`.

## Reference
- Usage: `docs/USAGE.md`.
- Config: `docs/CONFIG.md`.
- Start here: `docs/GETTING_STARTED.md`.
