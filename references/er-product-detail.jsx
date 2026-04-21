// er-product-detail.jsx — Individual product deep-dive pages

// ── Per-product rich content ──────────────────────────────────────────────
const PRODUCT_DETAILS = {
  'eternal-monitor': {
    accentColor: '#A855F7',
    tagline: 'iPad as a low-latency Windows display receiver. No dongle. No driver. No subscription.',
    stats: [
      { label: 'Encode Stack',  value: 'H.264' },
      { label: 'Renderer',      value: 'Metal' },
      { label: 'Discovery',     value: 'mDNS' },
      { label: 'Language',      value: 'Rust + Swift' },
    ],
    gallery: [
      { src: 'assets/EternalMonitor/EternalMonitorIpadView.png',  device: 'ipad',    label: 'iPad Client',    sub: 'Metal GPU Renderer' },
      { src: 'assets/EternalMonitor/EternalMonitorPCView.png',    device: 'browser', label: 'Windows Host',   sub: 'DXGI Capture + H.264 Encode' },
    ],
    architecture: [
      { step: '01', title: 'DXGI Desktop Duplication', body: 'The Windows host uses the DXGI Desktop Duplication API to capture the full display framebuffer at up to 60fps with near-zero CPU cost — leveraging the GPU directly.' },
      { step: '02', title: 'Hardware H.264 Encoding',  body: 'Captured BGRA frames are converted to YUV420P then hardware-encoded. The encoder is auto-selected: NVENC for NVIDIA, AMF for AMD, QuickSync for Intel. No software fallback.' },
      { step: '03', title: 'Fragmented UDP Streaming', body: 'Encoded NAL units are fragmented and streamed over UDP with sequence numbers and reassembly buffers on the receiving end. Zero TCP handshake overhead.' },
      { step: '04', title: 'mDNS Zero-Config Discovery', body: 'The iPad client discovers the Windows host on the local network via mDNS/DNS-SD — no IP address entry, no config files. Just open the app and connect.' },
      { step: '05', title: 'VideoToolbox + Metal Render', body: 'The iPad decodes H.264 frames via Apple VideoToolbox for hardware-accelerated decoding, then renders each frame with Metal — bypassing UIKit entirely for maximum throughput.' },
    ],
    highlights: [
      'Written in Rust (host) and Swift (iPad client) for memory safety and zero-cost abstractions',
      'Per-vendor hardware encoder auto-detection — no manual configuration required',
      'Fragmented UDP with custom reassembly — handles packet reordering and loss gracefully',
      'Metal rendering pipeline bypasses UIKit for lowest-possible display latency',
    ],
  },

  'eternal-rich-presence': {
    accentColor: '#6366F1',
    tagline: 'Discord Rich Presence for Apple Music & Spotify on Windows. Live cover art. Portable .exe.',
    stats: [
      { label: 'Platform',  value: 'Windows' },
      { label: 'Bridge',    value: 'SMTC → RPC' },
      { label: 'Ships as',  value: '.exe' },
      { label: 'Language',  value: 'Python' },
    ],
    gallery: [
      { src: 'assets/EternalRichPresence/EternalRichPresence(DiscordProfileView).png', device: 'browser', label: 'Discord Profile',  sub: 'Live Rich Presence Active' },
      { src: 'assets/EternalRichPresence/EternalRichPresenceTerminal.png',              device: 'terminal',label: 'Host Process',     sub: 'SMTC → RPC Bridge Running' },
    ],
    architecture: [
      { step: '01', title: 'Windows SMTC Polling',     body: 'The daemon reads the Windows System Media Transport Controls (SMTC) via the Windows Runtime COM interface — capturing title, artist, album, and playback state.' },
      { step: '02', title: 'Provider Priority Logic',  body: 'Apple Music takes priority over Spotify. The system detects which app is actively playing and routes to the correct provider, falling back gracefully on switches.' },
      { step: '03', title: 'Cover Art Upload',         body: 'Album artwork is fetched from the media session, uploaded to Discord\'s CDN via the Rich Presence asset API, and embedded in the presence payload as a live image.' },
      { step: '04', title: 'Discord RPC Bridge',       body: 'pypresence handles the Discord IPC socket connection. The presence payload is updated on every track change with title, artist, album art, and elapsed time.' },
      { step: '05', title: 'Listen Along URI Scheme',  body: 'A custom eternalrp:// URI scheme is registered on install, enabling clickable "Listen Along" deep-links that route friends directly to the currently playing track.' },
    ],
    highlights: [
      'Portable single .exe via PyInstaller — no Python install required on the target machine',
      'Live album artwork upload to Discord CDN on every track change',
      'Custom URI scheme registration for Listen Along deep-links',
      'System tray host — runs silently in the background with zero window chrome',
    ],
  },

  'exerly': {
    accentColor: '#D946EF',
    tagline: 'Cross-platform fitness companion. AI coaching, barcode scanning, HealthKit sync. Built for serious training.',
    stats: [
      { label: 'AI Model',  value: 'Gemini 2.0' },
      { label: 'Mobile',    value: 'SwiftUI' },
      { label: 'Health',    value: 'HealthKit' },
      { label: 'API',       value: 'Monorepo' },
    ],
    gallery: [
      { src: 'assets/ExerlyFitness/ExerlyWebViewLandingPage.png',   device: 'browser', label: 'Landing Page',   sub: 'Web Client' },
      { src: 'assets/ExerlyFitness/ExerlyFitnessPhoneView1.png',    device: 'phone',   label: 'iOS — Splash',   sub: 'SwiftUI Onboarding' },
      { src: 'assets/ExerlyFitness/ExerlyWebViewDashboard.png',     device: 'browser', label: 'Dashboard',      sub: 'Progress Overview' },
      { src: 'assets/ExerlyFitness/ExerlyFitnessPhoneView2.png',    device: 'phone',   label: 'iOS — Tracking', sub: 'Daily Log View' },
      { src: 'assets/ExerlyFitness/ExerlyWebViewAICoach.png',       device: 'browser', label: 'AI Coach',       sub: 'Gemini 2.0 Flash' },
      { src: 'assets/ExerlyFitness/ExerlyFitnessPhoneView3.png',    device: 'phone',   label: 'iOS — Progress', sub: 'Training Stats' },
      { src: 'assets/ExerlyFitness/ExerlyWebViewFoodTracker.png',   device: 'browser', label: 'Food Tracker',   sub: 'Barcode + Manual Entry' },
      { src: 'assets/ExerlyFitness/ExerlyWebViewSignup-Login.png',  device: 'browser', label: 'Auth Flow',      sub: 'Signup & Login' },
      { src: 'assets/ExerlyFitness/ExerlyWebViewProfileView.png',   device: 'browser', label: 'Profile',        sub: 'Macro Targets + Stats' },
    ],
    architecture: [
      { step: '01', title: '12-Step Onboarding Wizard', body: 'A guided onboarding flow collects height, weight, age, activity level, and goals. BMI, TDEE, and macro targets (protein, carbs, fat) are computed client-side and stored to the user profile.' },
      { step: '02', title: 'Barcode Scanning via FatSecret', body: 'The iOS client uses the camera to scan barcodes. Product data is resolved via the FatSecret API, pre-populating nutrition info for one-tap food logging. Web client supports manual entry.' },
      { step: '03', title: 'Gemini 2.0 Flash AI Coaching',  body: 'The AI coach sends context-aware prompts to Gemini 2.0 Flash — including recent workouts, current macros, and goals. Responses are streamed in real-time and saved to the coaching history.' },
      { step: '04', title: 'SwiftUI + HealthKit on iOS',    body: 'The native iOS client syncs steps, active calories, and workout data from HealthKit. Progress photo compare mode stores photos locally with date metadata for visual tracking.' },
      { step: '05', title: 'Shared Monorepo API',           body: 'A single Express + Node.js API serves both the web client and iOS app. MongoDB stores user data, logs, and coach history. Hosted on DigitalOcean with environment parity between dev and prod.' },
    ],
    highlights: [
      'Single Express API shared between web and iOS — monorepo with zero code duplication',
      'Gemini 2.0 Flash streams coaching responses in real-time with full user context',
      'SwiftUI progress photo compare mode for side-by-side visual progress tracking',
      'Barcode scanner auto-resolves nutrition data — no manual entry required',
    ],
  },

  'signature-cuts': {
    accentColor: '#C084FC',
    tagline: 'Modern barbershop booking for Signature Cuts in Chicopee, MA. Two taps to book. Zero backend.',
    stats: [
      { label: 'Framework', value: 'Next.js' },
      { label: 'Booking',   value: 'SMS + WA' },
      { label: 'Backend',   value: 'None' },
      { label: 'Hosting',   value: 'Static' },
    ],
    gallery: [
      { src: 'assets/SignatureCuts/SignatureCutsWebView.png',   device: 'browser', label: 'Web View',   sub: 'Full Site' },
      { src: 'assets/SignatureCuts/SignatureCutsPhoneView.png', device: 'phone',   label: 'Mobile View', sub: 'Primary Use Case' },
    ],
    architecture: [
      { step: '01', title: 'Static Next.js Export', body: 'The site is built as a fully static Next.js export — no server, no API routes, no database. Every page is pre-rendered HTML. Deployed to a custom Namecheap domain.' },
      { step: '02', title: 'SMS Deep-Link Encoding', body: 'The booking button generates an sms:// URI with a pre-encoded message body — customer name prompt, service selection, and preferred time. Tapping opens the native SMS app ready to send.' },
      { step: '03', title: 'WhatsApp Booking Flow', body: 'A parallel WhatsApp deep-link using the wa.me/ API provides an alternative booking path. Both flows encode the barbershop phone number and a pre-filled message with proper URI encoding.' },
      { step: '04', title: 'Mobile-First Design', body: 'Every layout decision prioritized mobile viewport. Touch targets, font sizes, and scroll behavior were designed for a customer standing outside the shop deciding whether to walk in.' },
    ],
    highlights: [
      'Zero backend — no server costs, no maintenance, no downtime risk',
      'SMS and WhatsApp booking flows — covers both customer segments in Chicopee',
      'Fully static export means instant load on any connection',
      'Built free of charge for a local business',
    ],
  },
};

