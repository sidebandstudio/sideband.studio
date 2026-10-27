# HyperFrames Composition Project

This folder is a [HyperFrames](https://hyperframes.heygen.com) video: HTML, CSS and seekable
animations (GSAP by default) that the `hyperframes` CLI previews in the browser and renders to
MP4.

## Skills — read these first

**Invoke the relevant skill before writing or modifying compositions.** Skills encode framework-specific patterns (e.g., `window.__timelines` registration, `data-*` attribute semantics, shader-compatible CSS rules) that generic web docs don't cover, so compositions written without them break.

**Doing anything with HyperFrames?** Start at `/hyperframes`. Make any video by asking for it; the `/hyperframes` skill carries the contract and the references (each kind of film, story, motion, look, sound, review, captions, overlays). Read it first, especially when there's no project context to orient you.

- `/hyperframes` — read first for any request to make, edit, animate or render a video, motion graphic, captions or overlays. Holds the render contract and the work loop.
- `/hyperframes-cli` — the CLI by job: scaffold, check, look at frames, edit the timeline, preview, render, publish, project history.
- `/hyperframes-registry` — ready-made blocks and components installed as editable source. Search it before hand-building any named visual.
- `/media-use` — get or make any media (music, sound effects, images, voiceover, avatar and generated video, transcripts, cutouts, colour grades) and mix placed audio.
- `/figma` — bring a Figma design, frame, logo or brand into a video.
- `/slideshow` — a presentation or pitch deck. Output is a navigable deck, not a rendered MP4.
- `/remotion-to-hyperframes` — bring existing video code or footage into HyperFrames (Remotion first; also Motion Canvas, Lottie, Three.js, canvas, or renders from other tools) and verify it frame by frame against the original.

**Changing how real footage or images look or reveal?** Load `/media-use` and read its `references/media-treatments.md` before editing, even when the request only says dark, flat, boring, retro, private, or “make the reveal cooler.” It governs how footage is treated, never whether media may be used. Use canonical media treatments and seek-safe motion; do not improvise equivalent CSS/SVG filters or overlays.

> **Tailwind v4 projects** (`hyperframes init --tailwind`): see `hyperframes-cli/references/init-and-scaffold.md` (Tailwind).

> **Using a HyperFrames plugin?** Load skills from that installed bundle and follow
> its `hyperframes/references/plugin-installation.md` execution rules. Update via
> the plugin manager, not the standalone commands below.
>
> **Standalone skill missing or stale?** Run `npx hyperframes skills update <name>` to install/refresh
> the specific skill you need, or bare `npx hyperframes skills update` to refresh the core set plus
> everything already installed — neither pulls the full set. Restart the agent session so
> newly installed skills load.

## Commands

```bash
npm run dev          # human-operated foreground preview (blocks until stopped)
npx hyperframes preview --background  # agent-safe persistent Studio preview
npx hyperframes preview --status      # verify the persistent preview is listening
npx hyperframes preview --stop        # stop it when review is finished
npm run check        # lint + runtime + layout + motion + contrast (one command)
npx hyperframes snapshot --at 1,3,5  # PNG frames at those seconds, to look at before rendering
npm run render       # render to MP4
npm run publish      # publish and get a shareable link
npx hyperframes lint --verbose  # include info-level findings
npx hyperframes lint --json     # machine-readable output for CI
npx hyperframes docs <topic> # reference docs in terminal
```

> **Agents must use `npx hyperframes preview --background` for Studio handoff.** Do not rely
> on a shell/tool `run_in_background` wrapper around `npm run dev`: that foreground process
> remains owned by the invoking session and can disappear while the browser stays open,
> leaving refreshes at `ERR_CONNECTION_TIMED_OUT`. Verify with `preview --status`, keep it
> alive through review, and stop it explicitly with `preview --stop` afterward.

> **Back from the desktop app.** Once this project was opened in the HyperFrames desktop app, run `npx hyperframes catch-up` before your next change here: it lists what the person asked Framey in the app and which files changed since.

> **Pinned CLI version.** These scripts pin an exact `hyperframes@X.Y.Z` so this project re-renders identically over time. Weeks later that pin lags fixes shipped since. To move up: `npx hyperframes@latest upgrade --project . --check` (shows the delta), then `npx hyperframes@latest upgrade --project .` to rewrite the pins. Always unpinned — the pinned script re-runs the old version against itself.

## Documentation

**For quick reference**, use the local CLI docs command (no network required):

```bash
npx hyperframes docs <topic>
```

Topics: `data-attributes`, `gsap`, `compositions`, `rendering`, `examples`, `troubleshooting`

**For full documentation**, discover pages via the machine-readable index — do NOT guess URLs:

```
https://hyperframes.heygen.com/llms.txt
```

## Project Structure

- `index.html` — main composition (root timeline)
- `compositions/` — sub-compositions referenced via `data-composition-src`
- `meta.json` — project metadata (id, name)
- `transcript.json` — whisper word-level transcript (if generated)

## Linting — ALWAYS RUN AFTER CHANGES

After creating or editing any `.html` composition, **always** run the full check before considering the task complete:

```bash
npm run check
```

Fix all errors before presenting the result. Warnings should be reviewed before rendering.

Then look at what you changed: `npx hyperframes snapshot --at <seconds>` (or `--range START,END`, `--composition <id>`) at the moments you edited, and read the frames before you reply. A passing check does not show how it looks.

## Key Rules

1. Every timed element needs `data-start` and a duration. `data-start` is what marks it as timed; `data-track-index` is an optional Studio display lane the render never reads
2. Give timed visual elements `class="clip"`. The framework keys visibility off `data-start`, not the class, but the shared `.clip` CSS is what gives a scene its full-frame box, and `lint` warns without it
3. Register one paused root timeline per composition on `window.__timelines`:
   ```js
   window.__timelines = window.__timelines || {};
   window.__timelines["composition-id"] = gsap.timeline({ paused: true });
   ```
   Scene timelines manually added to this root must not be paused. A paused
   child does not advance when the root is seeked. The runtime activates
   registered composition siblings, not arbitrary nested scene timelines.
4. A video with sound keeps it on the `<video>` (`data-has-audio="true"`, no `muted`). Use a separate `<audio>` for music, voiceover, replacement audio, J/L cuts, or audio detached in Studio. Silent footage and b-roll: `muted`.
5. Sub-compositions use `data-composition-src="compositions/file.html"` to reference other HTML files
6. Only deterministic logic — no `Date.now()`, no `Math.random()`, no network fetches

## Reference notes (EternalMonitor, the approved pilot)

This project is the reference for the Sideband product videos (`briefs/VIDEO_SPEC.md`). Copy these parts rather than reinventing them.

**Files.** `index.html` is the hero (1920x1200, 12 s). `card/index.html` is the card (1440x1080, 7 s), its own project so `check` can audit it (`card/assets` is a symlink to `../assets`). Masters go in `renders/` (`master.mp4` for the hero, `card-master.mp4` for the card), deliverables in `out/`, and review frames in `review/`. GSAP and Hanken Grotesk are vendored in `assets/` so renders need no network.

**Ground and light.** `#root` is `#0b0b0d`. `#light` is two radial gradients: white 4.5% from above, black 50% floor shade. No grain, no glow, no other hue. The product accent is used only for the click ring (and is already in the screenshots).

**Captions.** Hanken Grotesk 500, `letter-spacing: -0.035em`, `line-height: 1`, ink `#f3f2ef`, centred. They sit outside `#camera`, so camera moves never move text. Hero: 80px at `top: 112px`, one per beat, in with `fromTo y 24 to 0, opacity 0 to 1, 0.72s expo.out`, out with `y -12, opacity 0, 0.32s power2.in`. Card: one caption at 88px, `top: 66px`, on screen for the whole loop. Its cap height is 61px, 15.25 CSS px on a 360px card (the spec's minimum is 14). Measure yours, do not assume.

**Device frames.** Size every screen to its screenshot's exact aspect, so the image fills it with no crop or stretch.
- PC monitor: body `#1b1b1f`, `border-radius: 20px`, `padding: 16px`, `inset 0 1px 0 rgba(255,255,255,.06)` top edge plus the float shadow `0 40px 80px -40px rgba(0,0,0,.8)`. Screen `border-radius: 8px`. Neck is a `#141417` to `#1d1d21` gradient, base `#25252a` with a 7px radius.
- iPad: body `#1b1b1f`, radius 40 to 42px, `padding: 22px`, a `1.5px` inset edge at white 7%, shadow `0 50px 90px -30px rgba(0,0,0,.9)`. Screen radius 18 to 20px on black. A desktop picture shown on it is letterboxed (the app's own Fit look).
- Overlap the tablet in front of the monitor's lower right instead of a side-by-side diagram. Keep the important UI (here the sidebar and header) clear of the overlap.
- Portrait to landscape: `#ipad` carries the translate and opacity, the inner `#ipad-turn` carries only the rotation (marked `data-layout-allow-orbit`), and portrait content sits inside at `rotate(90deg)`.

**Accents (motion graphics).** Touch dot: 44px (card 50px), white 42% with a 2px white 70% edge, plus a ripple ring. The lime click ring (`3px` accent, 60 or 68px) answers on the PC at the same item. `tap()` in either file has the timings: in 0.22s, press at +0.24, ripple at +0.32, click at +0.38, PC page at +0.40, tablet page at +0.50, so the PC visibly leads. Page changes are 0.1s crossfades between two real screenshots. Ring and ripple `fromTo` tweens need `immediateRender: false`, or they show at frame 0.

**Camera.** One `#camera` wrapper, `scale`, `x` and `y` only, with authored constants (no layout reads). Moves use `power3.inOut` over 0.95 to 1.2s, holds a slow `sine.inOut` drift. Device entrances use `expo.out`, exits `power2.in`, slides between positions `power2.inOut`. Hero pushes stay at or under 1.22x, and every device top stays below the caption band. Mark an intentional crop off-canvas with `data-layout-allow-overflow`. The hero's centre 1600x1200 (4:3) must hold the story in every beat.

**Loop technique.** Author the rest state with `gsap.set(...)` before the timeline (not `tl.set` at 0, which lint flags). Return every channel to it by the end. Reset hidden parts with `tl.set` only while they are invisible. Hold 0.15 to 0.25s at both ends, and ease into and out of the seam with zero velocity. The card loops by state (Stream, tap to Performance, tap back to Stream) with a `sine.inOut` breath (scale 1 to 1.025 to 1). Verify: `npx hyperframes snapshot --at 0,<duration - 1/30> --no-end`, then a difference of the two PNGs must give `YMAX=0`. The encoded files then differ only by keyframe noise (about 40 dB), which is expected.

**Honest imagery.** Use only real screenshots. The same image goes on both screens only when the product genuinely shows the same picture (mirroring). Give a duplicated image its own file name (`*-mirror.webp`) to avoid `duplicate_media_discovery_risk`. `host-performance-padded.webp` is the real Performance capture extended 138px at the bottom with the app's own sampled background colours, so it matches the Stream page's window height. Extend only empty background like that, never UI.

**Render and encode.** Run `npx hyperframes check --strict` (from `card/` for the card), then render the master with `npx hyperframes render --fps 30 --crf 8 --output renders/<name>.mp4`. Encode from the master:

```bash
# H.264 two-pass: hero -b:v 1640k (2.46 MB at 12 s), card -b:v 1300k (1.12 MB at 7 s)
ffmpeg -i M -an -c:v libx264 -preset veryslow -b:v 1640k -pass 1 -pix_fmt yuv420p -profile:v high -f mp4 /dev/null
ffmpeg -i M -an -c:v libx264 -preset veryslow -b:v 1640k -pass 2 -pix_fmt yuv420p -profile:v high -movflags +faststart out.mp4
# VP9 two-pass constant quality: hero -crf 36 (1.48 MB), card -crf 34 (0.77 MB)
ffmpeg -i M -an -c:v libvpx-vp9 -b:v 0 -crf 36 -pix_fmt yuv420p -row-mt 1 -tile-columns 2 -deadline good -cpu-used 1 -pass 1 -f webm /dev/null
ffmpeg -i M -an -c:v libvpx-vp9 -b:v 0 -crf 36 -pix_fmt yuv420p -row-mt 1 -tile-columns 2 -deadline good -cpu-used 1 -auto-alt-ref 1 -lag-in-frames 25 -pass 2 out.webm
```

Scale the bitrate to your duration: budget bytes x 8 / seconds, minus about 5%. Compare frames against the master by extracting the same frame index from both (`-vf "select=eq(n\,N)" -fps_mode passthrough`) and running `psnr` on the PNGs. Run directly on a WebM, the `psnr` filter pairs the wrong frames and reports false dips. Here every sampled frame was 41 dB or better. Posters: snapshot the chosen moment as PNG, then `cwebp -q 88 -m 6`.
