# CLAUDE.md

Project instructions for Claude Code sessions in this repo.

- Read `AGENT_NOTES.md` before making changes. It records deployment and structure decisions that must be preserved.
- Follow `PR.md` for branches, commits, and pull requests. Never add `Co-authored-by: Claude` trailers, "Generated with" lines, or session links to commits or PR bodies. If one slips in, amend the commit before pushing.
- All work branches off `dev` and lands via PR into `dev`.
- UI change means screenshot: if the change is visible on the site, take a screenshot of the result from the local dev server and attach it in the PR body under "Proof It Works" (before/after for existing UI). Standard practice, not optional, unless the change has no rendered effect. See `PR.md`.
- Never fork this repo or open a PR from a fork. Push branches to `origin` (this repository) and open the PR from there. Fork PRs are closed automatically.
- No em dashes and no semicolons in user-facing copy. Rephrase instead. `npm run check:copy` enforces this in CI.
- Screenshots must render inline in the PR body or comment. Publish with `scripts/pr-screenshot.sh` and paste the markdown it prints, or drag the image in. Bare links do not count. The `pr-screenshots` workflow auto-covers the landing set.