// ── Gallery item ──────────────────────────────────────────────────────────
function GalleryItem({ item, accent }) {
  const [hov, setHov] = React.useState(false);

  const frame = (() => {
    if (item.device === 'phone') {
      return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <IPhoneFrame src={item.src} alt={item.label} width={200} />
        </div>
      );
    }
    if (item.device === 'ipad') {
      return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <IPadFrame src={item.src} alt={item.label} width={280} />
        </div>
      );
    }
    if (item.device === 'terminal') {
      return (
        <div style={{ borderRadius: 8, border: '1px solid #2a2a2a', overflow: 'hidden', background: '#0d0d0d' }}>
          <div style={{ height: 30, background: '#151515', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px' }}>
            {['#FF5F57','#FEBC2E','#28C840'].map((c,i) => <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, opacity: 0.75 }} />)}
            <span style={{ fontSize: 10, color: '#444', marginLeft: 6 }}>terminal</span>
          </div>
          <img src={item.src} alt={item.label} style={{ width: '100%', display: 'block' }} />
        </div>
      );
    }
    // browser default
    return <BrowserFrame src={item.src} alt={item.label} url={item.sub} />;
  })();

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        border: `1px solid ${hov ? accent + '50' : 'var(--border)'}`,
        background: 'var(--surface)',
        padding: '16px',
        transition: 'all 0.25s',
        transform: hov ? 'translateY(-4px)' : 'none',
        boxShadow: hov ? `0 12px 40px ${accent}18` : 'none',
      }}
    >
      {frame}
      <div style={{ marginTop: 12, padding: '0 4px' }}>
        <p style={{ fontSize: 12, color: 'var(--text)', letterSpacing: '0.04em' }}>{item.label}</p>
        <p style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.sub}</p>
      </div>
    </div>
  );
}

