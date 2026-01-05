# Report security issues in the brAInwav Wikidata CLI

This policy explains how to report security issues responsibly.
It is short by design. It focuses on reporting, not support.
If you are unsure, report privately.

Last updated: 2026-01-04

## Table of contents
- [Document requirements](#document-requirements)
- [Summary](#summary)
- [Reporting a vulnerability](#reporting-a-vulnerability)
- [Quick rules](#quick-rules)
- [What not to share](#what-not-to-share)
- [What happens next](#what-happens-next)
- [What to include](#what-to-include)
- [Risks and assumptions](#risks-and-assumptions)
- [Reference](#reference)

## Document requirements
- Audience: security researchers and users reporting vulnerabilities.
- Scope: reporting process and required information.
- Non-scope: support requests or public disclosure timelines.
- Owner: repository maintainers.
- Review cadence: every release or at least quarterly.
- Required approvals: maintainers for public changes.

## Summary
Report issues in private.
Use the advisory tool or email.
Keep steps short and clear.
Remove secrets from samples.
Wait for a reply before sharing details.
Do not use public issues.
Keep the subject line short.
Avoid long reports.

## Reporting a vulnerability
- Use GitHub Security Advisories for this repository or email <jscraik@brainwav.io>.
- Do not open public issues for security reports.
Include only the minimum data needed. Remove secrets and personal data.

## Quick rules
Report privately.
Keep the report short.
Include steps that reproduce the issue.
Remove all secrets.
Wait for a response before sharing details.
Use a clear subject line.
List the impact in one sentence.

## What not to share
- Do not share access tokens.
- Do not share private keys.
- Do not share personal data.
When in doubt, redact more.

## What happens next
Maintainers will acknowledge the report.
They may ask for more detail.
Do not publish details until asked.

## What to include
1. Minimal reproduction steps.
2. CLI version, Node.js version, and OS.
3. Impact description and any known mitigation.
4. Sample data with secrets removed or redacted.

## Risks and assumptions
- Advisory access depends on repository settings and account permissions.
- Reporters must avoid sharing secrets or personal data in plain text.
If you are unsure, ask before sending sensitive details.

## Reference
- Dependency scanning: run `npm audit` and review `npm audit --json` output.
- Security scanning: `npm run semgrep` and `npm run gitleaks`.
