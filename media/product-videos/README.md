# Product videos

Every product has a short silent video in two cuts, made with
[HyperFrames](https://hyperframes.heygen.com) from the product's real
screenshots and captures. This folder keeps the source of each one so it can be
changed and rendered again. The site plays the encoded files in
`public/assets/products/<id>/video/` (see `components/products/ProductVideo.tsx`
and each product's `video` in `lib/products.ts`).

Each `<id>/` is a HyperFrames project: `index.html` is the hero cut, `card/index.html`
the card cut (its `assets` is a link to `../assets`), and `assets/` holds only the
images, captures, font and GSAP build the compositions reference. Renders,
encodes and review frames are not kept here.

## The two cuts

| Cut  | Size              | Length                     | Encoded files and budgets                                            |
| ---- | ----------------- | -------------------------- | -------------------------------------------------------------------- |
| hero | 1920x1200 (16:10) | 10 to 12 s, seamless loop  | `<id>-hero.mp4` ≤ 2.5 MB, `<id>-hero.webm` ≤ 1.5 MB, `-hero-poster.webp` |
| card | 1440x1080 (4:3)   | 6 to 8 s, seamless loop    | `<id>-card.mp4` ≤ 1.2 MB, `<id>-card.webm` ≤ 0.8 MB, `-card-poster.webp` |

Both run at 30 fps with no audio stream. The hero's centre 4:3 must carry the
story alone, since phones crop it to 4:3. The card shows one beat with the UI
large and at most one caption, legible on a 360px wide card. Only real product
imagery, captions only in the product's own wording, no end card, and no credit
burned in: a credit goes on the cut in `lib/products.ts` and the site shows it
under the video.

## Render and encode

Run from a copy of the project outside the repo (the CLI writes `.hyperframes/`
and `renders/`). Node and FFmpeg are required.

```bash
cp -R media/product-videos/<id> /tmp/<id> && cd /tmp/<id>
npx --yes hyperframes@0.8.208 check --strict           # hero
npx --yes hyperframes@0.8.208 render -o renders/hero.mp4
(cd card && npx --yes hyperframes@0.8.208 check --strict && npx --yes hyperframes@0.8.208 render -o ../renders/card.mp4)
```

Encode each master render to the site's files, at the lowest CRF that fits the
budget, with one keyframe interval for the whole loop (`n` is its frame count):

```bash
mkdir -p out
ffmpeg -i renders/hero.mp4 -an -c:v libx264 -profile:v high -preset slower -tune animation \
  -crf 18 -pix_fmt yuv420p -g $n -movflags +faststart out/<id>-hero.mp4
ffmpeg -i renders/hero.mp4 -an -c:v libvpx-vp9 -crf 32 -b:v 0 -pix_fmt yuv420p -g $n \
  -row-mt 1 -deadline good -cpu-used 2 -auto-alt-ref 1 -lag-in-frames 25 out/<id>-hero.webm
ffmpeg -ss <seconds> -i renders/hero.mp4 -frames:v 1 -c:v libwebp -quality 82 out/<id>-hero-poster.webp
```

Raise the CRF until each file fits its budget, then compare frames against the
master. Repeat for the card. The poster is the cut's most explanatory frame.

## Bring them into the site

```bash
npm run sync:videos -- <folder holding <id>/out/ for every product>
```

`scripts/sync-product-videos.mjs` checks each file with ffprobe (one video
stream, no audio, the cut's size and codec), copies the six files per product
into `public/assets/products/<id>/video/`, rewrites each cut's duration in
`lib/products.ts`, and replaces `media/product-videos/<id>/` with the project's
sources. It prints every file against its budget and fails on a wrong file.
