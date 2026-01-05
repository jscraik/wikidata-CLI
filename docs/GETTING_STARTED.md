# Get started with the brAInwav wiKi CLI in minutes

This guide helps developers install the CLI and run their first Wikidata query end to end.
It is the shortest path to a working query. It uses safe read-only defaults.

Last updated: 2026-01-04

## Table of contents
- [Document requirements](#document-requirements)
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Risks and assumptions](#risks-and-assumptions)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Document requirements
- Audience: developers new to the CLI.
- Scope: installation and first successful read-only query.
- Non-scope: advanced configuration, automation, or writing to Wikidata.
- Owner: repository maintainers.
- Review cadence: every release or at least quarterly.
- Required approvals: maintainers for public changes.

## Prerequisites
- Required: Node.js 18+, npm, and internet access.
- Required: a descriptive User-Agent string for Wikimedia APIs.
- Optional: OAuth token (encrypted locally) if you want authenticated requests.

## Quickstart
### 1) Install
```sh
npm install -g wiki-cli
```

### 2) Run your first query
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

### 3) Verify
Expected output:
- JSON for `Q42` printed to stdout.
- Exit code `0` on success.

## Common tasks
### Save an entity to a file
- What you get: a local JSON file with the entity data.
- Steps:
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  entity get Q42 --output ./Q42.json
```
- Verify: `./Q42.json` exists and contains JSON.

### Run a SPARQL file
- What you get: SPARQL results as JSON, CSV, or TSV.
- Steps:
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  sparql query --file ./query.rq --format json
```
- Verify: result set printed to stdout.

### Use an encrypted token for authenticated reads
- What you get: `Authorization: Bearer ...` added to requests.
- Steps:
```sh
cat token.txt | wiki auth login --token-stdin
wiki --network --auth --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```
- Non-interactive (CI-friendly) example:
```sh
export WIKI_TOKEN="your-token"
export WIKI_PASSPHRASE="your-passphrase"
wiki auth login
```
- Verify: token stored in `~/.config/wiki-cli/credentials.json`.

### Set a default User-Agent
- What you get: a persistent User-Agent without repeating flags.
- Steps:
```sh
wiki config set user-agent "MyApp/1.0 (https://example.org/contact)"
```
- Verify:  `wiki --network entity get Q42` works without `--user-agent`.

## Risks and assumptions
- API calls require `--network`. The CLI defaults to no-network for safety.
- Wikimedia APIs require a descriptive User-Agent. Missing values block requests.
- Auth tokens are encrypted on disk. Keep the passphrase secret.

## Troubleshooting
### Symptom: "User-Agent is required"
Cause: User-Agent is mandatory for Wikimedia APIs.
Fix:
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

### Symptom: "Network access is disabled"
Cause: the CLI defaults to no network.
Fix:
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

### Symptom: 429 rate limit
Cause: too many requests in a short time.
Fix: retry later or reduce request frequency.

## Reference
- Full usage: `docs/USAGE.md`.
- Configuration: `docs/CONFIG.md`.
- Troubleshooting: `docs/TROUBLESHOOTING.md`.
- License: `LICENSE` (MIT).