// ── ProductDetailPage ──────────────────────────────────────────────────────
function ProductDetailPage({ productId, onBack }) {
  const product = PRODUCTS.find(p => p.id === productId);
  const detail  = PRODUCT_DETAILS[productId];
  if (!product || !detail) return null;

  const acc = detail.accentColor;

  return (
    <div style={{ paddingTop: 60, minHeight: '100vh' }}>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--border)', background: 'var(--black)' }}>
        {/* Orb */}
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', width: 500, height: 500, borderRadius: '50%', background: acc, opacity: 0.12, filter: 'blur(100px)', pointerEvents: 'none', animation: 'orbFloat 8s ease-in-out infinite' }} />

        <div className="inner" style={{ paddingTop: 56, paddingBottom: 64, position: 'relative', zIndex: 2 }}>
          {/* Back */}
          <button onClick={onBack} style={{
            background: 'none', border: `1px solid var(--border)`, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 14px', fontSize: 11, color: 'var(--text-secondary)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            marginBottom: 40, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = acc; e.currentTarget.style.color = acc; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            ← Back to Products
          </button>

          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, animation: 'fadeUp 0.5s both' }}>
            <span style={{ fontSize: 10, color: acc, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              [ {String(PRODUCTS.indexOf(product) + 1).padStart(2,'0')} ]
            </span>
            <StatusBadge status={product.status} />
            {product.version && <span style={{ fontSize: 10, color: 'var(--muted)' }}>{product.version}</span>}
          </div>

          <h1 className="font-display" style={{ fontSize: 'clamp(52px, 7vw, 88px)', color: 'var(--text)', lineHeight: 0.95, marginBottom: 20, animation: 'fadeUp 0.5s 0.05s both' }}>
            {product.name}
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 600, lineHeight: 1.7, marginBottom: 40, animation: 'fadeUp 0.5s 0.1s both' }}>
            {detail.tagline}
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 0, borderTop: '1px solid var(--border)', animation: 'fadeUp 0.5s 0.15s both' }}>
            {detail.stats.map((s, i) => (
              <div key={s.label} style={{
                padding: '16px 28px', borderRight: '1px solid var(--border)',
                borderBottom: '1px solid transparent',
              }}>
                <p style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-secondary)', marginBottom: 6 }}>{s.label}</p>
                <p className="font-display" style={{ fontSize: 22, color: 'var(--text)', fontWeight: 700 }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '72px 0' }}>
        <div className="inner">
          <FadeUp>
            <SectionLabel label="GALLERY" withLine />
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 8 }}>Every view, every screen, every state.</p>
          </FadeUp>
          <div style={{
            display: 'grid',
            gridTemplateColumns: detail.gallery.length <= 2 ? '1fr 1fr' : 'repeat(3, 1fr)',
            gap: 16, marginTop: 32,
          }} className="gallery-grid">
            {detail.gallery.map((item, i) => (
              <FadeUp key={i} delay={i * 0.06}>
                <GalleryItem item={item} accent={acc} />
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Architecture */}
      <div style={{ padding: '72px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="inner">
          <FadeUp>
            <SectionLabel label="HOW IT WORKS" withLine />
            <h2 className="font-display" style={{ fontSize: 36, marginTop: 10, color: 'var(--text)' }}>
              Under the hood<span style={{ color: acc }}>.</span>
            </h2>
          </FadeUp>
          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {detail.architecture.map((step, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div style={{
                  display: 'grid', gridTemplateColumns: '80px 1fr',
                  gap: 24, padding: '28px 0',
                  borderTop: i === 0 ? `1px solid var(--border)` : '1px solid var(--border)',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ paddingTop: 3 }}>
                    <span className="font-display" style={{ fontSize: 32, color: acc, opacity: 0.5, fontWeight: 700, lineHeight: 1 }}>{step.step}</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, color: 'var(--text)', marginBottom: 8, letterSpacing: '0.02em' }}>{step.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.85 }}>{step.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div style={{ background: 'var(--surface)', padding: '72px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="inner">
          <FadeUp>
            <SectionLabel label="HIGHLIGHTS" withLine />
          </FadeUp>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 32 }} className="highlights-grid">
            {detail.highlights.map((h, i) => (
              <FadeUp key={i} delay={i * 0.07}>
                <div style={{ padding: '20px 22px', border: `1px solid var(--border)`, background: 'var(--surface-2)', display: 'flex', gap: 14 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: acc, flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{h}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>

      {/* Full Tech Stack */}
      <div style={{ padding: '72px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="inner">
          <FadeUp>
            <SectionLabel label="FULL STACK" withLine />
          </FadeUp>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 24 }}>
            {product.tags.map(t => <Tag key={t} label={t} color={acc} />)}
          </div>
        </div>
      </div>

      {/* CTA footer */}
      <div style={{ padding: '64px 0' }}>
        <div className="inner">
          <FadeUp>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <p className="font-display" style={{ fontSize: 28, color: 'var(--text)' }}>{product.name}</p>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                  {product.status === 'LIVE' ? 'Live and shipping.' : 'In active development.'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {product.github && <GlowButton href={product.github} external variant="ghost" color={acc}>GitHub ↗</GlowButton>}
                {product.url    && <GlowButton href={product.url}    external variant="filled" color={acc}>Visit ↗</GlowButton>}
                <GlowButton variant="ghost" color="var(--text-secondary)" onClick={onBack}>← All Products</GlowButton>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

// ── Gallery responsive ─────────────────────────────────────────────────────
const detailStyle = document.createElement('style');
detailStyle.textContent = `
  @media (max-width: 768px) {
    .gallery-grid    { grid-template-columns: 1fr !important; }
    .highlights-grid { grid-template-columns: 1fr !important; }
  }
`;
document.head.appendChild(detailStyle);

Object.assign(window, { ProductDetailPage });
