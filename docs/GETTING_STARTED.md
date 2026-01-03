# Get started with the brAInwav Wikidata CLI in minutes

This guide helps developers install the CLI and run their first Wikidata query end to end.

Last updated: 2026-01-03

## Table of contents
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Prerequisites
- Required: Node.js 18+, npm, and internet access.
- Required: a descriptive User-Agent string for Wikimedia APIs.
- Optional: OAuth token (encrypted locally) if you want authenticated requests.

## Quickstart
### 1) Install
```sh
npm install -g wikidata-cli
```

### 2) Run your first query
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
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
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  entity get Q42 --output ./Q42.json
```
- Verify: `./Q42.json` exists and contains JSON.

### Run a SPARQL file
- What you get: SPARQL results as JSON, CSV, or TSV.
- Steps:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  sparql query --file ./query.rq --format json
```
- Verify: result set printed to stdout.

### Use an encrypted token for authenticated reads
- What you get: `Authorization: Bearer ...` added to requests.
- Steps:
```sh
cat token.txt | wikidata auth login --token-stdin
wikidata --network --auth --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```
- Verify: token stored in `~/.config/wikidata-cli/credentials.json`.

## Troubleshooting
### Symptom: "User-Agent is required"
Cause: User-Agent is mandatory for Wikimedia APIs.
Fix:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

### Symptom: "Network access is disabled"
Cause: the CLI defaults to no network.
Fix:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

### Symptom: 429 rate limit
Cause: too many requests in a short time.
Fix: retry later or reduce request frequency.

## Reference
- Full usage: `docs/USAGE.md`.
- Configuration: `docs/CONFIG.md`.
- Troubleshooting: `docs/TROUBLESHOOTING.md`.
- License: `LICENSE` (MIT).
