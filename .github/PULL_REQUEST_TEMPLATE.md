## What & Why

<!-- 2-3 sentences. What changed, why it changed. -->

## Proof It Works

<!--
Anything a visitor can see (pages, components, styles, images, copy layout) gets a
screenshot of the result from your local dev server (`npm run dev`), taken after the
change. Before/after for edits to existing UI. Drag the image into this box.
This is the standard for UI PRs; the reviewer should not have to run the branch to see it.
Not needed for CI, docs, tests, or pure data/config changes.
-->

**Screenshot:**

## Tested

<!-- Commands run, pages clicked. -->

## Checklist

- [ ] `npm run build`, `npm run lint`, `npm run check:consistency`, and `npx playwright test` pass locally
- [ ] Grepped for copy and data this change makes stale elsewhere (see PR.md); founder/product counts match `lib/` data
- [ ] New pages or entries covered in `tests/smoke.spec.ts`
- [ ] Images web-sized and EXIF-stripped; dimensions in `lib/` data match the files
- [ ] Rebased on latest `dev`
- [ ] No AI co-author trailers ("Co-authored-by: Claude"), "Generated with" lines, or session links in commits or this description
