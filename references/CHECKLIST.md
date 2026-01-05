# Documentation QA Checklist

Use this checklist to validate documentation updates before release.
Keep items short and direct. Mark each item as you review the doc.
If an item is not applicable, note the reason.

## Structure and clarity
Start with the structure. Make it easy to scan.
- [ ] The title explains the document purpose.
- [ ] The audience and scope are explicit.
- [ ] The table of contents matches the headings.
- [ ] Sections start with clear topic sentences.
- [ ] Steps include expected outcomes or verification.

## Accuracy and completeness
Verify facts against the repo.
- [ ] Commands, flags, and file paths match the repository.
- [ ] Examples use safe placeholders and avoid secrets.
- [ ] Risks and assumptions are documented when operational steps exist.
- [ ] Troubleshooting covers the top failure modes.
- [ ] Links and references point to real files.

## Accessibility and inclusive language
Use clear and inclusive language.
- [ ] Link text is descriptive.
- [ ] Headings use a consistent hierarchy.
- [ ] Instructions do not rely on color alone.
- [ ] Language is clear and inclusive.

## Security and privacy
Protect sensitive data.
- [ ] No secrets, tokens, or internal endpoints are exposed.
- [ ] Sensitive data handling is called out when relevant.
- [ ] Destructive actions include warnings and recovery steps.

## Maintenance
Keep docs current and owned.
- [ ] "Last updated" is current.
- [ ] Owner and review cadence are listed.
- [ ] Open questions are captured.
