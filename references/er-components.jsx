// er-components.jsx — Eternal Reverse shared components + data

// ── Utilities ─────────────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Data ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'eternal-monitor',
    name: 'EternalMonitor',
    tagline: 'Use your iPad as a low-latency Windows display receiver. No dongle. No driver.',
    description: 'Windows host captures via DXGI Desktop Duplication, transcodes BGRA→YUV420P, encodes H.264 via hardware (per-vendor auto-detect: NVENC, AMF, QuickSync), and streams over fragmented UDP. iPad client reassembles, decodes via VideoToolbox, renders with Metal. Zero-config discovery via mDNS/DNS-SD.',
    status: 'IN DEVELOPMENT',
    tags: ['Rust', 'Swift', 'DXGI', 'VideoToolbox', 'Metal', 'UDP', 'mDNS', 'H.264'],
    url: 'https://eternalmonitor.dev',
    github: 'https://github.com/whoisaldo/EternalMonitor',
    version: 'v0.1.1-mirror',
    accentColor: '#A855F7',
    highlight: 'Hardware H.264 encode · Metal render · mDNS zero-config',
    images: [
      'assets/EternalMonitor/EternalMonitorIpadView.png',
      'assets/EternalMonitor/EternalMonitorPCView.png',
    ],
    cardHero: 'branded',
  },
  {
    id: 'eternal-rich-presence',
    name: 'EternalRichPresence',
    tagline: 'Discord Rich Presence for Apple Music & Spotify. Live cover art. Zero friction.',
    description: 'Bridges Windows SMTC to Discord Rich Presence. Live cover art upload, Listen Along deep-link via custom eternalrp:// URI scheme, system tray host, portable .exe via PyInstaller. Provider priority: Apple Music → Spotify fallback.',
    status: 'LIVE',
    tags: ['Python', 'pywin32', 'pypresence', 'COM/SMTC', 'PyInstaller'],
    url: null,
    github: 'https://github.com/whoisaldo/Eternal-Rich-Presence',
    version: 'v1.0.0-beta',
    accentColor: '#6366F1',
    highlight: 'SMTC bridge · custom URI scheme · portable .exe',
    cardHero: 'assets/EternalRichPresence/EternalRichPresence(DiscordProfileView).png',
    images: [
      'assets/EternalRichPresence/EternalRichPresence(DiscordProfileView).png',
      'assets/EternalRichPresence/EternalRichPresenceTerminal.png',
    ],
  },
  {
    id: 'exerly',
    name: 'Exerly Fitness',
    tagline: 'Cross-platform fitness companion built for people serious about their training.',
    description: 'Barcode scanning via FatSecret API, 12-step onboarding wizard computing BMI/TDEE/macro targets, AI coaching via Gemini 2.0 Flash. Monorepo with shared Express API serving both web and iOS. SwiftUI + HealthKit on mobile.',
    status: 'IN DEVELOPMENT',
    tags: ['SwiftUI', 'HealthKit', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'Gemini AI'],
    url: 'https://whoisaldo.github.io/Exerly-Fitness/',
    github: 'https://github.com/whoisaldo/Exerly-Fitness',
    version: null,
    accentColor: '#D946EF',
    highlight: 'SwiftUI + HealthKit · Gemini 2.0 Flash AI · shared monorepo API',
    images: [
      'assets/ExerlyFitness/ExerlyFitnessPhoneView1.png',
      'assets/ExerlyFitness/ExerlyWebViewDashboard.png',
    ],
    cardHero: 'branded',
  },
  {
    id: 'signature-cuts',
    name: 'Signature Cuts 413',
    tagline: 'Modern barbershop booking. No app download. No friction.',
    description: 'Static Next.js site with Tailwind CSS. SMS and WhatsApp deep-link booking flow with proper URI encoding. Custom domain on Namecheap. Built to be fast, mobile-first, and dead simple for clients.',
    status: 'LIVE',
    tags: ['Next.js', 'Tailwind', 'SMS Booking', 'Static Site'],
    url: 'https://signaturecutschicopee.com',
    github: null,
    version: null,
    accentColor: '#C084FC',
    highlight: 'SMS deep-link booking · mobile-first · zero backend',
    cardHero: 'assets/SignatureCuts/SignatureCutsWebView.png',
    images: ['assets/SignatureCuts/SignatureCutsWebView.png', 'assets/SignatureCuts/SignatureCutsPhoneView.png'],
  },
];

