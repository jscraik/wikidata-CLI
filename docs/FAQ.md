# brAInwav wiKi CLI FAQ

Short answers to common questions.

Last updated: 2026-01-04

## Table of contents
- [Document requirements](#document-requirements)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Document requirements
- Audience: developers looking for quick answers.
- Scope: high-level questions about CLI behavior.
- Non-scope: step-by-step command guides or deep troubleshooting.
- Owner: repository maintainers.
- Review cadence: every release or at least quarterly.
- Required approvals: maintainers for public changes.

## FAQ
### Does this CLI write to Wikidata?
No. All commands are read-only.

### How do I pass a User-Agent?
Use `--user-agent` or set `WIKI_USER_AGENT`.

### Can I use a token?
Yes. Store it with  `wiki auth login` and pass `--auth`. For non-interactive use,
set `WIKI_TOKEN` and `WIKI_PASSPHRASE` (or use `--token-env` and `--passphrase-env`).

### Can I set defaults for User-Agent or endpoints?
Yes. Use  `wiki config set user-agent|api-url|action-url|sparql-url` to persist values.

### Does this work with other Wikibase instances?
Yes. Provide `--api-url`, `--action-url`, and `--sparql-url`.

### Where are tokens stored?
In `~/.config/wiki-cli/credentials.json`, encrypted with AES-256-GCM and scrypt.

## Troubleshooting
### Symptom: 401 or 403
Cause: missing or invalid token.
Fix: re-run  `wiki auth login` and confirm the token.

## Reference
- Usage: `docs/USAGE.md`.
- Config: `docs/CONFIG.md`.
- Start here: `docs/GETTING_STARTED.md`.
