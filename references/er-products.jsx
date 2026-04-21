// er-products.jsx — Deep-dive product showcase page

// ── Style injection ────────────────────────────────────────────────────────
if (!window.__erProdStyles) {
  window.__erProdStyles = true;
  const s = document.createElement('style');
  s.textContent = `
    @keyframes deviceFloat   { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))}  50%{transform:translateY(-14px) rotate(var(--r,0deg))} }
    @keyframes deviceFloatB  { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))}  50%{transform:translateY(-10px) rotate(var(--r,0deg))} }
    @keyframes deviceFloatC  { 0%,100%{transform:translateY(-6px) rotate(var(--r,0deg))}  50%{transform:translateY(8px) rotate(var(--r,0deg))} }
    @keyframes glowPulse     { 0%,100%{opacity:.18} 50%{opacity:.32} }
    @keyframes slideRevealL  { from{opacity:0;transform:translateX(-48px)} to{opacity:1;transform:translateX(0)} }
    @keyframes slideRevealR  { from{opacity:0;transform:translateX(48px)}  to{opacity:1;transform:translateX(0)} }
    @keyframes slideRevealU  { from{opacity:0;transform:translateY(32px)}  to{opacity:1;transform:translateY(0)} }

    .prod-section { padding: 128px 0; position: relative; overflow: hidden; }
    .prod-section:nth-child(odd)  { background: var(--black); }
    .prod-section:nth-child(even) { background: var(--surface); }

    .prod-num {
      position: absolute; pointer-events: none;
      font-family: 'Instrument Serif', Georgia, serif;
      font-size: clamp(160px, 22vw, 280px);
      font-weight: 700; line-height: 1;
      opacity: 0.035; color: var(--text);
      top: -16px; user-select: none;
    }

    .prod-problem {
      border-left: 2px solid var(--border);
      padding-left: 16px;
      font-size: 14px; line-height: 1.85;
      color: var(--text-secondary);
      font-style: italic;
    }

    /* Responsive product grid */
    .prod-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
    @media (max-width: 960px) {
      .prod-grid { grid-template-columns: 1fr; gap: 56px; }
      .prod-num  { display: none; }
      .prod-devices-right { order: -1; }
    }

    /* Device shadows + glows */
    .iphone-wrap { filter: drop-shadow(0 30px 60px rgba(0,0,0,.6)); }
    .ipad-wrap   { filter: drop-shadow(0 40px 80px rgba(0,0,0,.65)); }
    .browser-wrap{ filter: drop-shadow(0 24px 56px rgba(0,0,0,.55)); }
  `;
  document.head.appendChild(s);
}

// ── Device frame components ────────────────────────────────────────────────

function IPhoneFrame({ src, alt, width = 230, tilt = 0, animDelay = 0, animClass = 'deviceFloat' }) {
  const h = Math.round(width * 2.167);
  const r  = tilt + 'deg';
  return (
    <div className="iphone-wrap" style={{ '--r': r, animation: `${animClass} ${5 + animDelay * 0.5}s ease-in-out ${animDelay}s infinite`, flexShrink: 0 }}>
      <div style={{
        position: 'relative', width, height: h,
        background: '#0b0b0b', borderRadius: width * 0.155,
        border: `${Math.round(width * 0.032)}px solid #2c2c2c`,
        boxShadow: `inset 0 0 0 1px #3a3a3a`,
        overflow: 'hidden',
      }}>
        {/* Dynamic island */}
        <div style={{
          position: 'absolute', top: width * 0.038, left: '50%', transform: 'translateX(-50%)',
          width: width * 0.37, height: width * 0.108,
          background: '#000', borderRadius: width * 0.054, zIndex: 10,
        }} />
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

function IPadFrame({ src, alt, width = 340 }) {
  const h = Math.round(width * 1.333);
  return (
    <div className="ipad-wrap" style={{ '--r': '0deg', animation: 'deviceFloat 6s ease-in-out infinite', flexShrink: 0 }}>
      <div style={{
        position: 'relative', width, height: h,
        background: '#0b0b0b', borderRadius: width * 0.055,
        border: `${Math.round(width * 0.025)}px solid #2c2c2c`,
        boxShadow: `inset 0 0 0 1px #3a3a3a`,
        overflow: 'hidden',
      }}>
        {/* Home bar */}
        <div style={{
          position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)',
          width: width * 0.28, height: 3, background: '#555', borderRadius: 2, zIndex: 10,
        }} />
        <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </div>
  );
}

function BrowserFrame({ src, alt, url = '', width, style }) {
  return (
    <div className="browser-wrap" style={{ borderRadius: 9, border: '1px solid #2a2a2a', overflow: 'hidden', background: '#0d0d0d', width, flexShrink: 0, ...style }}>
      <div style={{ height: 36, background: '#171717', borderBottom: '1px solid #242424', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.75 }} />
          ))}
        </div>
        <div style={{ flex: 1, background: '#222', borderRadius: 4, height: 20, display: 'flex', alignItems: 'center', padding: '0 9px', fontSize: 10, color: '#4a4a4a', letterSpacing: '0.03em', maxWidth: 260, marginLeft: 6 }}>
          {url}
        </div>
      </div>
      <img src={src} alt={alt} style={{ width: '100%', display: 'block' }} />
    </div>
  );
}

