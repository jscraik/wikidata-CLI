# Develop and release the brAInwav Wikidata CLI

This guide explains how to build, test, scan, and release the CLI.

Last updated: 2026-01-03

## Table of contents
- [Prerequisites](#prerequisites)
- [Quickstart](#quickstart)
- [Common tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Reference](#reference)

## Prerequisites
- Required: Node.js 18+, npm.
- Optional: semgrep and gitleaks installed locally.

## Quickstart
### 1) Install dependencies
```sh
npm install
```

### 2) Run tests
```sh
npm test
```

### 3) Verify
Expected output:
- All tests pass.

## Common tasks
### Build the CLI
- What you get: compiled output in `dist/`.
- Steps:
```sh
npm run build
```
- Verify: `dist/cli.js` exists.

### Run type checks
- What you get: strict type validation.
- Steps:
```sh
npm run lint:types
```
- Verify: no TypeScript errors.

### Run security scans
- What you get: static checks for common issues.
- Steps:
```sh
npm run semgrep
npm run gitleaks
```
- Verify: no findings.

### Cut a release
- What you get: a tagged release ready for npm publishing.
- Steps:
```sh
npm version patch --no-git-tag-version
# update CHANGELOG.md
# git commit -am "Release vX.Y.Z"
# git tag vX.Y.Z
# git push && git push --tags
```
- Verify: tag exists in the remote repository.

## Troubleshooting
### Symptom: npm audit fails on dev dependencies
Cause: transient advisories in tooling.
Fix: update the affected dev dependency and re-run `npm audit`.

### Symptom: gitleaks says "not a git repository"
Cause: running outside a git repo.
Fix: initialize git or run with `--no-git` if appropriate.

## Reference
- Package scripts: `package.json`.
- Changelog: `CHANGELOG.md`.
