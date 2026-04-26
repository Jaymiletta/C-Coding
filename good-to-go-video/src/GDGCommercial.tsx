import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// ── Brand ─────────────────────────────────────────────────────────────────────
const C = {
  black:  '#07070F',
  navy:   '#0D0D2B',
  green:  '#00C896',
  blue:   '#0057FF',
  gold:   '#FFD04D',
  white:  '#FFFFFF',
  grey:   'rgba(255,255,255,0.55)',
};

// ── Timing (30 fps) ───────────────────────────────────────────────────────────
// Scene:        from   dur   end
// INTRO          0     75    75   (0–2.5s)
// HOOK          75    120   195   (2.5–6.5s)
// PIVOT        195     90   285   (6.5–9.5s)
// STATS        285    390   675   (9.5–22.5s)  3 stats × 130f
// SERVICES     675    240   915   (22.5–30.5s)
// STATEMENT    915    180  1095   (30.5–36.5s)
// CTA         1095    255  1350   (36.5–45s)

export const GDG_TOTAL_FRAMES = 1350;

// ── Helpers ───────────────────────────────────────────────────────────────────
const fi = (f: number, delay = 0, dur = 15) =>
  interpolate(f - delay, [0, dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const fo = (f: number, total: number, dur = 12) =>
  interpolate(f, [total - dur, total], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

const slide = (f: number, delay = 0, distance = 40, dur = 20) => ({
  opacity: fi(f, delay, dur),
  transform: `translateY(${interpolate(f - delay, [0, dur], [distance, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
});

// ── Floating particle background ──────────────────────────────────────────────
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: (i * 137.5) % 100,
  y: (i * 97.3) % 100,
  size: 1.5 + (i % 4) * 0.8,
  speed: 0.008 + (i % 5) * 0.003,
  color: i % 3 === 0 ? C.green : i % 3 === 1 ? C.blue : 'rgba(255,255,255,0.3)',
}));

const ParticleBg: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${(p.x + Math.sin(f * p.speed + p.id) * 4) % 100}%`,
            top:  `${(p.y + Math.cos(f * p.speed * 0.7 + p.id) * 3) % 100}%`,
            width:  p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            opacity: 0.4 + Math.sin(f * 0.04 + p.id) * 0.2,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ── Glowing line ──────────────────────────────────────────────────────────────
const GlowLine: React.FC<{color?: string; width?: number; delay?: number}> = ({
  color = C.green, width = 120, delay = 0,
}) => {
  const f = useCurrentFrame();
  const w = interpolate(f - delay, [0, 20], [0, width], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{
      width: w,
      height: 3,
      background: color,
      borderRadius: 2,
      boxShadow: `0 0 12px ${color}, 0 0 30px ${color}40`,
    }} />
  );
};

// ── SCENE 1 — INTRO (0–75f) ───────────────────────────────────────────────────
const SceneIntro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const logoScale = spring({frame: f - 10, fps, config: {damping: 14, stiffness: 80}});
  const logoOpacity = fi(f, 10, 20);

  return (
    <AbsoluteFill style={{background: C.black, justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', gap: 24}}>
      <ParticleBg opacity={fi(f, 0, 40) * 0.6} />
      <div style={{
        opacity: logoOpacity,
        transform: `scale(${0.6 + logoScale * 0.4})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        zIndex: 1,
      }}>
        <Img src={staticFile('gdg-logo-footer.png')} style={{width: 420, objectFit: 'contain'}} />
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 2 — HOOK (75–195f) ─────────────────────────────────────────────────
const HOOK_WORDS = ['Most', 'agencies', 'promise', 'results.'];

const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.black, justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', gap: 20, opacity: fo(f, 120)}}>
      <ParticleBg opacity={0.4} />
      <div style={{zIndex:1, textAlign:'center'}}>
        <div style={{display:'flex', gap: 20, justifyContent:'center', flexWrap:'wrap', marginBottom: 12}}>
          {HOOK_WORDS.map((word, i) => (
            <span
              key={word}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 86,
                fontWeight: 900,
                color: C.white,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                ...slide(f, i * 8, 30, 18),
              }}
            >
              {word}
            </span>
          ))}
        </div>
        <div style={{display:'flex', justifyContent:'center', marginTop: 16, ...slide(f, 30, 0, 20)}}>
          <GlowLine color={C.green} width={240} delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 3 — PIVOT (195–285f) ───────────────────────────────────────────────
const ScenePivot: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame: f - 5, fps, config: {damping: 12, stiffness: 100}});
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, #000820 0%, #001040 50%, #000820 100%)`,
      justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', gap: 20,
      opacity: Math.min(fi(f, 0, 12), fo(f, 90)),
    }}>
      <ParticleBg opacity={0.5} />
      <div style={{zIndex:1, textAlign:'center'}}>
        <div style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 108,
          fontWeight: 900,
          color: C.green,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          transform: `scale(${0.7 + scale * 0.3})`,
          textShadow: `0 0 60px ${C.green}80, 0 0 120px ${C.green}30`,
        }}>
          We build them.
        </div>
        <div style={{display:'flex', justifyContent:'center', marginTop: 20, ...slide(f, 20, 0, 15)}}>
          <GlowLine color={C.green} width={480} delay={25} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 4 — STATS (285–675f) — 3 × 130f each ───────────────────────────────
const StatCard: React.FC<{value: string; label: string; color: string; total: number}> = ({
  value, label, color, total,
}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = spring({frame: f - 8, fps, config: {damping: 14, stiffness: 90}});
  return (
    <AbsoluteFill style={{
      justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', gap: 12,
      opacity: Math.min(fi(f, 0, 15), fo(f, total, 15)),
    }}>
      <div style={{textAlign:'center', transform:`scale(${0.5 + scale * 0.5})`}}>
        <div style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 160,
          fontWeight: 900,
          color,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          textShadow: `0 0 80px ${color}60`,
        }}>
          {value}
        </div>
        <div style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 42,
          fontWeight: 700,
          color: C.white,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginTop: 8,
          opacity: fi(f, 20, 15),
        }}>
          {label}
        </div>
        <div style={{display:'flex', justifyContent:'center', marginTop: 20}}>
          <GlowLine color={color} width={200} delay={25} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneStats: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.black}}>
      <ParticleBg opacity={0.5} />
      <Sequence from={0}   durationInFrames={130}><StatCard value="175+" label="Businesses Grown"      color={C.green} total={130} /></Sequence>
      <Sequence from={130} durationInFrames={130}><StatCard value="$12M+" label="Revenue Generated"   color={C.gold}  total={130} /></Sequence>
      <Sequence from={260} durationInFrames={130}><StatCard value="55+"   label="Five-Star Reviews"   color={C.blue}  total={130} /></Sequence>
    </AbsoluteFill>
  );
};