// ── Reveal hook ────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = React.useRef(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// ── Shared text block ──────────────────────────────────────────────────────
function ProductText({ num, name, version, status, problem, solution, tags, github, url, accent, vis, dir = 'left' }) {
  const anim = dir === 'left' ? 'slideRevealL' : 'slideRevealR';
  return (
    <div style={{ animation: vis ? `${anim} 0.8s cubic-bezier(0.16,1,0.3,1) both` : 'none', opacity: vis ? 1 : 0 }}>
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 10, color: accent, letterSpacing: '0.22em', textTransform: 'uppercase' }}>[ {num} ]</span>
        <StatusBadge status={status} />
        {version && <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.06em' }}>{version}</span>}
      </div>

      {/* Name */}
      <h2 className="font-display" style={{ fontSize: 'clamp(36px, 4vw, 54px)', color: 'var(--text)', lineHeight: 1.05, marginBottom: 36, fontWeight: 700 }}>
        {name}
      </h2>

      {/* Problem */}
      <div style={{ marginBottom: 28 }}>
        <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--text-secondary)', display: 'block', marginBottom: 10 }}>THE PROBLEM</span>
        <p className="prod-problem">{problem}</p>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(to right, ${accent}40, transparent)`, margin: '24px 0' }} />

      {/* Solution */}
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.22em', color: accent, display: 'block', marginBottom: 10 }}>THE SOLUTION</span>
        <p style={{ fontSize: 13, lineHeight: 1.9, color: 'var(--text)' }}>{solution}</p>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 28 }}>
        {tags.map(t => <Tag key={t} label={t} color={accent} />)}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {github && <GlowButton href={github} external variant="ghost" color={accent}>GitHub ↗</GlowButton>}
        {url    && <GlowButton href={url}    external variant="filled" color={accent}>Visit ↗</GlowButton>}
        <button
          onClick={() => window.erGoToProduct && window.erGoToProduct(
            num === '01' ? 'eternal-monitor' :
            num === '02' ? 'eternal-rich-presence' :
            num === '03' ? 'exerly' : 'signature-cuts'
          )}
          style={{
            background: 'none', border: '1px solid var(--border)', cursor: 'pointer',
            padding: '10px 20px', fontSize: 12, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: 'var(--text-secondary)',
            transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.color = accent; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
        >
          Deep Dive →
        </button>
      </div>
    </div>
  );
}

// ── 01 EternalMonitor ─────────────────────────────────────────────────────
function EternalMonitorSection() {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="prod-section">
      <span className="prod-num" style={{ right: '3%' }}>01</span>
      <div className="inner">
        <div className="prod-grid">
          <ProductText
            num="01" name="EternalMonitor" version="v0.1.1-mirror"
            status="IN DEVELOPMENT" accent="#A855F7"
            problem="Your second monitor costs $300. Your iPad Pro costs $1000+. Neither talks to Windows natively — you either buy a dongle, pay a subscription, or accept the latency."
            solution="EternalMonitor captures your desktop via DXGI Desktop Duplication, transcodes BGRA→YUV420P, and encodes H.264 in hardware — NVENC, AMF, or QuickSync auto-selected. Streams over fragmented UDP to an iPad client that decodes via VideoToolbox and renders with Metal. Zero-config discovery via mDNS."
            tags={['Rust', 'Swift', 'DXGI', 'VideoToolbox', 'Metal', 'H.264', 'NVENC', 'UDP', 'mDNS']}
            github="https://github.com/whoisaldo/EternalMonitor"
            url="https://eternalmonitor.dev"
            vis={vis} dir="left"
          />

          {/* Devices: iPad + PC overlay */}
          <div className="prod-devices-right" style={{
            position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: 480,
            animation: vis ? 'slideRevealR 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both' : 'none',
            opacity: vis ? 1 : 0,
          }}>
            {/* Glow behind */}
            <div style={{ position: 'absolute', width: 320, height: 320, borderRadius: '50%', background: '#A855F7', opacity: 0.1, filter: 'blur(80px)', animation: 'glowPulse 4s ease-in-out infinite' }} />

            {/* iPad (main) */}
            <div style={{ position: 'relative', zIndex: 2 }}>
              <IPadFrame src="assets/EternalMonitor/EternalMonitorIpadView.png" alt="EternalMonitor on iPad" width={300} />
            </div>

            {/* PC window floating top-right */}
            <div style={{
              position: 'absolute', top: -10, right: -20, width: 210, zIndex: 3,
              '--r': '2deg', animation: 'deviceFloatB 7s ease-in-out 0.8s infinite',
            }}>
              <BrowserFrame src="assets/EternalMonitor/EternalMonitorPCView.png" alt="EternalMonitor PC app" url="EternalMonitor Host v0.1.1" />
            </div>

            {/* Tech label bottom */}
            <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>iPad × Windows · Rust + Swift</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 02 EternalRichPresence ────────────────────────────────────────────────
function RichPresenceSection() {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="prod-section">
      <span className="prod-num" style={{ left: '3%' }}>02</span>
      <div className="inner">
        <div className="prod-grid">
          {/* Devices LEFT */}
          <div style={{
            position: 'relative', display: 'flex', flexDirection: 'column', gap: 16,
            alignItems: 'flex-start',
            animation: vis ? 'slideRevealL 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both' : 'none',
            opacity: vis ? 1 : 0,
          }}>
            <div style={{ position: 'absolute', width: 280, height: 280, borderRadius: '50%', background: '#6366F1', opacity: 0.1, filter: 'blur(70px)', top: '20%', left: '10%', animation: 'glowPulse 5s ease-in-out infinite' }} />

            {/* Discord view in browser */}
            <div style={{ width: '100%', maxWidth: 440, '--r': '0deg', animation: 'deviceFloat 6s ease-in-out infinite', position: 'relative', zIndex: 2 }}>
              <BrowserFrame
                src="assets/EternalRichPresence/EternalRichPresence(DiscordProfileView).png"
                alt="Discord Rich Presence view"
                url="discord.com/channels/@me"
              />
            </div>

            {/* Terminal below */}
            <div style={{ width: '100%', maxWidth: 440, '--r': '0deg', animation: 'deviceFloatC 7s ease-in-out 1s infinite', position: 'relative', zIndex: 2 }}>
              <div style={{ borderRadius: 8, border: '1px solid #2a2a2a', overflow: 'hidden', background: '#0d0d0d' }}>
                <div style={{ height: 30, background: '#151515', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px' }}>
                  {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => (
                    <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.75 }} />
                  ))}
                  <span style={{ fontSize: 10, color: '#444', marginLeft: 8, letterSpacing: '0.06em' }}>eternalrp — terminal</span>
                </div>
                <img src="assets/EternalRichPresence/EternalRichPresenceTerminal.png" alt="EternalRichPresence terminal" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>

            <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Windows SMTC → Discord · Python + PyInstaller</span>
          </div>

          {/* Text RIGHT */}
          <ProductText
            num="02" name="EternalRichPresence" version="v1.0.0-beta"
            status="LIVE" accent="#6366F1"
            problem="Apple Music runs on Windows. Spotify too. But Discord sees nothing — your Rich Presence is blank, your listening activity invisible, and there's no official bridge."
            solution="A lightweight Python daemon that reads the Windows System Media Transport Controls (SMTC) and bridges it to Discord Rich Presence. Live album art via upload, custom eternalrp:// URI scheme for Listen Along deep-links. Ships as a portable .exe — no install, no friction."
            tags={['Python', 'pywin32', 'pypresence', 'COM/SMTC', 'Discord API', 'PyInstaller']}
            github="https://github.com/whoisaldo/Eternal-Rich-Presence"
            url={null}
            vis={vis} dir="right"
          />
        </div>
      </div>
    </section>
  );
}

// ── 03 Exerly Fitness ─────────────────────────────────────────────────────
function ExerlyPhoneFan({ vis }) {
  const [hovered, setHovered] = React.useState(null);

  const phones = [
    { key: 'left',   src: 'assets/ExerlyFitness/ExerlyFitnessPhoneView3.png', label: 'Progress',  tilt: -9,  yOff: 28, w: 185, zBase: 1, delay: 0.3 },
    { key: 'center', src: 'assets/ExerlyFitness/ExerlyFitnessPhoneView1.png', label: 'Dashboard', tilt: 0,   yOff: 0,  w: 210, zBase: 3, delay: 0   },
    { key: 'right',  src: 'assets/ExerlyFitness/ExerlyFitnessPhoneView2.png', label: 'AI Coach',  tilt: 9,   yOff: 28, w: 185, zBase: 2, delay: 0.6 },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', position: 'relative' }}>
      {phones.map((p, idx) => {
        const isHov  = hovered === p.key;
        const isDim  = hovered && hovered !== p.key;
        const margin = idx === 0 ? { marginRight: -52 } : idx === 2 ? { marginLeft: -52 } : {};
        const tilt   = isHov ? 0 : p.tilt;
        const yOff   = isHov ? 0 : p.yOff;
        const scale  = isHov ? 1.08 : isDim ? 0.91 : 1;
        const zIdx   = isHov ? 10 : isDim ? 0 : p.zBase;

        return (
          <div key={p.key}
            onMouseEnter={() => setHovered(p.key)}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...margin,
              zIndex: zIdx,
              transform: `rotate(${tilt}deg) translateY(${yOff}px) scale(${scale})`,
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.3s',
              opacity: isDim ? 0.5 : 1,
              cursor: 'pointer',
              flexShrink: 0,
              animation: isHov ? 'none' : `deviceFloat ${5 + p.delay * 0.5}s ease-in-out ${p.delay}s infinite`,
              position: 'relative',
            }}
          >
            <IPhoneFrame src={p.src} alt={`Exerly ${p.label}`} width={p.w} />
            {isHov && (
              <>
                <div style={{ position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: 10, color: '#D946EF', letterSpacing: '0.15em', textTransform: 'uppercase', animation: 'slideRevealU 0.25s both' }}>
                  {p.label}
                </div>
                <div style={{ position: 'absolute', inset: -24, borderRadius: '50%', background: '#D946EF', opacity: 0.15, filter: 'blur(32px)', zIndex: -1, pointerEvents: 'none' }} />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExerlySection() {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="prod-section">
      <span className="prod-num" style={{ right: '3%' }}>03</span>
      <div className="inner">
        <div className="prod-grid">
          <ProductText
            num="03" name="Exerly Fitness"
            status="IN DEVELOPMENT" accent="#D946EF"
            problem="Fitness apps treat everyone the same. Generic macros, no AI coaching, no integration with your actual health data. You track calories in a vacuum."
            solution="A 12-step onboarding wizard computes your exact BMI, TDEE, and macro targets. Gemini 2.0 Flash coaches you in real-time. SwiftUI + HealthKit on iOS, shared Express API with the web client. Barcode scanner via FatSecret. Progress photo compare mode."
            tags={['SwiftUI', 'HealthKit', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Gemini AI', 'FatSecret API']}
            github="https://github.com/whoisaldo/Exerly-Fitness"
            url="https://whoisaldo.github.io/Exerly-Fitness/"
            vis={vis} dir="left"
          />

          {/* Devices: interactive 3 phones + web view */}
          <div className="prod-devices-right" style={{
            position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
            minHeight: 560,
            animation: vis ? 'slideRevealR 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both' : 'none',
            opacity: vis ? 1 : 0,
          }}>
            <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: '#D946EF', opacity: 0.1, filter: 'blur(80px)', animation: 'glowPulse 4.5s ease-in-out infinite' }} />

            <ExerlyPhoneFan vis={vis} />

            {/* Web dashboard — sits below the fan, not overlapping */}
            <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', width: 300, zIndex: 0, animation: 'deviceFloatB 7s ease-in-out 1.2s infinite' }}>
              <BrowserFrame src="assets/ExerlyFitness/ExerlyWebViewAICoach.png" alt="Exerly AI coach" url="exerly.app/coach" />
            </div>

            <div style={{ position: 'absolute', bottom: -96, right: 0 }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>iOS + Web · SwiftUI + React</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 04 Signature Cuts 413 ─────────────────────────────────────────────────
function SignatureCutsSection() {
  const [ref, vis] = useReveal();
  return (
    <section ref={ref} className="prod-section">
      <span className="prod-num" style={{ left: '3%' }}>04</span>
      <div className="inner">
        <div className="prod-grid">
          {/* Devices LEFT — phone front & center, browser clearly below */}
          <div style={{
            position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
            animation: vis ? 'slideRevealL 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s both' : 'none',
            opacity: vis ? 1 : 0,
          }}>
            <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', background: '#C084FC', opacity: 0.1, filter: 'blur(70px)', animation: 'glowPulse 5s ease-in-out infinite', top: '20%', left: '50%', transform: 'translateX(-50%)' }} />

            {/* Phone (main, fully visible, centered) */}
            <div style={{ position: 'relative', zIndex: 2, '--r': '0deg', animation: 'deviceFloat 5.5s ease-in-out infinite' }}>
              <IPhoneFrame src="assets/SignatureCuts/SignatureCutsPhoneView.png" alt="Signature Cuts on mobile" width={250} />
            </div>

            {/* Browser below the phone, fully visible */}
            <div style={{ width: 320, zIndex: 2, '--r': '0deg', animation: 'deviceFloatB 6.5s ease-in-out 0.9s infinite', position: 'relative' }}>
              <BrowserFrame src="assets/SignatureCuts/SignatureCutsWebView.png" alt="Signature Cuts web" url="signaturecutschicopee.com" />
            </div>

            <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Mobile-first · Zero backend</span>
          </div>

          {/* Text RIGHT */}
          <ProductText
            num="04" name="Signature Cuts 413"
            status="LIVE" accent="#C084FC"
            problem="Booking a haircut requires downloading an app, creating an account, or making a phone call. For a local barbershop in Chicopee, MA — this friction costs appointments."
            solution="A static Next.js site, mobile-first by design, with SMS and WhatsApp deep-link booking flows. Tap to open a pre-filled booking message — no app, no account, no backend. Custom domain, fast, dead simple."
            tags={['Next.js', 'Tailwind CSS', 'SMS Deep-link', 'WhatsApp API', 'Static Site']}
            github={null}
            url="https://signaturecutschicopee.com"
            vis={vis} dir="right"
          />
        </div>
      </div>
    </section>
  );
}

// ── ProductsPage ───────────────────────────────────────────────────────────
function ProductsPage() {
  return (
    <div style={{ paddingTop: 60 }}>
      {/* Header */}
      <div className="inner" style={{ paddingTop: 72, paddingBottom: 80, borderBottom: '1px solid var(--border)' }}>
        <div style={{ animation: 'slideRevealU 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--accent)' }}>[ PRODUCTS ]</span>
          <h1 className="font-display" style={{ fontSize: 'clamp(48px, 7vw, 80px)', marginTop: 10, color: 'var(--text)', lineHeight: 0.95 }}>
            What we build<span style={{ color: 'var(--accent)' }}>.</span>
          </h1>
          <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.8 }}>
            Four products. Two live. Two in active development. Each one technically ambitious, obsessively refined.
          </p>

          {/* Jump nav */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 28 }}>
            {PRODUCTS.map((p, i) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', border: '1px solid var(--border)',
                fontSize: 11, color: 'var(--text-secondary)', letterSpacing: '0.06em',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.accentColor, boxShadow: p.status === 'LIVE' ? `0 0 6px ${p.accentColor}` : 'none' }} />
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>0{i+1}</span>
                {p.name}
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Showcases */}
      <EternalMonitorSection />
      <RichPresenceSection />
      <ExerlySection />
      <SignatureCutsSection />
    </div>
  );
}

Object.assign(window, { ProductsPage });
