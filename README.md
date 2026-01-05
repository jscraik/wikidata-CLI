```text
$ wiki --help
W   W  III  K   K  III
W   W   I   K  K   I
W W W   I   KK    I
WW WW   I   KK    I
W   W   I   K  K   I
W   W  III  K   K  III

brAInwav · wiKi CLI
```

[![npm](https://img.shields.io/npm/v/wiki-cli?color=d97757)](https://www.npmjs.com/package/wiki-cli)
[![ci](https://github.com/jscraik/wiKi-CLI/actions/workflows/ci.yml/badge.svg)](https://github.com/jscraik/wiKi-CLI/actions/workflows/ci.yml)
[![security](https://img.shields.io/badge/security-policy-6a9bcc)](SECURITY.md)
[![license](https://img.shields.io/badge/license-MIT-788c5d)](LICENSE)

# brAInwav wiKi CLI helps developers query Wikidata safely and quickly

Safe, script-friendly CLI for Wikidata REST, SPARQL, and Action API queries. Read-only by default.

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
- Audience: developers and data teams using the CLI (beginner to intermediate).
- Scope: install, configure, and run read-only Wikidata queries with the CLI.
- Non-scope: Wikidata data modeling, write operations, or hosting a Wikibase instance.
- Owner: repository maintainers.
- Review cadence: every release or at least quarterly.
- Required approvals: maintainers for public changes.

## Prerequisites
- Required: Node.js 18+, npm, internet access, and a descriptive User-Agent string for Wikimedia APIs.
- Optional: OAuth token for higher rate limits (still read-only).

## Quickstart
### 1) Install
```sh
npm install -g wiki-cli
```

### 2) Run a query
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```

### 3) Verify
Expected output:
- JSON for the entity, or a JSON envelope when using `--json`.
- Exit code `0` on success.

## Common tasks
### Get an entity and save it to a file
- What you get: the entity JSON for a Q/P/L id.
- Steps:
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  entity get Q42 --output ./Q42.json
```
- Verify: `./Q42.json` contains the entity data.

### Run a SPARQL query from a file
- What you get: SPARQL results in JSON/CSV/TSV.
- Steps:
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  sparql query --file ./query.rq --format json
```
- Verify: result set printed to stdout.

### Search via the Action API
- What you get: entity search results by label.
- Steps:
```sh
wiki --network --user-agent "MyApp/1.0 (https://example.org/contact)" \
  action search --query "New York" --language en --limit 5
```
- Verify: results include matches with ids and labels.

### Use an encrypted token for requests
- What you get: authenticated requests using `Authorization: Bearer ...`.
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
- Custom env var names:
```sh
export MY_WIKI_TOKEN="your-token"
export MY_WIKI_PASSPHRASE="your-passphrase"
wiki auth login --token-env MY_WIKI_TOKEN --passphrase-env MY_WIKI_PASSPHRASE
```
- Verify: request succeeds; token is stored in `~/.config/wiki-cli/credentials.json`.

### Set a default User-Agent
- What you get: a persistent User-Agent without repeating flags.
- Steps:
```sh
wiki config set user-agent "MyApp/1.0 (https://example.org/contact)"
wiki --network entity get Q42
```
- Verify: requests succeed without `--user-agent`.

### Preview a request without sending it
- What you get: method, URL, and headers with tokens redacted.
- Steps:
```sh
wiki --print-request --user-agent "MyApp/1.0 (https://example.org/contact)" entity get Q42
```
- Verify: output includes a preview and no network call is made.

### Check local setup
- What you get: a quick view of config state without making requests.
- Steps:
```sh
wiki doctor
```
- Verify: output reports User-Agent and token presence.

## Risks and assumptions
- Network access is required for API calls; the CLI defaults to no-network and must be explicitly enabled.
- Wikimedia APIs require a descriptive User-Agent; missing or empty values will block requests.
- Auth tokens are stored encrypted on disk; protect the passphrase and avoid sharing logs with sensitive data.
- Results are read-only snapshots; the CLI does not mutate Wikidata but responses can still contain sensitive data.
- Output files are overwritten if the path already exists; choose paths carefully.

## Troubleshooting
### Symptom: "User-Agent is required"
Cause: Wikimedia APIs require a descriptive User-Agent.
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

### Symptom: 429 or rate-limit errors
Cause: API throttling.
Fix: retry after a short delay or lower request frequency.

## Reference
- Docs index: `docs/README.md`.
- Getting started: `docs/GETTING_STARTED.md`.
- Usage reference: `docs/USAGE.md`.
- Configuration: `docs/CONFIG.md`.
- Troubleshooting: `docs/TROUBLESHOOTING.md`.
- FAQ: `docs/FAQ.md`.
- Changelog: `CHANGELOG.md` (Keep a Changelog).
- License: `LICENSE` (MIT).
- Brand guidelines: `docs/BRAND.md`.
- Commands:
  - `wiki help [command]`
  - `wiki entity get|statements <id>`
  - `wiki sparql query --file <query.rq>`
  - `wiki action search --query <text>`
  - `wiki raw request <method> <path>`
- `wiki auth login|status|logout`
- `wiki config get|set|path`
- `wiki doctor`
- `wiki completion`

---

<img
  src="./brand/brand-mark.webp"
  srcset="./brand/brand-mark.webp 1x, ./brand/brand-mark@2x.webp 2x"
  alt="brAInwav"
  height="28"
  align="left"
/>

<br clear="left" />

**brAInwav**  
_from demo to duty_
