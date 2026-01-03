# Use the brAInwav Wikidata CLI to query Wikidata end to end

This reference lists commands, flags, and examples for the public CLI.

Last updated: 2026-01-03

## Table of contents
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Prerequisites
- Required: Node.js 18+, npm, internet access, and a User-Agent string.

## Quickstart
### 1) Run a basic query
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

### 2) Verify
Expected output:
- JSON entity data printed to stdout.

## Common tasks
### Query an entity
- What you get: the entity JSON for Q/P/L ids.
- Steps:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```
- Verify: output includes `id` and `labels`.

### Fetch statements
- What you get: statements for the entity.
- Steps:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity statements Q42
```
- Verify: output includes statement arrays.

### Run SPARQL
- What you get: query results in JSON/CSV/TSV.
- Steps:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  sparql query --file ./query.rq --format json
```
- Verify: results include `head` and `results`.

### Search with the Action API
- What you get: entity search results.
- Steps:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  action search --query "New York" --language en --limit 5
```
- Verify: results include `id` and `label` fields.

### Raw REST request
- What you get: raw REST response for a path under the REST API base.
- Steps:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  raw request GET /entities/items/Q42
```
- Verify: response contains the entity data.

### Authenticate reads (optional)
- What you get: `Authorization: Bearer` header added.
- Steps:
```sh
cat token.txt | wikidata auth login --token-stdin
wikidata --network --auth --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

## Troubleshooting
### Symptom: "Path must start with '/'"
Cause: raw requests require an absolute path.
Fix:
```sh
wikidata --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  raw request GET /entities/items/Q42
```

### Symptom: "Passphrase entry requires a TTY"
Cause: encrypted token storage requires interactive input.
Fix: run the command in an interactive terminal without `--no-input`.

### Symptom: "User-Agent is required"
Cause: User-Agent is missing.
Fix: add `--user-agent` or set `WIKIDATA_USER_AGENT`.

## Reference
### Command summary
- `wikidata entity get <id>`
- `wikidata entity statements <id>`
- `wikidata sparql query --file <query.rq> --format json|csv|tsv`
- `wikidata action search --query <text> [--language <lang>] [--limit <n>]`
- `wikidata raw request <method> <path> [--body-file <json>]`
- `wikidata auth login|status|logout`
- `wikidata doctor`

### Global flags
- `--network`: enable network access (required for any API call).
- `--user-agent`: required for Wikimedia APIs.
- `--auth`: use stored token for `Authorization: Bearer`.
- `--json`: JSON envelope output.
- `--plain`: plain output for scripts.
- `--output <file>`: write to file or `-` for stdout.
- `--timeout <ms>`: request timeout (default 15000).
- `--retries <n>`: retries for 429/5xx (default 2).
- `--retry-backoff <ms>`: base backoff in ms (default 400).
- `--quiet` / `--verbose` / `--debug`: logging levels.
- `--no-input`: disable prompts.
- `--no-color`: disable color.

### Exit codes
- `0` success
- `1` generic failure
- `2` invalid usage/validation
- `3` policy refusal (missing `--network` or `--user-agent`)
- `4` partial success
- `130` user abort