const TECH_STACK = [
  { category: 'Systems', color: '#A855F7', items: ['Rust', 'Swift', 'Metal', 'DXGI', 'VideoToolbox', 'H.264', 'FFmpeg', 'UDP', 'mDNS'] },
  { category: 'Web', color: '#6366F1', items: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'] },
  { category: 'Mobile', color: '#D946EF', items: ['SwiftUI', 'HealthKit', 'PyInstaller', 'COM/SMTC'] },
  { category: 'Data & Infra', color: '#C084FC', items: ['MongoDB', 'DigitalOcean', 'Gemini AI', 'Formspree'] },
];

const FOUNDERS = [
  {
    name: 'Ali Younes',
    role: 'Co-Founder & Lead Engineer',
    initials: 'AY',
    bio: 'Full-stack engineer obsessed with systems programming, low-latency streaming, and shipping products that respect the user.',
    github: 'https://github.com/whoisaldo',
    linkedin: 'https://linkedin.com/in/ali-younes-41a2b4296',
  },
  {
    name: 'Co-Founder',
    role: 'Co-Founder',
    initials: '??',
    bio: 'Details coming soon.',
    github: null,
    linkedin: null,
  },
];

const TIMELINE = [
  { year: '2024', event: 'EternalRichPresence — first shipped product' },
  { year: '2025', event: 'Eternal Reverse founded in Boston, MA' },
  { year: '2025', event: 'EternalMonitor enters development (Rust + Swift)' },
  { year: '2025', event: 'Exerly iOS enters active development (SwiftUI + HealthKit)' },
  { year: '2025', event: 'Signature Cuts 413 launches' },
  { year: '2026', event: '→ What comes next' },
];

const ROLES = [
  {
    title: 'Mobile Engineer',
    description: "Help ship Exerly's SwiftUI iOS client — HealthKit, progress photo compare, barcode scanning.",
    build: 'Real SwiftUI features in a production monorepo',
    learn: 'iOS architecture, HealthKit, shared API design',
    walkAway: 'Shipped iOS features, GitHub contributions, studio credit',
  },
  {
    title: 'Systems Engineer',
    description: 'Contribute to EternalMonitor — Rust host + Swift iPad client, H.264 hardware encoding, Metal rendering.',
    build: 'Performance-critical systems code in Rust and/or Swift',
    learn: 'DXGI, VideoToolbox, UDP streaming, Metal GPU rendering',
    walkAway: 'One of the most technically impressive projects on any resume',
  },
  {
    title: 'Design Engineer',
    description: 'Shape the visual identity across all Eternal products — web, iOS, marketing.',
    build: 'UI components, design systems, marketing sites',
    learn: 'Production design engineering, component architecture, brand systems',
    walkAway: 'Shipped design work across multiple live products',
  },
];

// ── Nav Context ───────────────────────────────────────────────────────────
const NavCtx = React.createContext(() => {});

// ── GlowButton ────────────────────────────────────────────────────────────
function GlowButton({ children, variant = 'filled', color = 'var(--accent)', href, onClick, external, disabled }) {
  const [hovered, setHovered] = React.useState(false);
  const navigate = React.useContext(NavCtx);

  const base = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 22px', fontFamily: 'inherit', fontSize: 12,
    textTransform: 'uppercase', letterSpacing: '0.12em',
    textDecoration: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', outline: 'none', transition: 'all 0.2s',
    opacity: disabled ? 0.5 : 1,
  };

  const styles = variant === 'filled'
    ? { ...base, background: color, color: '#000', boxShadow: hovered ? `0 0 22px ${color}80` : 'none' }
    : { ...base, background: hovered ? color : 'transparent', color: hovered ? '#000' : color, border: `1px solid ${color}` };

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (href && href.startsWith('/')) { e.preventDefault(); navigate(href.slice(1) || 'home'); }
  };

  if (href && (href.startsWith('http') || external)) {
    return <a href={href} target="_blank" rel="noopener noreferrer" style={styles} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>{children}</a>;
  }

  return (
    <button disabled={disabled} style={styles} onClick={handleClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {children}
    </button>
  );
}

// ── SectionLabel ─────────────────────────────────────────────────────────
function SectionLabel({ label, withLine }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontFamily: 'inherit', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)' }}>
        [ {label} ]
      </span>
      {withLine && <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />}
    </div>
  );
}

