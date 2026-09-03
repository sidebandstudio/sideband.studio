# Pull Requests

How changes land in this repo. Applies to founders, contributors, and coding agents alike.

## Branches

- Branch off `dev` and open the PR against `dev`. It is the default and only working branch.
- Push the branch to this repository, never to a fork. Everyone who contributes has write access, and PRs opened from forks are closed automatically (`.github/workflows/no-fork-prs.yml`). Fork PRs also get no CI, no Claude review, and cannot merge.
- Name branches `type/short-slug`, matching existing history: `feat/engineer-dossiers`, `fix/merge-regressions`, `docs/pr-guidelines`.
- Types in use: `feat`, `fix`, `content`, `chore`, `docs`, `ci` (workflows and repo automation).
- Rebase on the latest `dev` before opening the PR, and again before merge if `dev` has moved.

## Screenshots

Visual changes need screenshots on the PR. The `pr-screenshots` workflow handles this automatically: on every push to a PR it builds the site, captures the standard landing set, commits the images to the `pr-assets` branch, and posts (or updates) a sticky comment on the PR. No manual steps.

For ad-hoc captures, run the site locally and use `npm run shots` (`BASE_URL` and `OUT_DIR` env vars override the defaults). Embed images with `https://github.com/<owner>/<repo>/raw/<ref>/<path>` (the form `scripts/pr-screenshot.sh` prints) so the link pins a commit and keeps rendering after later pushes.

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
npm run build              # must pass (see AGENT_NOTES.md)
npm run lint
npm run check:consistency  # counts in prose match lib/ data
npm run check:copy         # no em dashes or semicolons in user-facing copy
npx playwright test        # smoke tests in tests/
```

CI runs these same checks (plus `npx tsc --noEmit` and `prettier --check`) on every PR and must be green before merge.

Then sweep for what your change makes stale:

- Site copy states facts in more than one place: founder count, product count, roles, locations. Facts live in `app/` pages, `components/`, `lib/` data, and `content/` docs. If your change alters a fact, grep for the old value and update every hit. Example: adding a third founder means searching for `two-person`, `two founders`, and `both founders`, not just editing the pages you already had open. Founder and product counts are enforced by `npm run check:consistency` (see AGENT_NOTES.md → Single Source of Truth); it will fail CI if the prose drifts from the data.
- New pages, products, or engineer entries get coverage in `tests/smoke.spec.ts`.
- Images: sized for the web, EXIF stripped, and any dimensions recorded in `lib/` data match the actual file.

## Screenshots For Visual Changes

If a visitor could see the difference, the PR shows it. The `pr-screenshots` workflow covers the standard landing set automatically (see Screenshots above). For pages that set does not cover, capture the affected page yourself: run the site locally, take the screenshot, publish it with `scripts/pr-screenshot.sh <image> <pr-number>`, and paste the markdown it prints into "Proof It Works". For edits to existing UI, include before and after.

Screenshots must render inline in the PR body or comment, never sit behind a bare link. Use same-origin URLs of the form `https://github.com/<owner>/<repo>/raw/<ref>/<path>` (drag-and-drop in the browser also works). A preview link or "verified locally" does not count. The reviewer judges the change from the description without checking out the branch.

Not needed for changes with no visual effect: CI, docs, tests, scripts, data-only edits that do not change rendered output.

A bot leaves a reminder on PRs that touch UI files without an image attached. It is a nudge, not a gate. The reviewer decides whether the PR is reviewable without one.

## Copy Style

User-facing copy never uses em dashes or semicolons. Rephrase with a comma, a colon, a period, or a new sentence. Date ranges keep the en dash. HTML entities (`&middot;`, `&rarr;`) and the acronym TL;DR are fine.

`npm run check:copy` enforces this in CI. It scans string literals, template text, and JSX text in `app/`, `components/`, `lib/`, and `tests/`, plus prose in `content/`. Code and code comments are exempt, so an em dash in a JSDoc comment is fine.

## Review And Merge

- CODEOWNERS requires @whoisaldo approval on every PR.
- Address every review comment before merge: push the fix or reply with why not. Never resolve a thread silently.
- Merge with a merge commit (the repo's existing style). Delete the branch after merge.
- Approval arms auto-merge (`.github/workflows/auto-merge.yml`): the PR lands on `dev` as soon as CI is green. `dev` deploys to production, so do not approve anything you would not ship.
