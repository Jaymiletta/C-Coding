import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

// ── Clip assignments ──────────────────────────────────────────────────────────
// Download your clips from Google Drive, place them in /public, and rename:
//   hook.mp4     → on-camera: "Heat pump or central AC..."
//   problem.mp4  → b-roll: outdoor condenser / heat pump unit
//   fix.mp4      → on-camera: walking through the points
const CLIPS = {
  hook:    staticFile('hook.mp4'),
  problem: staticFile('problem.mp4'),
  fix:     staticFile('fix.mp4'),
};

// ── Brand ─────────────────────────────────────────────────────────────────────
const RED   = '#C8102E';
const WHITE = '#FFFFFF';
const BLACK = '#0A0A0A';

// ── Timing at 30 fps ──────────────────────────────────────────────────────────
const HOOK_DUR    = 240; //  8 sec — hook
const PROB_DUR    = 300; // 10 sec — problem
const FIX_DUR     = 570; // 19 sec — fix (5 rolling caption points)
const CTA_DUR     = 240; //  8 sec — end card

const HOOK_START  = 0;
const PROB_START  = HOOK_DUR;
const FIX_START   = PROB_START + PROB_DUR;
const CTA_START   = FIX_START + FIX_DUR;

export const TOTAL_FRAMES = HOOK_DUR + PROB_DUR + FIX_DUR + CTA_DUR; // 1350 = 45 sec

// ── Utilities ─────────────────────────────────────────────────────────────────
const fi = (frame: number, delay = 0, dur = 12) =>
  interpolate(frame - delay, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const fo = (frame: number, total: number, dur = 12) =>
  interpolate(frame, [total - dur, total], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// ── Shared sub-components ─────────────────────────────────────────────────────
const BgVideo: React.FC<{src: string}> = ({src}) => (
  <Video
    src={src}
    style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}}
  />
);

const DimOverlay: React.FC<{alpha?: number}> = ({alpha = 0.42}) => (
  <AbsoluteFill style={{background: `rgba(0,0,0,${alpha})`}} />
);

const BottomGradient: React.FC = () => (
  <AbsoluteFill
    style={{background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 55%)'}}
  />
);

const captionBase: React.CSSProperties = {
  fontFamily: 'system-ui, -apple-system, Arial, sans-serif',
  fontWeight: 900,
  fontSize: 58,
  color: WHITE,
  lineHeight: 1.15,
  textShadow: '0 3px 18px rgba(0,0,0,0.95)',
  marginBottom: 10,
};

// ── HOOK (0 – 8 s) ────────────────────────────────────────────────────────────
const HookBeat: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: fo(f, HOOK_DUR)}}>
      <BgVideo src={CLIPS.hook} />
      <DimOverlay />
      <BottomGradient />
      <AbsoluteFill style={{display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 56px 130px'}}>
        <div style={{...captionBase, opacity: fi(f)}}>
          Heat pump or central AC —
        </div>
        <div style={{...captionBase, opacity: fi(f, 8)}}>
          which one should you actually put in your South Jersey home?
        </div>
        <div style={{...captionBase, fontSize: 44, fontWeight: 700, color: RED, opacity: fi(f, 20)}}>
          Here's the honest answer.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── PROBLEM (8 – 18 s) ────────────────────────────────────────────────────────
const ProblemBeat: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: Math.min(fi(f, 0, 10), fo(f, PROB_DUR))}}>
      <BgVideo src={CLIPS.problem} />
      <DimOverlay alpha={0.52} />
      <BottomGradient />
      <AbsoluteFill style={{display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 56px 130px'}}>
        <div style={{...captionBase, opacity: fi(f)}}>
          Most homeowners don't know the difference until they're already replacing a system.
        </div>
        <div style={{...captionBase, fontSize: 44, fontWeight: 700, color: RED, opacity: fi(f, 25)}}>
          By then, it's too late to think it through.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── FIX (18 – 37 s) — rolling caption points ─────────────────────────────────
const FIX_POINTS = [
  {from:   0, dur: 105, text: 'A heat pump heats AND cools —\none system, year-round.'},
  {from: 105, dur:  75, text: 'Central AC only cools.'},
  {from: 180, dur: 150, text: 'In South Jersey, heat pumps work well most of the year\nbut can struggle on the coldest days.'},
  {from: 330, dur: 120, text: 'Already have gas heat?\nA hybrid setup might be your best move.'},
  {from: 450, dur: 120, text: 'Starting fresh?\nA heat pump could save you every month.'},
];

const FixCaption: React.FC<{text: string; dur: number}> = ({text, dur}) => {
  const f = useCurrentFrame();
  return (
    <div style={{...captionBase, opacity: Math.min(fi(f, 0, 8), fo(f, dur, 8)), whiteSpace: 'pre-line'}}>
      {text}
    </div>
  );
};

const FixBeat: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: Math.min(fi(f, 0, 10), fo(f, FIX_DUR))}}>
      <BgVideo src={CLIPS.fix} />
      <DimOverlay />
      <BottomGradient />
      <AbsoluteFill style={{display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 56px 130px'}}>
        {FIX_POINTS.map((pt) => (
          <Sequence key={pt.from} from={pt.from} durationInFrames={pt.dur}>
            <FixCaption text={pt.text} dur={pt.dur} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── CTA end card (37 – 45 s) ──────────────────────────────────────────────────
const CTABeat: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: BLACK, opacity: fi(f, 0, 18)}}>
      <AbsoluteFill style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap: 36, padding:'0 60px'}}>

        <div style={{opacity: fi(f, 0, 20)}}>
          <Img src={staticFile('logo.png')} style={{width: 380, objectFit: 'contain'}} />
        </div>

        <div style={{opacity: fi(f, 15, 15), textAlign:'center'}}>
          <div style={{fontFamily:'system-ui, sans-serif', fontSize: 48, fontWeight: 800, color: WHITE, lineHeight: 1.2}}>
            Not sure which is right for your home?
          </div>
          <div style={{fontFamily:'system-ui, sans-serif', fontSize: 34, fontWeight: 600, color:'rgba(255,255,255,0.8)', marginTop: 12, lineHeight: 1.3}}>
            We'll walk you through it — no pressure.
          </div>
        </div>

        <div style={{opacity: fi(f, 30, 15), background: RED, borderRadius: 20, padding:'28px 52px', textAlign:'center'}}>
          <div style={{fontFamily:'system-ui, sans-serif', fontSize: 52, fontWeight: 900, color: WHITE, letterSpacing:'0.02em'}}>
            856-856-4859
          </div>
          <div style={{fontFamily:'system-ui, sans-serif', fontSize: 30, fontWeight: 600, color:'rgba(255,255,255,0.9)', marginTop: 8}}>
            callgood2go.com
          </div>
        </div>

      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Root ──────────────────────────────────────────────────────────────────────
export const HeatPumpVideo: React.FC = () => (
  <AbsoluteFill style={{background: BLACK}}>
    <Sequence from={HOOK_START} durationInFrames={HOOK_DUR}>
      <HookBeat />
    </Sequence>
    <Sequence from={PROB_START} durationInFrames={PROB_DUR}>
      <ProblemBeat />
    </Sequence>
    <Sequence from={FIX_START} durationInFrames={FIX_DUR}>
      <FixBeat />
    </Sequence>
    <Sequence from={CTA_START} durationInFrames={CTA_DUR}>
      <CTABeat />
    </Sequence>
  </AbsoluteFill>
);
