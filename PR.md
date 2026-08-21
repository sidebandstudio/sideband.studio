# Pull Requests

How changes land in this repo. Applies to founders, contributors, and coding agents alike.

## Branches

- Branch off `dev` and open the PR against `dev`. It is the default and only working branch.
- Name branches `type/short-slug`, matching existing history: `feat/engineer-dossiers`, `fix/merge-regressions`, `docs/pr-guidelines`.
- Types in use: `feat`, `fix`, `content`, `chore`, `docs`.
- Rebase on the latest `dev` before opening the PR, and again before merge if `dev` has moved.

## Commits

Format: `type: plain description of the change`.

The type prefix comes from the same set as branch types. The description is a readable sentence fragment, not shorthand. Someone scanning `git log --oneline` should understand what happened without opening the diff.

Good, from this repo's history:

- `feat: link EternalRichPresence to eternalrichpresence.dev`
- `chore: add CODEOWNERS requiring owner review`

Avoid:

- `fix: fix bug` (says nothing)
- `updated files` (no type, no content)

One logical change per commit. If the description needs "and" twice, split the commit.

Using Claude or other AI tools to write code is fine. Listing them as contributors is not. Never include `Co-authored-by: Claude <noreply@anthropic.com>` (or any AI co-author trailer), "Generated with" lines, or session links in commit messages or PR descriptions. Git history credits people only. If a tool adds a trailer on its own, amend the commit before pushing.

## PR Description

Every PR description answers three things:

1. What changed and why. Two or three sentences, plain language.
2. Proof it works. This is a design-heavy site: anything visual gets a screenshot or short recording, before/after when changing existing UI.
3. What you tested. Commands run, pages clicked. "Build passes, clicked through /engineers at mobile width" beats "tested".

If you knowingly left something out of scope, say so in the description instead of letting review discover it.

## Before Requesting Review

Run and pass locally:

```bash
npm run build        # must pass (see AGENT_NOTES.md)
npm run lint
npx playwright test  # smoke tests in tests/
```

CI runs these same checks (plus `npx tsc --noEmit` and `prettier --check`) on every PR and must be green before merge.

Then sweep for what your change makes stale:

- Site copy states facts in more than one place: founder count, product count, roles, locations. Facts live in `app/` pages, `components/`, `lib/` data, and `content/` docs. If your change alters a fact, grep for the old value and update every hit. Example: adding a third founder means searching for `two-person`, `two founders`, and `both founders`, not just editing the pages you already had open.
- New pages, products, or engineer entries get coverage in `tests/smoke.spec.ts`.
- Images: sized for the web, EXIF stripped, and any dimensions recorded in `lib/` data match the actual file.

## Review And Merge

- CODEOWNERS requires @whoisaldo approval on every PR.
- Address every review comment before merge: push the fix or reply with why not. Never resolve a thread silently.
- Merge with a merge commit (the repo's existing style). Delete the branch after merge.
