# Configure the brAInwav Wikidata CLI safely

This guide explains environment variables, local config, and encrypted credentials.

Last updated: 2026-01-03

## Table of contents
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Prerequisites
- Required: Node.js 18+, npm.
- Optional: a token file if you want authenticated reads.

## Quickstart
### 1) Set a User-Agent
```sh
export WIKIDATA_USER_AGENT="MyApp/1.0 (https://example.org/contact)"
```

### 2) Run a query
```sh
wikidata --network entity get Q42
```

### 3) Verify
Expected output:
- JSON entity data printed to stdout.

## Common tasks
### Store an encrypted token
- What you get: encrypted credentials in the XDG config directory.
- Steps:
```sh
cat token.txt | wikidata auth login --token-stdin
```
- Verify: `~/.config/wikidata-cli/credentials.json` exists and is not plaintext.

### Change endpoints
- What you get: custom API endpoints for other Wikibase instances.
- Steps:
```sh
wikidata --network --api-url https://www.wikidata.org/w/rest.php/wikibase/v1 \
  --action-url https://www.wikidata.org/w/api.php \
  --sparql-url https://query.wikidata.org/sparql \
  entity get Q42
```
- Verify: requests go to the specified endpoints.

## Troubleshooting
### Symptom: "Passphrase entry requires a TTY"
Cause: encrypted token storage requires interactive input.
Fix: run in a TTY without `--no-input`.

### Symptom: "No stored token found"
Cause: `--auth` was used before `auth login`.
Fix:
```sh
wikidata auth login --token-stdin < token.txt
```

### Symptom: "User-Agent is required"
Cause: missing User-Agent.
Fix: set `WIKIDATA_USER_AGENT` or pass `--user-agent`.

## Reference
### Environment variables
- `WIKIDATA_USER_AGENT`: required User-Agent string.
- `WIKIDATA_API_URL`: REST API base URL.
- `WIKIDATA_ACTION_URL`: Action API URL.
- `WIKIDATA_SPARQL_URL`: SPARQL endpoint URL.

### Local config paths
- Config dir: `~/.config/wikidata-cli/`
- Credentials: `~/.config/wikidata-cli/credentials.json` (AES-256-GCM + scrypt).