// ── SCENE 5 — SERVICES (675–915f) ────────────────────────────────────────────
const SERVICES = [
  'SEO & Local Search', 'Google Ads', 'Meta Ads', 'Web Design',
  'Content Creation', 'Email Marketing', 'Automation & AI',
  'Reputation Mgmt', 'Branding & PR', 'CRM & Sales',
];

const SceneServices: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, #050510 0%, #0A0A25 100%)`,
      justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', gap: 48,
      opacity: Math.min(fi(f, 0, 15), fo(f, 240)),
    }}>
      <ParticleBg opacity={0.35} />
      <div style={{zIndex:1, textAlign:'center'}}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: C.grey,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: 40,
          opacity: fi(f, 0, 20),
        }}>
          What We Build For You
        </div>
        <div style={{display:'flex', flexWrap:'wrap', gap: 16, justifyContent:'center', maxWidth: 1400, padding: '0 80px'}}>
          {SERVICES.map((s, i) => (
            <div
              key={s}
              style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: 30,
                fontWeight: 700,
                color: i % 3 === 0 ? C.green : i % 3 === 1 ? C.white : C.blue,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${i % 3 === 0 ? C.green + '40' : i % 3 === 1 ? 'rgba(255,255,255,0.1)' : C.blue + '40'}`,
                borderRadius: 12,
                padding: '14px 28px',
                ...slide(f, 10 + i * 12, 25, 16),
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 6 — STATEMENT (915–1095f) ──────────────────────────────────────────
const SceneStatement: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      background: C.black,
      justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', gap: 32,
      opacity: Math.min(fi(f, 0, 20), fo(f, 180)),
    }}>
      <ParticleBg opacity={0.6} />
      <div style={{zIndex:1, textAlign:'center', padding: '0 120px'}}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 76,
          fontWeight: 900,
          color: C.white,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          ...slide(f, 0, 30, 20),
        }}>
          Real growth is{' '}
          <span style={{color: C.green, textShadow: `0 0 40px ${C.green}60`}}>earned</span>,<br />
          not advertised.
        </div>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 34,
          fontWeight: 500,
          color: C.grey,
          marginTop: 28,
          lineHeight: 1.5,
          ...slide(f, 25, 20, 18),
        }}>
          We act like your in-house partner — not a vendor.
        </div>
        <div style={{display:'flex', justifyContent:'center', marginTop: 32, ...slide(f, 35, 0, 15)}}>
          <GlowLine color={C.green} width={320} delay={40} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── SCENE 7 — CTA (1095–1350f) ───────────────────────────────────────────────
const SceneCTA: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logoScale = spring({frame: f - 15, fps, config: {damping: 16, stiffness: 70}});

  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at center, #0D1A2E 0%, ${C.black} 70%)`,
      justifyContent:'center', alignItems:'center', display:'flex', flexDirection:'column', gap: 36,
      opacity: fi(f, 0, 25),
    }}>
      <ParticleBg opacity={0.5} />

      {/* Logo */}
      <div style={{
        opacity: fi(f, 15, 20),
        transform: `scale(${0.5 + logoScale * 0.5})`,
        zIndex: 1,
      }}>
        <Img src={staticFile('gdg-logo-footer.png')} style={{width: 500, objectFit: 'contain'}} />
      </div>

      {/* Tagline */}
      <div style={{zIndex:1, textAlign:'center', ...slide(f, 30, 20, 18)}}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 38,
          fontWeight: 800,
          color: C.white,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          Your Growth Partner
        </div>
      </div>

      {/* Website */}
      <div style={{
        zIndex:1,
        background: C.green,
        borderRadius: 16,
        padding: '20px 60px',
        ...slide(f, 45, 15, 18),
        boxShadow: `0 0 40px ${C.green}60`,
      }}>
        <div style={{
          fontFamily: 'system-ui, sans-serif',
          fontSize: 44,
          fontWeight: 900,
          color: C.black,
          letterSpacing: '0.01em',
        }}>
          gdgmediamanagement.com
        </div>
      </div>

      {/* Footer line */}
      <div style={{
        zIndex:1,
        fontFamily: 'system-ui, sans-serif',
        fontSize: 22,
        fontWeight: 500,
        color: C.grey,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        ...slide(f, 60, 10, 15),
      }}>
        South Jersey &amp; Beyond · Founded 2023 · 175+ Businesses Served
      </div>
    </AbsoluteFill>
  );
};

// ── Root export ───────────────────────────────────────────────────────────────
export const GDGCommercial: React.FC = () => (
  <AbsoluteFill style={{background: C.black}}>
    <Sequence from={0}    durationInFrames={75}>  <SceneIntro />     </Sequence>
    <Sequence from={75}   durationInFrames={120}> <SceneHook />      </Sequence>
    <Sequence from={195}  durationInFrames={90}>  <ScenePivot />     </Sequence>
    <Sequence from={285}  durationInFrames={390}> <SceneStats />     </Sequence>
    <Sequence from={675}  durationInFrames={240}> <SceneServices />  </Sequence>
    <Sequence from={915}  durationInFrames={180}> <SceneStatement /> </Sequence>
    <Sequence from={1095} durationInFrames={255}> <SceneCTA />       </Sequence>
  </AbsoluteFill>
);