// ── Tag ───────────────────────────────────────────────────────────────────
function Tag({ label, color }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px',
      fontFamily: 'inherit', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
      border: `1px solid ${color || 'var(--border)'}`,
      color: color || 'var(--text-secondary)',
      opacity: color ? 0.85 : 1,
    }}>{label}</span>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'LIVE': { color: '#4ade80', label: 'LIVE' },
    'IN DEVELOPMENT': { color: '#A855F7', label: 'IN DEV' },
    'COMING SOON': { color: '#8B82AA', label: 'SOON' },
  };
  const { color, label } = map[status] || map['COMING SOON'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', border: `1px solid ${color}30`,
      background: `${color}12`, fontSize: 10, letterSpacing: '0.1em',
      textTransform: 'uppercase', color,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: color, display: 'inline-block',
        boxShadow: status === 'LIVE' ? `0 0 6px ${color}` : 'none' }} />
      {label}
    </span>
  );
}

// ── ProductCard ───────────────────────────────────────────────────────────
function ProductCard({ product, index = 0 }) {
  const [imgIdx, setImgIdx] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);
  const navigate = React.useContext(NavCtx);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? product.accentColor + '50' : 'var(--border)'}`,
        background: 'var(--surface)',
        transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 40px ${product.accentColor}18` : 'none',
        display: 'flex', flexDirection: 'column',
        animation: `fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) ${index * 0.08}s both`,
      }}
    >
      {/* Hero — branded visual or image */}
      {product.cardHero === 'branded' ? (
        <div style={{ position: 'relative', width: '100%', paddingBottom: '62%', overflow: 'hidden',
          background: product.id === 'eternal-monitor' ? '#000' : 'radial-gradient(ellipse at 50% 35%, #2d1b50 0%, #080810 70%)',
        }}>
          {/* EM: scanline grid / EX: subtle glow */}
          {product.id === 'eternal-monitor' ? (
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(212,245,60,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,245,60,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          ) : (
            <div style={{ position: 'absolute', left: '50%', top: '40%', transform: 'translate(-50%, -50%)', width: 160, height: 160, borderRadius: '50%', background: '#7C3AED', opacity: 0.25, filter: 'blur(50px)' }} />
          )}

          {/* Content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {product.id === 'eternal-monitor' ? (
              <>
                {/* 3-bar logo mark */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 6 }}>
                  {[32,24,32].map((w, i) => <div key={i} style={{ width: w, height: 3, background: '#D4F53C', borderRadius: 1 }} />)}
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '0.04em', fontFamily: 'inherit' }}>EternalMonitor</span>
                <span style={{ fontSize: 9, color: '#D4F53C', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.8 }}>Windows display streaming</span>
              </>
            ) : (
              <>
                {/* Flame shape */}
                <div style={{ position: 'relative', width: 30, height: 40, marginBottom: 6 }}>
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 26, height: 32, background: 'linear-gradient(to top, #6D28D9, #8B5CF6)', borderRadius: '50% 50% 45% 45% / 55% 55% 45% 45%' }} />
                  <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 14, height: 20, background: 'linear-gradient(to top, #7C3AED, #A78BFA)', borderRadius: '50% 50% 40% 40% / 60% 60% 35% 35%' }} />
                </div>
                <span className="font-display" style={{ fontSize: 26, fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '0.01em' }}>Exerly</span>
                <span style={{ fontSize: 9, color: '#A78BFA', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.9 }}>AI-powered fitness companion</span>
              </>
            )}
          </div>
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <StatusBadge status={product.status} />
          </div>
        </div>
      ) : product.cardHero ? (
        <div style={{ position: 'relative', width: '100%', paddingBottom: '62%', overflow: 'hidden', background: 'var(--surface-2)' }}>
          <img src={product.cardHero} alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', transition: 'opacity 0.3s' }} />
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <StatusBadge status={product.status} />
          </div>
          {product.images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 4 }}>
              {product.images.map((_, i) => (
                <button key={i} onClick={() => setImgIdx(i)} style={{ width: 6, height: 6, borderRadius: '50%', background: i === imgIdx ? product.accentColor : 'rgba(255,255,255,0.3)', border: 'none', cursor: 'pointer', padding: 0 }} />
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* Body */}
      <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <h3 className="font-display" style={{ fontSize: 22, color: 'var(--text)', fontWeight: 700 }}>{product.name}</h3>
            {product.version && (
              <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em' }}>{product.version}</span>
            )}
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{product.tagline}</p>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {product.tags.slice(0, 5).map(t => <Tag key={t} label={t} color={product.accentColor} />)}
          {product.tags.length > 5 && <Tag label={`+${product.tags.length - 5}`} />}
        </div>

        {/* Highlight */}
        <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-secondary)', borderTop: '1px solid var(--border)', paddingTop: 10, marginTop: 'auto' }}>
          {product.highlight}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          {product.github && (
            <GlowButton href={product.github} external variant="ghost" color={product.accentColor}>
              GitHub ↗
            </GlowButton>
          )}
          {product.url && (
            <GlowButton href={product.url} external variant="filled" color={product.accentColor}>
              Visit ↗
            </GlowButton>
          )}
          <button
            onClick={() => window.erGoToProduct && window.erGoToProduct(product.id)}
            style={{
              background: 'none', border: '1px solid var(--border)', cursor: 'pointer',
              padding: '9px 16px', fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: 'var(--text-secondary)',
              transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', gap: 4,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = product.accentColor; e.currentTarget.style.color = product.accentColor; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            Deep Dive →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── FadeUp ────────────────────────────────────────────────────────────────
function FadeUp({ children, delay: d = 0, style: extraStyle }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${d}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${d}s`,
      ...extraStyle,
    }}>
      {children}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────
function Navbar({ activePage }) {
  const navigate = React.useContext(NavCtx);
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const links = [
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' },
  ];

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => { setMenuOpen(false); }, [activePage]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        background: scrolled ? 'rgba(6,5,14,0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s',
      }}>
        {/* Logo */}
        <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="assets/EternalReverse/EternalReverseMiniLogo.png" alt="ER" style={{ height: 24, width: 'auto', filter: 'brightness(1.1)' }} />
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>Eternal Reverse</span>
        </button>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-desktop">
          {links.map(link => (
            <button key={link.id} onClick={() => navigate(link.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
              color: activePage === link.id ? 'var(--accent)' : 'var(--text-secondary)',
              position: 'relative', padding: '4px 0',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => { if (activePage !== link.id) e.target.style.color = 'var(--text)'; }}
              onMouseLeave={e => { if (activePage !== link.id) e.target.style.color = 'var(--text-secondary)'; }}
            >
              {link.label}
              {activePage === link.id && (
                <span style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1.5, background: 'var(--accent)' }} />
              )}
            </button>
          ))}
          <a href="https://github.com/whoisaldo" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', textDecoration: 'none' }}>
            [ GitHub → ]
          </a>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="nav-mobile"
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 20, height: 1.5, background: 'var(--text)',
              transition: 'all 0.2s',
              transform: menuOpen ? (i === 0 ? 'translateY(6.5px) rotate(45deg)' : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'scaleX(0)') : 'none',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99,
          background: 'rgba(6,5,14,0.98)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
        }}>
          {links.map((link, i) => (
            <button key={link.id} onClick={() => navigate(link.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 42,
              color: activePage === link.id ? 'var(--accent)' : 'var(--text)',
              animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both`,
            }}>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  const navigate = React.useContext(NavCtx);
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div style={{ textAlign: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => navigate('careers')} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent)',
          transition: 'color 0.2s',
        }}>
          [ OPEN TO CONTRIBUTORS → /careers ]
        </button>
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--accent)' }}>ER</span>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-secondary)' }}>Eternal Reverse</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Built to last. Shipped to matter.</p>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {['products', 'about', 'careers', 'contact'].map(p => (
            <button key={p} onClick={() => navigate(p)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--text)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >
              {p}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'flex-end' }}>
          <a href="https://github.com/whoisaldo" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a href="https://linkedin.com/in/ali-younes-41a2b4296" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
          <a href="mailto:hello@eternalreverse.com" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
          </a>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border)', padding: '14px 0', textAlign: 'center' }}>
        <p style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.05em' }}>© 2025 Eternal Reverse · hello@eternalreverse.com · Boston, MA</p>
      </div>
    </footer>
  );
}

// ── Exports ───────────────────────────────────────────────────────────────
Object.assign(window, {
  PRODUCTS, TECH_STACK, FOUNDERS, TIMELINE, ROLES,
  NavCtx, GlowButton, SectionLabel, Tag, StatusBadge,
  ProductCard, FadeUp, Navbar, Footer, delay,
});
