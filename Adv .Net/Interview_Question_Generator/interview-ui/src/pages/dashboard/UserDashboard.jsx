import { useState, useEffect, useCallback, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import Sidebar from "../../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon  from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon  from "@mui/icons-material/ArrowForwardIos";
import ComputerIcon         from "@mui/icons-material/Computer";
import SmartToyIcon         from "@mui/icons-material/SmartToy";
import QuizIcon             from "@mui/icons-material/Quiz";
import MenuBookIcon         from "@mui/icons-material/MenuBook";
import EmojiEventsIcon      from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon       from "@mui/icons-material/TrendingUp";
import BoltIcon             from "@mui/icons-material/Bolt";
import AutoAwesomeIcon      from "@mui/icons-material/AutoAwesome";
import HubIcon              from "@mui/icons-material/Hub";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg:      "#030712",
  panel:   "#0a1628",
  panelHi: "#0d1f3c",
  panelLo: "#070f1e",
  border:  "rgba(34,211,238,0.15)",
  cyan:    "#22d3ee",
  cyanLt:  "#67e8f9",
  magenta: "#d946ef",
  magLt:   "#e879f9",
  violet:  "#818cf8",
  emerald: "#34d399",
  amber:   "#fbbf24",
  white:   "#e0f2fe",
  sky:     "#7dd3fc",
  muted:   "#475569",
};

// ─── Floating node particles (like pink dots in the image) ────────────────────
function NeuralNodes() {
  const nodes = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    dur: Math.random() * 10 + 8,
    delay: Math.random() * 8,
    color: i % 3 === 0 ? T.magenta : i % 3 === 1 ? T.cyan : T.violet,
  }));

  return (
    <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {nodes.map((n) => (
        <motion.div key={n.id}
          style={{
            position: "absolute", left: `${n.x}%`, top: `${n.y}%`,
            width: n.size, height: n.size, borderRadius: "50%",
            background: n.color,
            boxShadow: `0 0 ${n.size * 4}px ${n.color}, 0 0 ${n.size * 8}px ${n.color}50`,
          }}
          animate={{ y: [0, -35, 0], opacity: [0.7, 0.2, 0.7], scale: [1, 1.5, 1] }}
          transition={{ duration: n.dur, delay: n.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </Box>
  );
}

// ─── Circuit trace lines (like board traces in the image) ─────────────────────
function CircuitTraces() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 0, opacity: 0.07 }}
      viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      {/* Horizontal traces */}
      {[120, 240, 380, 520, 640, 720].map((y, i) => (
        <motion.path key={`h${i}`}
          d={`M 0 ${y} L ${200 + i * 80} ${y} L ${220 + i * 80} ${y + (i % 2 === 0 ? 40 : -40)} L ${400 + i * 60} ${y + (i % 2 === 0 ? 40 : -40)} L ${420 + i * 60} ${y} L 1200 ${y}`}
          fill="none" stroke={i % 2 === 0 ? T.cyan : T.magenta} strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 0.8, 0.8, 0] }}
          transition={{ duration: 6 + i, delay: i * 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Vertical traces */}
      {[150, 350, 600, 850, 1050].map((x, i) => (
        <motion.path key={`v${i}`}
          d={`M ${x} 0 L ${x} ${150 + i * 30} L ${x + (i % 2 === 0 ? 30 : -30)} ${170 + i * 30} L ${x + (i % 2 === 0 ? 30 : -30)} ${350 + i * 40} L ${x} ${370 + i * 40} L ${x} 800`}
          fill="none" stroke={i % 2 === 0 ? T.violet : T.cyan} strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1], opacity: [0, 0.6, 0.6, 0] }}
          transition={{ duration: 8 + i * 1.5, delay: i * 0.8 + 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Node connection circles */}
      {[[200, 240], [420, 380], [600, 120], [850, 520], [1050, 380]].map(([cx, cy], i) => (
        <motion.circle key={`node${i}`} cx={cx} cy={cy} r="4"
          fill={i % 2 === 0 ? T.magenta : T.cyan}
          animate={{ r: [4, 7, 4], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 3, delay: i * 0.7, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

// ─── Central sphere glow ──────────────────────────────────────────────────────
function SphereGlow() {
  return (
    <>
      {/* Main cyan sphere bloom */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{ position: "fixed", top: "5%", left: "50%", transform: "translateX(-50%)",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(34,211,238,0.22) 0%, rgba(34,211,238,0.08) 40%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }}
      />
      {/* Magenta bottom bloom */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{ position: "fixed", bottom: "-5%", right: "10%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(217,70,239,0.2) 0%, transparent 65%)",
          filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }}
      />
      {/* Violet left bloom */}
      <motion.div
        animate={{ opacity: [0.1, 0.22, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        style={{ position: "fixed", top: "40%", left: "-5%",
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 65%)",
          filter: "blur(55px)", pointerEvents: "none", zIndex: 0 }}
      />
      {/* Bottom horizon line */}
      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        style={{ position: "fixed", bottom: 0, left: "5%", right: "5%", height: 1,
          background: `linear-gradient(90deg, transparent, ${T.violet}, ${T.cyan}, ${T.magenta}, ${T.cyan}, ${T.violet}, transparent)`,
          boxShadow: `0 0 40px 6px ${T.cyan}40`,
          pointerEvents: "none", zIndex: 0 }}
      />
    </>
  );
}

// ─── Corner bracket decoration (circuit pad style) ────────────────────────────
function CornerBrackets({ color = T.cyan, size = 16, thickness = 1.5 }) {
  const s = { position: "absolute", width: size, height: size };
  const b = `${thickness}px solid ${color}`;
  return (
    <>
      <Box sx={{ ...s, top: 8, left: 8, borderTop: b, borderLeft: b, opacity: 0.7 }} />
      <Box sx={{ ...s, top: 8, right: 8, borderTop: b, borderRight: b, opacity: 0.7 }} />
      <Box sx={{ ...s, bottom: 8, left: 8, borderBottom: b, borderLeft: b, opacity: 0.7 }} />
      <Box sx={{ ...s, bottom: 8, right: 8, borderBottom: b, borderRight: b, opacity: 0.7 }} />
    </>
  );
}

// ─── Mini SVG area chart ──────────────────────────────────────────────────────
function AreaChart({ color, data }) {
  const w = 88, h = 36;
  const max = Math.max(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4)}`).join(" ");
  const id = `ngc${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={w} height={h}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`${pts} ${w},${h} 0,${h}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 5px ${color})` }} />
      {/* Animated scan line */}
      <motion.line x1="0" y1={h / 2} x2={w} y2={h / 2}
        stroke={color} strokeWidth="0.5" opacity="0.4"
        animate={{ y1: [0, h, 0], y2: [0, h, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, delta, color, data, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 160, damping: 18 }}
      whileHover={{ y: -6, transition: { type: "spring", stiffness: 400 } }}>
      <Box sx={{
        background: `linear-gradient(145deg, ${T.panelHi} 0%, ${T.panel} 100%)`,
        border: `1px solid ${T.border}`,
        borderRadius: "14px", p: "16px 18px", minWidth: 185,
        position: "relative", overflow: "hidden",
        transition: "border-color 0.3s, box-shadow 0.3s",
        "&:hover": {
          borderColor: `${color}50`,
          boxShadow: `0 12px 40px ${color}20, 0 0 0 1px ${color}15`,
        },
        "&::before": {
          content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          boxShadow: `0 0 12px ${color}`,
        },
      }}>
        <CornerBrackets color={color} size={12} />

        <Box sx={{ display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", mb: 1.2 }}>
          <Box>
            <Typography sx={{ fontSize: "0.62rem", color: T.muted, letterSpacing: "0.15em",
              textTransform: "uppercase", fontFamily: "'Share Tech Mono', monospace", mb: 0.4 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: "1.85rem", fontWeight: 900, color: T.white,
              fontFamily: "'Exo 2', sans-serif", lineHeight: 1,
              textShadow: `0 0 20px ${color}60` }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ width: 36, height: 36, borderRadius: "10px",
            background: `${color}18`, border: `1px solid ${color}40`,
            display: "flex", alignItems: "center", justifyContent: "center", color,
            boxShadow: `0 0 14px ${color}30`,
            "& svg": { fontSize: "1.1rem" } }}>
            {icon}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ px: 1.2, py: "3px", borderRadius: "6px",
            background: `${T.emerald}15`, border: `1px solid ${T.emerald}35` }}>
            <Typography sx={{ fontSize: "0.68rem", color: T.emerald, fontWeight: 700,
              fontFamily: "'Share Tech Mono', monospace" }}>
              {delta}
            </Typography>
          </Box>
          <AreaChart color={color} data={data} />
        </Box>
      </Box>
    </motion.div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  { title: "Generate Questions", desc: "AI crafts tailored interview questions for your role and level",  icon: <ComputerIcon />,    path: "/generate",         color: T.cyan,    badge: "AI"   },
  { title: "AI Chatbot",         desc: "Real-time AI assistant to clear any interview doubt instantly",   icon: <SmartToyIcon />,    path: "/chatbot",          color: T.magenta, badge: "Live" },
  { title: "Quiz Mode",          desc: "Adaptive timed quizzes that target your weakest skill areas",     icon: <QuizIcon />,        path: "/user/tests",       color: T.violet,  badge: "Hot"  },
  { title: "Resources",          desc: "Handpicked articles, videos and cheat sheets by top mentors",    icon: <MenuBookIcon />,    path: "/user/resources",        color: T.amber,   badge: "New"  },
  { title: "Performance",        desc: "Deep analytics — accuracy, speed, topic heatmap and streaks",    icon: <TrendingUpIcon />,  path: "/user/performance", color: T.emerald, badge: "Pro"  },
];

const INTERVAL = 3500;

const cardV = {
  enter:  (d) => ({ opacity: 0, x: d > 0 ? 100 : -100, scale: 0.86, filter: "blur(6px)" }),
  center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
  exit:   (d) => ({ opacity: 0, x: d > 0 ? -100 : 100, scale: 0.86, filter: "blur(6px)" }),
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function UserDashboard() {
  const [index, setIndex]   = useState(0);
  const [dir, setDir]       = useState(1);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const next = useCallback(() => {
    setDir(1); setIndex(p => (p + 1) % features.length);
  }, []);

  const prev = useCallback(() => {
    setDir(-1); setIndex(p => p === 0 ? features.length - 1 : p - 1);
  }, []);

  const goTo = (i) => {
    setDir(i > index ? 1 : -1); setIndex(i);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  const visible = [
    features[index],
    features[(index + 1) % features.length],
    features[(index + 2) % features.length],
  ];

  const stats = [
    { icon: <TrendingUpIcon />,  label: "Questions Solved", value: "1,247", delta: "↑ +12 today",  color: T.cyan,    delay: 0.14, data: [30,45,40,60,55,72,68,85,80,100] },
    { icon: <QuizIcon />,        label: "Quiz Accuracy",    value: "84%",   delta: "↑ +3% week",   color: T.violet,  delay: 0.22, data: [55,58,62,60,68,66,74,72,80,84]  },
    { icon: <BoltIcon />,        label: "Day Streak",       value: "14",    delta: "🔥 On fire",    color: T.amber,   delay: 0.30, data: [2,3,5,6,7,8,9,10,12,14]         },
    { icon: <AutoAwesomeIcon />, label: "AI Score",         value: "9.2",   delta: "↑ +0.4 today", color: T.magenta, delay: 0.38, data: [6.5,7,7.5,7.8,8.2,8,8.6,8.9,9.1,9.2] },
  ];

  const username = localStorage.getItem("name");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: T.bg,
      position: "relative", overflow: "hidden",
      fontFamily: "'Exo 2', sans-serif" }}>

      {/* ── Atmosphere ── */}
      <SphereGlow />
      <CircuitTraces />
      <NeuralNodes />

      {/* Sidebar */}
      <Box sx={{ position: "relative", zIndex: 20 }}><Sidebar /></Box>

      {/* ── Main ── */}
      <Box sx={{ flex: 1, p: { xs: 2, md: "30px 36px" },
        position: "relative", zIndex: 5, overflow: "auto" }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <Box sx={{ display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", mb: 4 }}>
            <Box>
              {/* Breadcrumb */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, mb: 1 }}>
                <HubIcon sx={{ fontSize: "0.8rem", color: T.cyan }} />
                {/* <Typography sx={{ color: T.muted, fontSize: "0.7rem",
                  fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em" }}>
                  NEURAL_NET
                </Typography>
                <Typography sx={{ color: T.muted, fontSize: "0.7rem" }}>/</Typography>
                <Typography sx={{ color: T.cyan, fontSize: "0.7rem",
                  fontFamily: "'Share Tech Mono', monospace", fontWeight: 600,
                  letterSpacing: "0.1em" }}>
                  DASHBOARD
                </Typography> */}
              </Box>

              {/* Main heading */}
              <Typography variant="h3" sx={{
                fontFamily: "'Exo 2', sans-serif", fontWeight: 900,
                fontSize: { xs: "2rem", md: "2.7rem" }, lineHeight: 1.1, mb: 1,
                background: `linear-gradient(115deg, ${T.white} 0%, ${T.cyanLt} 40%, ${T.magLt} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Hi {username}
              </Typography>

              {/* <Typography sx={{ color: T.sky, fontSize: "1rem",
                fontFamily: "'Exo 2', sans-serif", fontWeight: 400, maxWidth: 440,
                lineHeight: 1.6 }}>
                Neural systems online. Ready to train with{" "}
                <Box component="span" sx={{ color: T.cyan, fontWeight: 700,
                  textShadow: `0 0 16px ${T.cyan}` }}>
                  IQG AI
                </Box>
                ?
              </Typography> */}
            </Box>

            {/* System status badge */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2,
                px: 2.2, py: 1.1, borderRadius: "12px",
                background: `linear-gradient(135deg, ${T.cyan}15, ${T.magenta}10)`,
                border: `1px solid ${T.cyan}35`,
                boxShadow: `0 0 24px ${T.cyan}15`,
                position: "relative", overflow: "hidden",
              }}>
                <CornerBrackets color={T.cyan} size={8} thickness={1} />
                {/* Pulsing active dot */}
                {/* <Box sx={{ position: "relative" }}>
                  <motion.div
                    animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: "absolute", inset: 0, borderRadius: "50%",
                      background: T.emerald }}
                  /> */}
                  {/* <Box sx={{ width: 8, height: 8, borderRadius: "50%",
                    background: T.emerald,
                    boxShadow: `0 0 8px ${T.emerald}` }} />
                </Box> */}
                {/* <Typography sx={{ fontSize: "0.72rem", color: T.cyanLt,
                  fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.1em" }}>
                  SYS_ONLINE
                </Typography>
                <Box sx={{ px: 1, py: "2px", borderRadius: "5px",
                  background: T.cyan, fontSize: "0.58rem",
                  color: T.bg, fontWeight: 900,
                  fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.08em" }}>
                  v2.4
                </Box> */}
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
          {stats.map(s => <StatCard key={s.label} {...s} />)}
        </Box> */}

        {/* ── FEATURE CAROUSEL ── */}
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.65 }}>
          <Box
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            sx={{
              background: `linear-gradient(145deg, ${T.panelHi} 0%, ${T.panel} 100%)`,
              border: `1px solid ${T.border}`,
              borderRadius: "18px", p: { xs: "20px 16px", md: "26px 30px" },
              position: "relative", overflow: "visible",
              boxShadow: `0 4px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(34,211,238,0.06)`,
              "&::before": {
                content: '""', position: "absolute", top: 0,
                left: "8%", right: "8%", height: "1.5px", borderRadius: 1,
                background: `linear-gradient(90deg, transparent, ${T.cyan}80, ${T.violet}70, ${T.magenta}60, transparent)`,
                boxShadow: `0 0 12px ${T.cyan}40`,
              },
            }}>

            <CornerBrackets color={T.cyan} size={18} thickness={1.5} />

            {/* Panel header */}
            <Box sx={{ display: "flex", alignItems: "center",
              justifyContent: "space-between", mb: 3.5 }}>
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: "50%",
                    background: T.cyan, boxShadow: `0 0 8px ${T.cyan}` }} />
                  <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.62rem", color: T.cyan, letterSpacing: "0.15em" }}>
                    MODULE_SELECT
                  </Typography>
                </Box>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800,
                  fontSize: "1.2rem", color: T.white, letterSpacing: "-0.01em" }}>
                  Explore Features
                </Typography>
                <Typography sx={{ fontSize: "0.82rem", color: T.sky,
                  fontFamily: "'Exo 2', sans-serif", mt: 0.3 }}>
                  AI-powered tools to master every interview
                </Typography>
              </Box>

             
            </Box>

            {/* Arrows */}
            {[
              { fn: prev, sx: { left: -20 }, color: T.cyan },
              { fn: next, sx: { right: -20 }, color: T.magenta },
            ].map(({ fn, sx: pos, color }, idx) => (
              <IconButton key={idx}
                onClick={() => { setPaused(true); fn(); setTimeout(() => setPaused(false), 4000); }}
                component={motion.button}
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                sx={{
                  position: "absolute", ...pos, top: "50%", transform: "translateY(-50%)",
                  background: `linear-gradient(135deg, ${T.panelHi}, ${T.panel})`,
                  border: `1px solid ${color}40`, color, width: 38, height: 38, zIndex: 10,
                  boxShadow: `0 0 16px ${color}25`,
                  "&:hover": {
                    borderColor: `${color}80`,
                    boxShadow: `0 0 28px ${color}50, 0 0 0 1px ${color}30`,
                  },
                }}>
                {idx === 0
                  ? <ArrowBackIosNewIcon sx={{ fontSize: 13 }} />
                  : <ArrowForwardIosIcon sx={{ fontSize: 13 }} />}
              </IconButton>
            ))}

            {/* Feature Cards */}
            <Box sx={{ display: "flex", gap: 2.5, justifyContent: "center",
              overflow: "visible", minHeight: 248 }}>
              <AnimatePresence mode="popLayout" custom={dir}>
                {visible.map((f, i) => (
                  <motion.div key={`${f.title}-${index}`}
                    custom={dir} variants={cardV}
                    initial="enter" animate="center" exit="exit"
                    transition={{ duration: 0.42, delay: i * 0.07,
                      ease: [0.25, 0.46, 0.45, 0.94] }}
                    whileHover={{ y: -12, transition: { type: "spring", stiffness: 300 } }}
                    style={{ flex: "0 0 auto" }}>
                    <Box onClick={() => navigate(f.path)} sx={{
                      width: { xs: 165, md: 218 },
                      height: { xs: 228, md: 245 },
                      cursor: "pointer",
                      background: `linear-gradient(155deg, ${T.panelLo} 0%, ${T.panel} 100%)`,
                      border: `1px solid ${f.color}20`,
                      borderRadius: "16px",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center",
                      p: 3, position: "relative", overflow: "hidden",
                      transition: "all 0.32s",
                      "&:hover": {
                        borderColor: `${f.color}55`,
                        boxShadow: `0 20px 55px ${f.color}25, 0 0 0 1px ${f.color}20`,
                        background: `linear-gradient(155deg, ${f.color}0e 0%, ${T.panel} 100%)`,
                        "& .ic": {
                          transform: "scale(1.12) translateY(-3px)",
                          boxShadow: `0 0 0 10px ${f.color}12, 0 0 28px ${f.color}40`,
                        },
                        "& .cta": { opacity: 1, transform: "translateY(0)" },
                        "& .bdg": { opacity: 1 },
                        "& .scan": { opacity: 1 },
                      },
                      "&::after": {
                        content: '""', position: "absolute", top: 0, right: 0,
                        width: 90, height: 90,
                        background: `radial-gradient(circle at top right, ${f.color}16, transparent 65%)`,
                      },
                    }}>

                      {/* Scan line on hover */}
                      <motion.div className="scan"
                        animate={{ y: ["0%", "100%", "0%"] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        style={{ position: "absolute", left: 0, right: 0, height: 1,
                          background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)`,
                          opacity: 0, transition: "opacity 0.3s", pointerEvents: "none" }}
                      />

                      {/* Top glow line */}
                      <Box sx={{ position: "absolute", top: 0, left: "15%", right: "15%",
                        height: "2px",
                        background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                        boxShadow: `0 0 10px ${f.color}` }} />

                      {/* Corner brackets */}
                      <CornerBrackets color={f.color} size={10} thickness={1} />

                      {/* Badge */}
                      <Box className="bdg" sx={{ position: "absolute", top: 12, left: 12,
                        px: "8px", py: "3px", borderRadius: "5px",
                        background: `${f.color}20`, border: `1px solid ${f.color}45`,
                        opacity: 0.5, transition: "opacity 0.25s" }}>
                        <Typography sx={{ fontSize: "0.58rem", color: f.color, fontWeight: 800,
                          letterSpacing: "0.12em",
                          fontFamily: "'Share Tech Mono', monospace" }}>
                          {f.badge}
                        </Typography>
                      </Box>

                      {/* Icon */}
                      <Box className="ic" sx={{ width: 64, height: 64,
                        borderRadius: "16px", mb: 2,
                        background: `linear-gradient(135deg, ${f.color}22, ${f.color}08)`,
                        border: `1.5px solid ${f.color}45`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: f.color, transition: "all 0.32s",
                        boxShadow: `0 4px 16px ${f.color}20, inset 0 1px 0 ${f.color}20`,
                        "& svg": { fontSize: "1.75rem" } }}>
                        {f.icon}
                      </Box>

                      {/* Title */}
                      <Typography sx={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800,
                        fontSize: "0.95rem", textAlign: "center", color: T.white,
                        lineHeight: 1.25, mb: 0.7, letterSpacing: "-0.01em" }}>
                        {f.title}
                      </Typography>

                      {/* Desc */}
                      <Typography sx={{ textAlign: "center", color: T.sky,
                        fontSize: "0.76rem", fontFamily: "'Exo 2', sans-serif",
                        lineHeight: 1.5, mb: 1.8, px: 0.5 }}>
                        {f.desc}
                      </Typography>

                      {/* CTA */}
                      <Box className="cta" sx={{ display: "flex", alignItems: "center",
                        gap: 0.6, px: 2, py: "6px", borderRadius: "8px",
                        background: `${f.color}18`, border: `1px solid ${f.color}45`,
                        opacity: 0, transform: "translateY(8px)",
                        transition: "opacity 0.3s, transform 0.3s",
                        boxShadow: `0 0 14px ${f.color}25` }}>
                        <Typography sx={{ fontSize: "0.62rem", color: f.color, fontWeight: 800,
                          letterSpacing: "0.15em", textTransform: "uppercase",
                          fontFamily: "'Share Tech Mono', monospace" }}>
                          LAUNCH
                        </Typography>
                        <Typography sx={{ color: f.color, fontSize: "0.8rem" }}>→</Typography>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Box>

            {/* Progress bar + dots */}
            <Box sx={{ mt: 3 }}>
              <Box sx={{ height: 2, borderRadius: 99,
                background: `rgba(34,211,238,0.1)`, mb: 2, overflow: "hidden" }}>
                <motion.div key={index}
                  initial={{ width: "0%" }}
                  animate={{ width: paused ? undefined : "100%" }}
                  transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                  style={{ height: "100%", borderRadius: 99,
                    background: `linear-gradient(90deg, ${T.cyan}, ${T.magenta})`,
                    boxShadow: `0 0 10px ${T.cyan}80` }}
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                {features.map((f, i) => (
                  <motion.div key={i}
                    animate={{ width: i === index ? 28 : 7, opacity: i === index ? 1 : 0.22 }}
                    transition={{ duration: 0.35, type: "spring", stiffness: 300 }}
                    onClick={() => { setPaused(true); goTo(i); setTimeout(() => setPaused(false), 4000); }}
                    style={{ height: 7, borderRadius: 99, cursor: "pointer",
                      background: i === index
                        ? `linear-gradient(90deg, ${T.cyan}, ${T.magenta})`
                        : T.muted,
                      boxShadow: i === index ? `0 0 10px ${T.cyan}80` : "none" }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
// import { useState, useEffect, useCallback } from "react";
// import { Box, Typography, IconButton } from "@mui/material";
// import Sidebar from "../../components/Sidebar";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIosNewIcon  from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon  from "@mui/icons-material/ArrowForwardIos";
// import ComputerIcon         from "@mui/icons-material/Computer";
// import SmartToyIcon         from "@mui/icons-material/SmartToy";
// import QuizIcon             from "@mui/icons-material/Quiz";
// import MenuBookIcon         from "@mui/icons-material/MenuBook";
// import EmojiEventsIcon      from "@mui/icons-material/EmojiEvents";
// import TrendingUpIcon       from "@mui/icons-material/TrendingUp";
// import AutoAwesomeIcon      from "@mui/icons-material/AutoAwesome";
// import BoltIcon             from "@mui/icons-material/Bolt";

// // ─── Design tokens ───────────────────────────────────────────────────────────
// const T = {
//   bg:       "#111827",
//   panel:    "#1f2937",
//   panelLo:  "#1a2030",
//   panelHi:  "#273449",
//   border:   "rgba(129,140,248,0.15)",
//   indigo:   "#818cf8",
//   violet:   "#a78bfa",
//   emerald:  "#34d399",
//   rose:     "#f472b6",
//   orange:   "#fb923c",
//   sky:      "#38bdf8",
//   amber:    "#fbbf24",
//   white:    "#f9fafb",
//   grey:     "#9ca3af",
//   muted:    "#6b7280",
// };

// // ─── Ambient background blobs ─────────────────────────────────────────────────
// function AmbientBg() {
//   return (
//     <>
//       {[
//         { l:"-8%",  t:"-12%", w:520, c:`${T.violet}22`, dur:16, dx:30, dy:40 },
//         { l:"62%",  t:"5%",   w:420, c:`${T.sky}18`,    dur:20, dx:-28, dy:45 },
//         { l:"15%",  t:"58%",  w:380, c:`${T.emerald}14`,dur:14, dx:35, dy:-28 },
//         { l:"72%",  t:"55%",  w:320, c:`${T.rose}14`,   dur:18, dx:-30, dy:-32 },
//       ].map((b, i) => (
//         <motion.div key={i}
//           animate={{ x:[0,b.dx,-b.dx*0.4,0], y:[0,b.dy,-b.dy*0.5,0], scale:[1,1.08,0.96,1] }}
//           transition={{ duration:b.dur, repeat:Infinity, ease:"easeInOut", delay:i*2.2 }}
//           style={{ position:"fixed", left:b.l, top:b.t, width:b.w, height:b.w, borderRadius:"50%",
//             background:`radial-gradient(circle, ${b.c} 0%, transparent 70%)`,
//             filter:"blur(65px)", pointerEvents:"none", zIndex:0 }}
//         />
//       ))}
//       {/* Bottom horizon glow */}
//       <motion.div
//         animate={{ opacity:[0.4, 0.7, 0.4] }}
//         transition={{ duration:4, repeat:Infinity }}
//         style={{ position:"fixed", bottom:0, left:"15%", right:"15%", height:1,
//           background:`linear-gradient(90deg, transparent, ${T.violet}, ${T.indigo}, ${T.sky}, ${T.indigo}, ${T.violet}, transparent)`,
//           boxShadow:`0 0 50px 6px ${T.violet}40`, pointerEvents:"none", zIndex:0 }}
//       />
//     </>
//   );
// }

// // ─── Dot grid ─────────────────────────────────────────────────────────────────
// function DotGrid() {
//   return (
//     <Box sx={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0,
//       backgroundImage:`radial-gradient(circle, rgba(129,140,248,0.1) 1px, transparent 1px)`,
//       backgroundSize:"36px 36px" }} />
//   );
// }

// // ─── Mini SVG area chart ──────────────────────────────────────────────────────
// function AreaChart({ color, data }) {
//   const w=96, h=38, max=Math.max(...data);
//   const pts = data.map((v,i)=>`${(i/(data.length-1))*w},${h-(v/max)*(h-5)}`).join(" ");
//   const id = `g${color.replace(/[^a-z0-9]/gi,"")}`;
//   return (
//     <svg width={w} height={h}>
//       <defs>
//         <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={color} stopOpacity="0.5"/>
//           <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
//         </linearGradient>
//       </defs>
//       <polygon points={`${pts} ${w},${h} 0,${h}`} fill={`url(#${id})`} />
//       <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
//         strokeLinecap="round" strokeLinejoin="round"
//         style={{ filter:`drop-shadow(0 0 4px ${color}80)` }} />
//     </svg>
//   );
// }

// // ─── Stat card ────────────────────────────────────────────────────────────────
// function StatCard({ icon, label, value, delta, color, data, delay }) {
//   return (
//     <motion.div
//       initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
//       transition={{ delay, type:"spring", stiffness:180, damping:18 }}
//       whileHover={{ y:-5, transition:{ type:"spring", stiffness:400, damping:18 } }}>
//       <Box sx={{
//         background:`linear-gradient(145deg, ${T.panelHi} 0%, ${T.panel} 100%)`,
//         border:`1px solid ${T.border}`, borderRadius:"14px",
//         p:"16px 18px", minWidth:188, position:"relative", overflow:"hidden",
//         transition:"border-color 0.3s, box-shadow 0.3s",
//         "&:hover": { borderColor:`${color}45`, boxShadow:`0 10px 36px ${color}20` },
//         "&::before":{ content:'""', position:"absolute", top:0, left:0, right:0, height:"2px",
//           background:`linear-gradient(90deg, transparent, ${color}90, transparent)` },
//       }}>
//         <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:1.2 }}>
//           <Box>
//             <Typography sx={{ fontSize:"0.68rem", color:T.muted, letterSpacing:"0.1em",
//               textTransform:"uppercase", fontFamily:"'Inter Tight', sans-serif", mb:0.4 }}>
//               {label}
//             </Typography>
//             <Typography sx={{ fontSize:"1.8rem", fontWeight:900, color:T.white,
//               fontFamily:"'Lexend', sans-serif", lineHeight:1,
//               textShadow:`0 0 20px ${color}50` }}>
//               {value}
//             </Typography>
//           </Box>
//           <Box sx={{ width:36, height:36, borderRadius:"10px", background:`${color}18`,
//             border:`1px solid ${color}35`, display:"flex", alignItems:"center",
//             justifyContent:"center", color, "& svg":{ fontSize:"1.1rem" } }}>
//             {icon}
//           </Box>
//         </Box>
//         <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
//           <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
//             background:`${T.emerald}18`, border:`1px solid ${T.emerald}30` }}>
//             <Typography sx={{ fontSize:"0.72rem", color:T.emerald, fontWeight:700,
//               fontFamily:"'Inter Tight', sans-serif" }}>
//               {delta}
//             </Typography>
//           </Box>
//           <AreaChart color={color} data={data} />
//         </Box>
//       </Box>
//     </motion.div>
//   );
// }

// // ─── Features ─────────────────────────────────────────────────────────────────
// const features = [
//   { title:"Generate Questions", desc:"AI crafts personalised interview questions instantly",       icon:<ComputerIcon />,    path:"/generate",         color:T.indigo,  badge:"AI"   },
//   { title:"AI Chatbot",         desc:"Chat with our AI to clear any interview doubt fast",         icon:<SmartToyIcon />,    path:"/chatbot",          color:T.violet,  badge:"Live" },
//   { title:"Quiz Mode",          desc:"Timed smart quizzes that adapt to your weak areas",          icon:<QuizIcon />,        path:"/user/tests",       color:T.sky,     badge:"Hot"  },
//   { title:"Resources",          desc:"Handpicked reading lists, videos & cheat sheets",            icon:<MenuBookIcon />,    path:"/resources",        color:T.amber,   badge:"New"  },
//   { title:"Leaderboard",        desc:"Compete globally and track where you stand today",           icon:<EmojiEventsIcon />, path:"/user/leaderboard", color:T.rose,    badge:"🏆"   },
//   { title:"Performance",        desc:"Deep analytics — accuracy, speed, topic coverage",           icon:<TrendingUpIcon />,  path:"/user/performance", color:T.emerald, badge:"Pro"  },
// ];

// const SLIDE_INTERVAL = 3500; // ms — auto-rotate every 3.5s

// const cardV = {
//   enter:  (d) => ({ opacity:0, x: d>0 ? 90:-90, scale:0.88, filter:"blur(5px)" }),
//   center: { opacity:1, x:0, scale:1, filter:"blur(0px)" },
//   exit:   (d) => ({ opacity:0, x: d>0 ? -90:90, scale:0.88, filter:"blur(5px)" }),
// };

// // ─── Dashboard ────────────────────────────────────────────────────────────────
// export default function UserDashboard() {
//   const [index, setIndex]         = useState(0);
//   const [direction, setDirection] = useState(1);
//   const [paused, setPaused]       = useState(false);
//   const navigate = useNavigate();

//   const next = useCallback(() => {
//     setDirection(1);
//     setIndex(p => (p + 1) % features.length);
//   }, []);

//   const prev = useCallback(() => {
//     setDirection(-1);
//     setIndex(p => p === 0 ? features.length - 1 : p - 1);
//   }, []);

//   const goTo = (i) => {
//     setDirection(i > index ? 1 : -1);
//     setIndex(i);
//   };

//   // Auto-rotate
//   useEffect(() => {
//     if (paused) return;
//     const id = setInterval(next, SLIDE_INTERVAL);
//     return () => clearInterval(id);
//   }, [paused, next]);

//   const visible = [
//     features[index],
//     features[(index + 1) % features.length],
//     features[(index + 2) % features.length],
//   ];

//   const stats = [
//     { icon:<TrendingUpIcon />, label:"Questions Solved", value:"1,247", delta:"↑ +12 today",    color:T.indigo,  delay:0.15, data:[30,45,40,60,55,72,68,85,80,100] },
//     { icon:<QuizIcon />,       label:"Quiz Accuracy",    value:"84%",   delta:"↑ +3% week",     color:T.sky,     delay:0.23, data:[55,58,62,60,68,66,74,72,80,84]  },
//     { icon:<BoltIcon />,       label:"Day Streak",       value:"14",    delta:"🔥 On fire",      color:T.amber,   delay:0.31, data:[2,3,5,6,7,8,9,10,12,14]         },
//     { icon:<AutoAwesomeIcon />,label:"AI Score",         value:"9.2",   delta:"↑ +0.4 today",   color:T.emerald, delay:0.39, data:[6.5,7,7.5,7.8,8.2,8,8.6,8.9,9.1,9.2] },
//   ];

//   return (
//     <Box sx={{ display:"flex", minHeight:"100vh", background:T.bg,
//       position:"relative", overflow:"hidden", fontFamily:"'Inter Tight', sans-serif" }}>

//       <AmbientBg />
//       <DotGrid />

//       <Box sx={{ position:"relative", zIndex:20 }}><Sidebar /></Box>

//       {/* ── MAIN CONTENT ── */}
//       <Box sx={{ flex:1, p:{ xs:2, md:"32px 36px" }, position:"relative", zIndex:5, overflow:"auto" }}>

//         {/* ── HEADER ── */}
//         <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
//           transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}>
//           <Box sx={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", mb:4 }}>
//             <Box>
//               {/* Breadcrumb */}
//               <Box sx={{ display:"flex", alignItems:"center", gap:0.8, mb:1 }}>
//                 <Typography sx={{ color:T.muted, fontSize:"0.75rem",
//                   fontFamily:"'Inter Tight', sans-serif" }}>Pages</Typography>
//                 <Typography sx={{ color:T.muted, fontSize:"0.75rem" }}>/</Typography>
//                 <Typography sx={{ color:T.grey, fontSize:"0.75rem", fontWeight:600 }}>Dashboard</Typography>
//               </Box>

//               {/* Main heading — BIG */}
//               <Typography variant="h3" sx={{
//                 fontFamily:"'Lexend', sans-serif", fontWeight:900,
//                 fontSize:{ xs:"2rem", md:"2.6rem" }, lineHeight:1.1, mb:1,
//                 background:`linear-gradient(115deg, ${T.white} 0%, #c7d2fe 45%, ${T.violet} 100%)`,
//                 WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
//               }}>
//                 Hi Tanisha 👋
//               </Typography>

//               <Typography sx={{ color:T.grey, fontSize:"1rem",
//                 fontFamily:"'Inter Tight', sans-serif", fontWeight:500, maxWidth:420 }}>
//                 Ready to ace your next interview?{" "}
//                 <Box component="span" sx={{ color:T.indigo, fontWeight:700,
//                   textShadow:`0 0 14px ${T.indigo}60` }}>IQG AI</Box>
//                 {" "}has got you covered.
//               </Typography>
//             </Box>

//             {/* NEW badge */}
//             <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.97 }}>
//               <Box sx={{ display:"flex", alignItems:"center", gap:1, px:2.5, py:1.2,
//                 borderRadius:"24px",
//                 background:`linear-gradient(135deg, ${T.indigo}22, ${T.violet}18)`,
//                 border:`1px solid ${T.indigo}40`,
//                 boxShadow:`0 0 24px ${T.indigo}18`, cursor:"pointer" }}>
//                 <Box sx={{ px:1, py:"2px", borderRadius:"6px", background:T.indigo,
//                   fontSize:"0.6rem", color:"#fff", fontWeight:900,
//                   fontFamily:"'Lexend', sans-serif", letterSpacing:"0.08em" }}>NEW</Box>
//                 <Typography sx={{ fontSize:"0.78rem", color:"#c7d2fe",
//                   fontFamily:"'Inter Tight', sans-serif", fontWeight:600 }}>
//                   v2.4 beta is live →
//                 </Typography>
//               </Box>
//             </motion.div>
//           </Box>
//         </motion.div>

//         {/* ── STATS ROW ── */}
//         <Box sx={{ display:"flex", gap:2, mb:4, flexWrap:"wrap" }}>
//           {stats.map(s => <StatCard key={s.label} {...s} />)}
//         </Box>

//         {/* ── FEATURE CAROUSEL PANEL ── */}
//         <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
//           transition={{ delay:0.3, duration:0.65, ease:[0.22,1,0.36,1] }}>
//           <Box
//             onMouseEnter={() => setPaused(true)}
//             onMouseLeave={() => setPaused(false)}
//             sx={{
//               background:`linear-gradient(145deg, ${T.panelHi} 0%, ${T.panel} 100%)`,
//               border:`1px solid ${T.border}`, borderRadius:"18px",
//               p:{ xs:"20px 16px", md:"28px 32px" },
//               position:"relative", overflow:"visible",
//               boxShadow:`0 4px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)`,
//               "&::before":{ content:'""', position:"absolute", top:0, left:"8%", right:"8%",
//                 height:"1.5px", borderRadius:1,
//                 background:`linear-gradient(90deg, transparent, ${T.indigo}80, ${T.violet}70, ${T.sky}60, transparent)` },
//             }}>

//             {/* Panel header */}
//             <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", mb:3.5 }}>
//               <Box>
//                 <Typography variant="h5" sx={{
//                   fontFamily:"'Lexend', sans-serif", fontWeight:800,
//                   fontSize:"1.25rem", color:T.white, mb:0.3 }}>
//                   Explore Features
//                 </Typography>
//                 <Typography sx={{ fontSize:"0.85rem", color:T.grey,
//                   fontFamily:"'Inter Tight', sans-serif" }}>
//                   AI-powered tools to master every interview
//                 </Typography>
//               </Box>

//               {/* Filter tabs */}
//               <Box sx={{ display:"flex", gap:0.8 }}>
//                 {["All","AI","Practice"].map((tab, i) => (
//                   <Box key={tab} sx={{
//                     px:1.8, py:0.6, borderRadius:"8px", cursor:"pointer",
//                     background: i===0 ? T.indigo : "transparent",
//                     border:`1px solid ${i===0 ? T.indigo : T.border}`,
//                     transition:"all 0.2s",
//                     "&:hover":{ borderColor:`${T.indigo}60`,
//                       background: i!==0 ? `${T.indigo}15` : T.indigo },
//                   }}>
//                     <Typography sx={{ fontSize:"0.72rem", fontWeight:700,
//                       color: i===0 ? "#fff" : T.grey,
//                       fontFamily:"'Lexend', sans-serif", letterSpacing:"0.04em" }}>
//                       {tab}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>

//             {/* Arrows */}
//             {[
//               { fn:prev, side:"left",  pos:{ left:-20 }, color:T.indigo  },
//               { fn:next, side:"right", pos:{ right:-20 }, color:T.violet },
//             ].map(({ fn, pos, color }) => (
//               <IconButton key={JSON.stringify(pos)} onClick={() => { setPaused(true); fn(); setTimeout(()=>setPaused(false),4000); }}
//                 component={motion.button} whileHover={{ scale:1.15 }} whileTap={{ scale:0.9 }}
//                 sx={{ position:"absolute", ...pos, top:"50%", transform:"translateY(-50%)",
//                   background:`linear-gradient(135deg, ${T.panelHi}, ${T.panel})`,
//                   border:`1px solid ${color}35`, color, width:38, height:38, zIndex:10,
//                   boxShadow:`0 4px 20px rgba(0,0,0,0.4)`,
//                   "&:hover":{ borderColor:`${color}65`, boxShadow:`0 0 22px ${color}35` },
//                 }}>
//                 {pos.left !== undefined
//                   ? <ArrowBackIosNewIcon sx={{ fontSize:13 }} />
//                   : <ArrowForwardIosIcon sx={{ fontSize:13 }} />}
//               </IconButton>
//             ))}

//             {/* Cards */}
//             <Box sx={{ display:"flex", gap:2.5, justifyContent:"center", overflow:"visible", minHeight:240 }}>
//               <AnimatePresence mode="popLayout" custom={direction}>
//                 {visible.map((f, i) => (
//                   <motion.div key={`${f.title}-${index}`}
//                     custom={direction} variants={cardV}
//                     initial="enter" animate="center" exit="exit"
//                     transition={{ duration:0.42, delay:i*0.07, ease:[0.25,0.46,0.45,0.94] }}
//                     whileHover={{ y:-10, transition:{ type:"spring", stiffness:300, damping:18 } }}
//                     style={{ flex:"0 0 auto" }}>
//                     <Box onClick={() => navigate(f.path)} sx={{
//                       width:{ xs:160, md:215 }, height:{ xs:220, md:238 }, cursor:"pointer",
//                       background:`linear-gradient(155deg, ${T.panelLo} 0%, ${T.panel} 100%)`,
//                       border:`1px solid ${f.color}20`, borderRadius:"16px",
//                       display:"flex", flexDirection:"column",
//                       alignItems:"center", justifyContent:"center",
//                       p:3, position:"relative", overflow:"hidden",
//                       transition:"all 0.32s",
//                       "&:hover":{
//                         borderColor:`${f.color}50`,
//                         boxShadow:`0 18px 52px ${f.color}22, 0 0 0 1px ${f.color}18`,
//                         background:`linear-gradient(155deg, ${f.color}10 0%, ${T.panel} 100%)`,
//                         "& .ic":{ transform:"scale(1.1) translateY(-2px)",
//                           boxShadow:`0 0 0 10px ${f.color}10, 0 0 24px ${f.color}35` },
//                         "& .cta":{ opacity:1, transform:"translateY(0)" },
//                         "& .bdg":{ opacity:1 },
//                       },
//                       "&::after":{ content:'""', position:"absolute", top:0, right:0,
//                         width:90, height:90,
//                         background:`radial-gradient(circle at top right, ${f.color}14, transparent 65%)` },
//                     }}>
//                       {/* Top gradient line */}
//                       <Box sx={{ position:"absolute", top:0, left:"18%", right:"18%", height:"2px",
//                         background:`linear-gradient(90deg, transparent, ${f.color}90, transparent)` }} />

//                       {/* Badge */}
//                       <Box className="bdg" sx={{ position:"absolute", top:12, left:12,
//                         px:"8px", py:"3px", borderRadius:"6px",
//                         background:`${f.color}22`, border:`1px solid ${f.color}40`,
//                         opacity:0.55, transition:"opacity 0.25s" }}>
//                         <Typography sx={{ fontSize:"0.58rem", color:f.color, fontWeight:800,
//                           letterSpacing:"0.12em", fontFamily:"'Lexend', sans-serif" }}>
//                           {f.badge}
//                         </Typography>
//                       </Box>

//                       {/* Icon */}
//                       <Box className="ic" sx={{ width:62, height:62, borderRadius:"16px", mb:2,
//                         background:`linear-gradient(135deg, ${f.color}20, ${f.color}08)`,
//                         border:`1.5px solid ${f.color}40`,
//                         display:"flex", alignItems:"center", justifyContent:"center",
//                         color:f.color, transition:"all 0.3s",
//                         boxShadow:`0 4px 14px ${f.color}18`,
//                         "& svg":{ fontSize:"1.7rem" } }}>
//                         {f.icon}
//                       </Box>

//                       {/* Title — BIG */}
//                       <Typography sx={{ fontFamily:"'Lexend', sans-serif", fontWeight:800,
//                         fontSize:"0.95rem", textAlign:"center", color:T.white,
//                         lineHeight:1.25, mb:0.7, letterSpacing:"-0.01em" }}>
//                         {f.title}
//                       </Typography>

//                       {/* Desc — visible */}
//                       <Typography sx={{ textAlign:"center", color:T.grey,
//                         fontSize:"0.78rem", fontFamily:"'Inter Tight', sans-serif",
//                         lineHeight:1.45, mb:1.8, px:0.5 }}>
//                         {f.desc}
//                       </Typography>

//                       {/* CTA */}
//                       <Box className="cta" sx={{ display:"flex", alignItems:"center", gap:0.6,
//                         px:2, py:"6px", borderRadius:"8px",
//                         background:`${f.color}18`, border:`1px solid ${f.color}40`,
//                         opacity:0, transform:"translateY(6px)",
//                         transition:"opacity 0.3s, transform 0.3s" }}>
//                         <Typography sx={{ fontSize:"0.65rem", color:f.color, fontWeight:800,
//                           letterSpacing:"0.1em", textTransform:"uppercase",
//                           fontFamily:"'Lexend', sans-serif" }}>
//                           Open
//                         </Typography>
//                         <Typography sx={{ color:f.color, fontSize:"0.8rem", lineHeight:1 }}>→</Typography>
//                       </Box>
//                     </Box>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </Box>

//             {/* Auto-progress bar + dots */}
//             <Box sx={{ mt:3 }}>
//               {/* Thin progress bar */}
//               <Box sx={{ height:2, borderRadius:99, background:`${T.border}`,
//                 mb:2, overflow:"hidden" }}>
//                 <motion.div
//                   key={index}
//                   initial={{ width:"0%" }}
//                   animate={{ width: paused ? undefined : "100%" }}
//                   transition={{ duration: SLIDE_INTERVAL / 1000, ease:"linear" }}
//                   style={{ height:"100%", background:`linear-gradient(90deg, ${T.indigo}, ${T.violet})`,
//                     borderRadius:99, boxShadow:`0 0 8px ${T.indigo}70` }}
//                 />
//               </Box>

//               {/* Dots */}
//               <Box sx={{ display:"flex", justifyContent:"center", gap:"8px", alignItems:"center" }}>
//                 {features.map((f, i) => (
//                   <motion.div key={i}
//                     animate={{ width: i===index ? 26 : 7, opacity: i===index ? 1 : 0.25 }}
//                     transition={{ duration:0.35, type:"spring", stiffness:300 }}
//                     onClick={() => { setPaused(true); goTo(i); setTimeout(()=>setPaused(false),4000); }}
//                     style={{ height:7, borderRadius:99, cursor:"pointer",
//                       background: i===index
//                         ? `linear-gradient(90deg, ${T.indigo}, ${T.violet})`
//                         : T.muted,
//                       boxShadow: i===index ? `0 0 8px ${T.indigo}70` : "none" }}
//                   />
//                 ))}
//               </Box>
//             </Box>
//           </Box>
//         </motion.div>
//       </Box>
//     </Box>
//   );
// }
// import { useState, useEffect, useRef } from "react";
// import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
// import Sidebar from "../../components/Sidebar";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIosNewIcon  from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon  from "@mui/icons-material/ArrowForwardIos";
// import ComputerIcon         from "@mui/icons-material/Computer";
// import SmartToyIcon         from "@mui/icons-material/SmartToy";
// import QuizIcon             from "@mui/icons-material/Quiz";
// import MenuBookIcon         from "@mui/icons-material/MenuBook";
// import EmojiEventsIcon      from "@mui/icons-material/EmojiEvents";
// import TrendingUpIcon       from "@mui/icons-material/TrendingUp";

// // ─── Design tokens (matches Proxima palette) ─────────────────────────────────
// const T = {
//   bg:        "#0d0b14",
//   panel:     "#13101f",
//   panelHi:   "#1a1528",
//   border:    "rgba(139,92,246,0.12)",
//   violet:    "#8b5cf6",
//   purple:    "#a855f7",
//   magenta:   "#c026d3",
//   cyan:      "#06b6d4",
//   emerald:   "#10b981",
//   amber:     "#f59e0b",
//   textPri:   "#f1f0f9",
//   textSec:   "#6b7280",
//   textMuted: "#4b5563",
// };

// // ─── Proxima-style grid background ───────────────────────────────────────────
// function ProximaGrid() {
//   return (
//     <Box sx={{
//       position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
//       backgroundImage: `
//         linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
//         linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)
//       `,
//       backgroundSize: "40px 40px",
//     }} />
//   );
// }

// // ─── Purple horizon glow (like the image's bottom glow bar) ──────────────────
// function HorizonGlow() {
//   return (
//     <>
//       {/* Bottom horizon */}
//       <Box
//         component={motion.div}
//         animate={{ opacity: [0.55, 0.85, 0.55] }}
//         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//         sx={{
//           position: "fixed", bottom: 0, left: "10%", right: "10%", height: "1px",
//           background: `linear-gradient(90deg, transparent, ${T.violet}, ${T.purple}, ${T.magenta}, ${T.purple}, ${T.violet}, transparent)`,
//           pointerEvents: "none", zIndex: 0,
//           boxShadow: `0 0 60px 8px ${T.violet}50`,
//         }}
//       />
//       {/* Bottom soft bloom */}
//       <Box sx={{
//         position: "fixed", bottom: "-10%", left: "20%", right: "20%", height: 200,
//         background: `radial-gradient(ellipse at 50% 100%, ${T.purple}25 0%, transparent 70%)`,
//         filter: "blur(30px)", pointerEvents: "none", zIndex: 0,
//       }} />
//       {/* Top-left ambient glow */}
//       <Box
//         component={motion.div}
//         animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.1, 1] }}
//         transition={{ duration: 8, repeat: Infinity }}
//         sx={{
//           position: "fixed", top: "-15%", left: "-10%", width: 500, height: 500,
//           borderRadius: "50%",
//           background: `radial-gradient(circle, ${T.violet}30 0%, transparent 70%)`,
//           filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
//         }}
//       />
//       {/* Right ambient */}
//       <Box
//         component={motion.div}
//         animate={{ opacity: [0.15, 0.3, 0.15] }}
//         transition={{ duration: 10, repeat: Infinity, delay: 2 }}
//         sx={{
//           position: "fixed", top: "30%", right: "-8%", width: 400, height: 400,
//           borderRadius: "50%",
//           background: `radial-gradient(circle, ${T.magenta}20 0%, transparent 70%)`,
//           filter: "blur(70px)", pointerEvents: "none", zIndex: 0,
//         }}
//       />
//     </>
//   );
// }

// // ─── Mini SVG area chart (like the dashboard charts in the image) ─────────────
// function MiniAreaChart({ color, data }) {
//   const w = 90, h = 36;
//   const max = Math.max(...data);
//   const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4)}`).join(" ");
//   const fill = `${pts} ${w},${h} 0,${h}`;
//   return (
//     <svg width={w} height={h} style={{ flexShrink: 0 }}>
//       <defs>
//         <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={color} stopOpacity="0.45" />
//           <stop offset="100%" stopColor={color} stopOpacity="0.02" />
//         </linearGradient>
//       </defs>
//       <polygon points={fill} fill={`url(#grad-${color.replace("#","")})`} />
//       <polyline points={pts} fill="none" stroke={color} strokeWidth="1.8"
//         strokeLinecap="round" strokeLinejoin="round"
//         style={{ filter: `drop-shadow(0 0 3px ${color}90)` }} />
//     </svg>
//   );
// }

// // ─── Animated count-up number ─────────────────────────────────────────────────
// function CountUp({ target, suffix = "" }) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     const steps = 40;
//     let i = 0;
//     const id = setInterval(() => {
//       i++;
//       setVal(Math.round((i / steps) * target));
//       if (i >= steps) clearInterval(id);
//     }, 30);
//     return () => clearInterval(id);
//   }, [target]);
//   return <>{val.toLocaleString()}{suffix}</>;
// }

// // ─── Proxima-style stat chip (top bar in the image) ──────────────────────────
// function StatChip({ icon, value, label, delta, color, chartData }) {
//   return (
//     <motion.div whileHover={{ y: -3, scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
//       <Box sx={{
//         background: `linear-gradient(145deg, ${T.panelHi} 0%, ${T.panel} 100%)`,
//         border: `1px solid ${T.border}`,
//         borderRadius: "12px", p: "14px 16px",
//         minWidth: 175, position: "relative", overflow: "hidden",
//         transition: "border-color 0.25s, box-shadow 0.25s",
//         "&:hover": {
//           borderColor: `${color}40`,
//           boxShadow: `0 8px 32px ${color}18`,
//         },
//         "&::before": {
//           content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "1.5px",
//           background: `linear-gradient(90deg, transparent, ${color}80, transparent)`,
//         },
//       }}>
//         <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }}>
//           <Box>
//             <Typography sx={{ fontSize: "0.62rem", color: T.textMuted, letterSpacing: "0.1em",
//               textTransform: "uppercase", fontFamily: "'Manrope', sans-serif", mb: 0.3 }}>
//               {label}
//             </Typography>
//             <Typography sx={{ fontSize: "1.45rem", fontWeight: 800, color: T.textPri,
//               fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1 }}>
//               {value}
//             </Typography>
//           </Box>
//           <Box sx={{
//             width: 32, height: 32, borderRadius: "8px",
//             background: `${color}18`, border: `1px solid ${color}30`,
//             display: "flex", alignItems: "center", justifyContent: "center", color,
//             "& svg": { fontSize: "1rem" },
//           }}>
//             {icon}
//           </Box>
//         </Box>
//         <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//           <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5,
//             px: 1, py: 0.3, borderRadius: "6px",
//             background: `${T.emerald}18`, border: `1px solid ${T.emerald}30` }}>
//             <Typography sx={{ fontSize: "0.65rem", color: T.emerald, fontWeight: 700 }}>
//               {delta}
//             </Typography>
//           </Box>
//           <MiniAreaChart color={color} data={chartData} />
//         </Box>
//       </Box>
//     </motion.div>
//   );
// }

// // ─── Feature data ─────────────────────────────────────────────────────────────
// const features = [
//   { title: "Generate Questions", desc: "AI interview prep",     icon: <ComputerIcon />,    path: "/generate",         color: T.violet,  badge: "AI" },
//   { title: "Chatbot",            desc: "Instant answers",       icon: <SmartToyIcon />,    path: "/chatbot",          color: T.purple,  badge: "New" },
//   { title: "Quiz Mode",          desc: "Smart practice tests",  icon: <QuizIcon />,        path: "/user/tests",       color: T.cyan,    badge: "Hot" },
//   { title: "Resources",          desc: "Curated learning",      icon: <MenuBookIcon />,    path: "/resources",        color: T.amber,   badge: "HD" },
//   { title: "Leaderboard",        desc: "Global rankings",       icon: <EmojiEventsIcon />, path: "/user/leaderboard", color: T.magenta, badge: "Live" },
//   { title: "Performance",        desc: "Test analytics",        icon: <TrendingUpIcon />,  path: "/user/performance", color: T.emerald, badge: "Pro" },
// ];

// const cardVariants = {
//   enter:  (d) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.9,  filter: "blur(4px)" }),
//   center: { opacity: 1, x: 0,            scale: 1,    filter: "blur(0px)" },
//   exit:   (d) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.9,  filter: "blur(4px)" }),
// };

// // ─── Dashboard ────────────────────────────────────────────────────────────────
// export default function UserDashboard() {
//   const [index, setIndex]         = useState(0);
//   const [direction, setDirection] = useState(1);
//   const navigate = useNavigate();

//   const next = () => { setDirection(1);  setIndex((p) => (p + 1) % features.length); };
//   const prev = () => { setDirection(-1); setIndex((p) => (p === 0 ? features.length - 1 : p - 1)); };

//   const visible = [
//     features[index],
//     features[(index + 1) % features.length],
//     features[(index + 2) % features.length],
//   ];

//   const statsRow = [
//     { icon: <TrendingUpIcon />, value: "1,247",  label: "Questions Solved", delta: "+12 today",    color: T.violet,  chartData: [40,55,48,70,62,80,78,92,85,100] },
//     { icon: <QuizIcon />,       value: "84%",    label: "Quiz Accuracy",    delta: "+3% week",     color: T.cyan,    chartData: [60,58,65,70,68,75,72,80,78,84]  },
//     { icon: <EmojiEventsIcon/>, value: "14",     label: "Day Streak",       delta: "🔥 On fire",   color: T.amber,   chartData: [2,4,5,6,7,8,9,11,13,14]         },
//     { icon: <SmartToyIcon />,   value: "9.2",    label: "AI Score",         delta: "+0.4 today",   color: T.emerald, chartData: [7,7.5,8,7.8,8.5,8.2,8.8,9,9.1,9.2] },
//   ];

//   return (
//     <Box sx={{
//       display: "flex", minHeight: "100vh",
//       background: T.bg, position: "relative", overflow: "hidden",
//       fontFamily: "'Manrope', sans-serif",
//     }}>
//       <ProximaGrid />
//       <HorizonGlow />

//       {/* Sidebar */}
//       <Box sx={{ position: "relative", zIndex: 20 }}><Sidebar /></Box>

//       {/* ── Main ── */}
//       <Box sx={{ flex: 1, p: { xs: 2, md: "28px 32px" }, position: "relative", zIndex: 5, overflow: "auto" }}>

//         {/* ── PAGE TITLE BAR (like "Pages / Dashboard" in image) ── */}
//         <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
//           <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
//             <Box>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
//                 <Typography sx={{ color: T.textMuted, fontSize: "0.72rem",
//                   fontFamily: "'Manrope', sans-serif" }}>
//                   Pages
//                 </Typography>
//                 <Typography sx={{ color: T.textMuted, fontSize: "0.72rem" }}>/</Typography>
//                 <Typography sx={{ color: T.textSec, fontSize: "0.72rem", fontWeight: 600 }}>
//                   Dashboard
//                 </Typography>
//               </Box>

//               <Typography variant="h4" sx={{
//                 fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
//                 fontSize: { xs: "1.6rem", md: "1.9rem" }, lineHeight: 1.15,
//                 background: `linear-gradient(110deg, ${T.textPri} 0%, #c4b5fd 55%, ${T.purple} 100%)`,
//                 WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//                 mb: 0.3,
//               }}>
//                 Hi Tanisha 👋
//               </Typography>

//               <Typography sx={{ color: T.textMuted, fontSize: "0.85rem",
//                 fontFamily: "'Manrope', sans-serif" }}>
//                 Let's prepare interviews smarter with{" "}
//                 <Box component="span" sx={{
//                   color: T.violet, fontWeight: 700,
//                   textShadow: `0 0 16px ${T.violet}60`,
//                 }}>IQG AI</Box>
//               </Typography>
//             </Box>

//             {/* Beta badge — like "4.8 beta" chip in the image */}
//             <motion.div whileHover={{ scale: 1.05 }}>
//               <Box sx={{
//                 display: "flex", alignItems: "center", gap: 1,
//                 px: 2, py: 1, borderRadius: "20px",
//                 background: `linear-gradient(135deg, ${T.violet}20, ${T.purple}15)`,
//                 border: `1px solid ${T.violet}35`,
//                 boxShadow: `0 0 20px ${T.violet}15`,
//               }}>
//                 <Box sx={{
//                   px: 1, py: 0.2, borderRadius: "6px",
//                   background: T.violet, fontSize: "0.6rem",
//                   color: "#fff", fontWeight: 800, fontFamily: "'Manrope', sans-serif",
//                   letterSpacing: "0.08em",
//                 }}>NEW</Box>
//                 <Typography sx={{ fontSize: "0.72rem", color: "#c4b5fd",
//                   fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
//                   v2.4 beta available
//                 </Typography>
//                 <Typography sx={{ color: T.violet, fontSize: "0.7rem" }}>→</Typography>
//               </Box>
//             </motion.div>
//           </Box>
//         </motion.div>

//         {/* ── STATS ROW (like the 4 metric chips in the image) ── */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.12, duration: 0.55 }}>
//           <Box sx={{ display: "flex", gap: 2, mb: 3.5, flexWrap: "wrap" }}>
//             {statsRow.map((s, i) => (
//               <motion.div key={s.label}
//                 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.18 + i * 0.08, type: "spring", stiffness: 180 }}>
//                 <StatChip {...s} />
//               </motion.div>
//             ))}
//           </Box>
//         </motion.div>

//         {/* ── FEATURE CAROUSEL (main panel like charts section in image) ── */}
//         <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.28, duration: 0.6 }}>
//           <Box sx={{
//             background: `linear-gradient(145deg, ${T.panelHi} 0%, ${T.panel} 100%)`,
//             border: `1px solid ${T.border}`,
//             borderRadius: "16px", p: "24px 28px",
//             position: "relative", overflow: "hidden",
//             boxShadow: `0 4px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)`,
//             // Top purple line
//             "&::before": {
//               content: '""', position: "absolute", top: 0, left: "8%", right: "8%", height: "1px",
//               background: `linear-gradient(90deg, transparent, ${T.violet}70, ${T.purple}70, transparent)`,
//             },
//           }}>

//             {/* Panel header */}
//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
//               <Box>
//                 <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
//                   fontSize: "0.95rem", color: T.textPri, mb: 0.2 }}>
//                   Explore Features
//                 </Typography>
//                 <Typography sx={{ fontSize: "0.72rem", color: T.textMuted }}>
//                   AI-powered tools to ace your interviews
//                 </Typography>
//               </Box>

//               {/* View-all style pill */}
//               <Box sx={{ display: "flex", gap: 1 }}>
//                 {["All", "AI", "Practice"].map((tab, i) => (
//                   <Box key={tab} sx={{
//                     px: 1.5, py: 0.5, borderRadius: "8px", cursor: "pointer",
//                     background: i === 0 ? T.violet : "transparent",
//                     border: `1px solid ${i === 0 ? T.violet : T.border}`,
//                     transition: "all 0.2s",
//                     "&:hover": { borderColor: `${T.violet}60`, background: i !== 0 ? `${T.violet}12` : T.violet },
//                   }}>
//                     <Typography sx={{ fontSize: "0.65rem", fontWeight: 600,
//                       color: i === 0 ? "#fff" : T.textMuted, fontFamily: "'Manrope', sans-serif" }}>
//                       {tab}
//                     </Typography>
//                   </Box>
//                 ))}
//               </Box>
//             </Box>

//             {/* Prev / Next arrows */}
//             <IconButton onClick={prev}
//               component={motion.button} whileHover={{ scale: 1.12, x: -2 }} whileTap={{ scale: 0.9 }}
//               sx={{
//                 position: "absolute", left: -18, top: "50%", transform: "translateY(-50%)",
//                 background: `linear-gradient(135deg, ${T.panelHi}, ${T.panel})`,
//                 border: `1px solid ${T.border}`, color: T.violet, width: 36, height: 36,
//                 boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 12px ${T.violet}20`,
//                 "&:hover": { borderColor: `${T.violet}50`, boxShadow: `0 0 20px ${T.violet}35` },
//               }}>
//               <ArrowBackIosNewIcon sx={{ fontSize: 13 }} />
//             </IconButton>

//             <IconButton onClick={next}
//               component={motion.button} whileHover={{ scale: 1.12, x: 2 }} whileTap={{ scale: 0.9 }}
//               sx={{
//                 position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)",
//                 background: `linear-gradient(135deg, ${T.panelHi}, ${T.panel})`,
//                 border: `1px solid ${T.border}`, color: T.purple, width: 36, height: 36,
//                 boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 12px ${T.purple}20`,
//                 "&:hover": { borderColor: `${T.purple}50`, boxShadow: `0 0 20px ${T.purple}35` },
//               }}>
//               <ArrowForwardIosIcon sx={{ fontSize: 13 }} />
//             </IconButton>

//             {/* Feature Cards */}
//             <Box sx={{ display: "flex", gap: 2, justifyContent: "center", overflow: "visible" }}>
//               <AnimatePresence mode="popLayout" custom={direction}>
//                 {visible.map((f, i) => (
//                   <motion.div key={`${f.title}-${index}`}
//                     custom={direction} variants={cardVariants}
//                     initial="enter" animate="center" exit="exit"
//                     transition={{ duration: 0.38, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
//                     whileHover={{ y: -8, transition: { type: "spring", stiffness: 350, damping: 20 } }}
//                     style={{ flex: "0 0 auto" }}>
//                     <Box
//                       onClick={() => navigate(f.path)}
//                       sx={{
//                         width: 210, height: 215, cursor: "pointer",
//                         background: `linear-gradient(145deg, #1e1a2e 0%, ${T.panel} 100%)`,
//                         border: `1px solid ${f.color}18`,
//                         borderRadius: "14px", position: "relative", overflow: "hidden",
//                         display: "flex", flexDirection: "column",
//                         alignItems: "center", justifyContent: "center", p: 2.5,
//                         transition: "all 0.3s",
//                         "&:hover": {
//                           borderColor: `${f.color}45`,
//                           boxShadow: `0 16px 48px ${f.color}20, 0 0 0 1px ${f.color}20`,
//                           background: `linear-gradient(145deg, ${f.color}0d 0%, #1e1a2e 100%)`,
//                           "& .feat-icon-box": {
//                             boxShadow: `0 0 0 8px ${f.color}12, 0 0 20px ${f.color}30`,
//                             transform: "scale(1.08)",
//                           },
//                           "& .feat-badge": { opacity: 1 },
//                           "& .feat-arrow": { opacity: 1, transform: "translateX(0)" },
//                         },
//                         // Subtle corner gradient
//                         "&::after": {
//                           content: '""', position: "absolute", top: 0, right: 0, width: 80, height: 80,
//                           background: `radial-gradient(circle at top right, ${f.color}12, transparent 65%)`,
//                         },
//                       }}>

//                       {/* Top accent */}
//                       <Box sx={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "1.5px",
//                         background: `linear-gradient(90deg, transparent, ${f.color}80, transparent)` }} />

//                       {/* Badge */}
//                       <Box className="feat-badge" sx={{
//                         position: "absolute", top: 12, left: 12,
//                         px: 1, py: "2px", borderRadius: "5px",
//                         background: `${f.color}20`, border: `1px solid ${f.color}35`,
//                         opacity: 0.6, transition: "opacity 0.25s",
//                       }}>
//                         <Typography sx={{ fontSize: "0.55rem", color: f.color,
//                           fontWeight: 800, letterSpacing: "0.1em",
//                           fontFamily: "'Manrope', sans-serif" }}>
//                           {f.badge}
//                         </Typography>
//                       </Box>

//                       {/* Icon box */}
//                       <Box className="feat-icon-box" sx={{
//                         width: 58, height: 58, borderRadius: "14px", mb: 2,
//                         background: `linear-gradient(135deg, ${f.color}18, ${f.color}08)`,
//                         border: `1px solid ${f.color}35`,
//                         display: "flex", alignItems: "center", justifyContent: "center",
//                         color: f.color, transition: "all 0.3s",
//                         boxShadow: `0 4px 12px ${f.color}15`,
//                         "& svg": { fontSize: "1.55rem" },
//                       }}>
//                         {f.icon}
//                       </Box>

//                       <Typography sx={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
//                         fontSize: "0.87rem", textAlign: "center", color: T.textPri,
//                         mb: 0.5, letterSpacing: "-0.01em" }}>
//                         {f.title}
//                       </Typography>

//                       <Typography sx={{ textAlign: "center", color: T.textMuted,
//                         fontSize: "0.72rem", fontFamily: "'Manrope', sans-serif", mb: 1.8 }}>
//                         {f.desc}
//                       </Typography>

//                       {/* Arrow CTA */}
//                       <Box className="feat-arrow" sx={{
//                         display: "flex", alignItems: "center", gap: 0.5,
//                         px: 2, py: "5px", borderRadius: "8px",
//                         background: `${f.color}14`, border: `1px solid ${f.color}30`,
//                         opacity: 0.5, transform: "translateX(-4px)",
//                         transition: "opacity 0.25s, transform 0.25s",
//                       }}>
//                         <Typography sx={{ fontSize: "0.62rem", color: f.color,
//                           fontWeight: 700, letterSpacing: "0.08em",
//                           fontFamily: "'Manrope', sans-serif", textTransform: "uppercase" }}>
//                           Open
//                         </Typography>
//                         <Typography sx={{ color: f.color, fontSize: "0.75rem", lineHeight: 1 }}>→</Typography>
//                       </Box>
//                     </Box>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </Box>

//             {/* Dot indicators */}
//             <Box sx={{ display: "flex", justifyContent: "center", gap: "7px", mt: 3 }}>
//               {features.map((f, i) => (
//                 <motion.div key={i}
//                   animate={{ width: i === index ? 22 : 6, opacity: i === index ? 1 : 0.25 }}
//                   transition={{ duration: 0.3, type: "spring" }}
//                   onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
//                   style={{
//                     height: 6, borderRadius: 99, cursor: "pointer",
//                     background: i === index
//                       ? `linear-gradient(90deg, ${T.violet}, ${T.purple})`
//                       : T.textMuted,
//                     boxShadow: i === index ? `0 0 8px ${T.violet}70` : "none",
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>
//         </motion.div>
//       </Box>
//     </Box>
//   );
// }

// import { useState, useEffect, useRef } from "react";
// import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
// import Sidebar from "../../components/Sidebar";
// import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIosNewIcon  from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon  from "@mui/icons-material/ArrowForwardIos";
// import ComputerIcon         from "@mui/icons-material/Computer";
// import SmartToyIcon         from "@mui/icons-material/SmartToy";
// import QuizIcon             from "@mui/icons-material/Quiz";
// import MenuBookIcon         from "@mui/icons-material/MenuBook";
// import EmojiEventsIcon      from "@mui/icons-material/EmojiEvents";
// import TrendingUpIcon       from "@mui/icons-material/TrendingUp";

// // ─── Palette tokens ─────────────────────────────────────────────────────────
// const C = {
//   violet: "#a78bfa",
//   teal:   "#2dd4bf",
//   amber:  "#fbbf24",
//   sky:    "#38bdf8",
//   rose:   "#fb7185",
//   base:   "#141428",
//   panel:  "#1e1e38",
//   panelHi:"#252545",
// };

// // ─── Soft drifting background blobs ─────────────────────────────────────────
// function DriftBlobs() {
//   const blobs = [
//     { x: "-5%",  y: "-10%", w: 480, color: `${C.violet}28`, dur: 18, dx: 35, dy: 45 },
//     { x: "60%",  y: "5%",   w: 400, color: `${C.teal}20`,   dur: 22, dx: -25, dy: 50 },
//     { x: "25%",  y: "55%",  w: 360, color: `${C.amber}18`,  dur: 15, dx: 40, dy: -30 },
//     { x: "75%",  y: "60%",  w: 300, color: `${C.sky}18`,    dur: 20, dx: -40, dy: -35 },
//   ];
//   return (
//     <>
//       {blobs.map((b, i) => (
//         <motion.div key={i}
//           animate={{ x: [0, b.dx, -b.dx * 0.5, 0], y: [0, b.dy, -b.dy * 0.4, 0], scale: [1, 1.1, 0.95, 1] }}
//           transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: i * 2.5 }}
//           style={{ position: "fixed", left: b.x, top: b.y, width: b.w, height: b.w, borderRadius: "50%",
//             background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
//             filter: "blur(60px)", pointerEvents: "none", zIndex: 0 }}
//         />
//       ))}
//     </>
//   );
// }

// // ─── Subtle dot grid ─────────────────────────────────────────────────────────
// function DotGrid() {
//   return (
//     <Box sx={{
//       position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
//       backgroundImage: `radial-gradient(circle, rgba(167,139,250,0.12) 1px, transparent 1px)`,
//       backgroundSize: "32px 32px",
//     }} />
//   );
// }

// // ─── 3D tilt card wrapper ────────────────────────────────────────────────────
// function TiltCard({ children, style, sx, onClick }) {
//   const ref = useRef(null);
//   const x = useMotionValue(0);
//   const y = useMotionValue(0);
//   const rotateX = useTransform(y, [-0.5, 0.5], [6, -6]);
//   const rotateY = useTransform(x, [-0.5, 0.5], [-6, 6]);

//   const handleMouse = (e) => {
//     const rect = ref.current.getBoundingClientRect();
//     x.set((e.clientX - rect.left) / rect.width - 0.5);
//     y.set((e.clientY - rect.top)  / rect.height - 0.5);
//   };
//   const reset = () => { x.set(0); y.set(0); };

//   return (
//     <motion.div ref={ref}
//       onMouseMove={handleMouse} onMouseLeave={reset} onClick={onClick}
//       style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800, cursor: "pointer", ...style }}>
//       <Box sx={sx}>{children}</Box>
//     </motion.div>
//   );
// }

// // ─── Animated ring stat ──────────────────────────────────────────────────────
// function StatRing({ value, max, color, size = 52 }) {
//   const r = (size - 7) / 2;
//   const circ = 2 * Math.PI * r;
//   const pct = Math.min(value, max) / max;
//   return (
//     <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
//       <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}20`} strokeWidth="4" />
//       <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="4"
//         strokeLinecap="round" strokeDasharray={circ}
//         initial={{ strokeDashoffset: circ }}
//         animate={{ strokeDashoffset: circ * (1 - pct) }}
//         transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1], delay: 0.3 }}
//         style={{ filter: `drop-shadow(0 0 5px ${color}90)` }}
//       />
//     </svg>
//   );
// }

// // ─── Wavy sparkline ──────────────────────────────────────────────────────────
// function Sparkline({ color, seed }) {
//   const bars = Array.from({ length: 8 }, (_, i) =>
//     ((Math.sin(seed + i * 1.2) + 1) / 2) * 0.65 + 0.2
//   );
//   return (
//     <Box sx={{ display: "flex", gap: "3px", alignItems: "flex-end", height: 26, ml: "auto" }}>
//       {bars.map((h, i) => (
//         <motion.div key={i}
//           initial={{ scaleY: 0 }} animate={{ scaleY: h }}
//           transition={{ delay: 0.4 + i * 0.05, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
//           style={{ width: 4, height: "100%", background: `linear-gradient(180deg, ${color}, ${color}55)`,
//             borderRadius: 3, transformOrigin: "bottom", opacity: 0.8 }}
//         />
//       ))}
//     </Box>
//   );
// }

// // ─── Pulsing tag ─────────────────────────────────────────────────────────────
// function LiveTag() {
//   return (
//     <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.8,
//       px: 1.5, py: 0.4, borderRadius: 99,
//       background: "rgba(45,212,191,0.1)", border: "1px solid rgba(45,212,191,0.25)" }}>
//       <motion.div animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
//         transition={{ duration: 1.8, repeat: Infinity }}
//         style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal }} />
//       <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, color: C.teal,
//         letterSpacing: "0.18em", fontFamily: "'Syne', sans-serif" }}>
//         LIVE
//       </Typography>
//     </Box>
//   );
// }

// // ─── Features ────────────────────────────────────────────────────────────────
// const features = [
//   { title: "Generate Questions", desc: "AI-powered prep",      icon: <ComputerIcon />,    path: "/generate",         color: C.violet, grad: `linear-gradient(135deg, ${C.violet}22, ${C.violet}06)` },
//   { title: "Chatbot",            desc: "Instant AI answers",   icon: <SmartToyIcon />,    path: "/chatbot",          color: C.teal,   grad: `linear-gradient(135deg, ${C.teal}22, ${C.teal}06)`   },
//   { title: "Quiz Mode",          desc: "Sharpen your skills",  icon: <QuizIcon />,        path: "/user/tests",       color: C.amber,  grad: `linear-gradient(135deg, ${C.amber}22, ${C.amber}06)` },
//   { title: "Resources",          desc: "Curated knowledge",    icon: <MenuBookIcon />,    path: "/resources",        color: C.sky,    grad: `linear-gradient(135deg, ${C.sky}22, ${C.sky}06)`    },
//   { title: "Leaderboard",        desc: "Global rankings",      icon: <EmojiEventsIcon />, path: "/user/leaderboard", color: C.rose,   grad: `linear-gradient(135deg, ${C.rose}22, ${C.rose}06)`  },
//   { title: "Performance",        desc: "Your analytics",       icon: <TrendingUpIcon />,  path: "/user/performance", color: C.violet, grad: `linear-gradient(135deg, ${C.violet}22, ${C.violet}06)` },
// ];

// const cardVariants = {
//   enter:  (d) => ({ opacity: 0, x: d > 0 ? 90 : -90, scale: 0.88, filter: "blur(6px)" }),
//   center: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
//   exit:   (d) => ({ opacity: 0, x: d > 0 ? -90 : 90, scale: 0.88, filter: "blur(6px)" }),
// };

// // ─── Dashboard ───────────────────────────────────────────────────────────────
// export default function UserDashboard() {
//   const [index, setIndex]         = useState(0);
//   const [direction, setDirection] = useState(1);
//   const [tick, setTick]           = useState(0);
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const id = setInterval(() => setTick((t) => t + 1), 5000);
//     return () => clearInterval(id);
//   }, []);

//   const next = () => { setDirection(1);  setIndex((p) => (p + 1) % features.length); };
//   const prev = () => { setDirection(-1); setIndex((p) => (p === 0 ? features.length - 1 : p - 1)); };

//   const visible = [
//     features[index],
//     features[(index + 1) % features.length],
//     features[(index + 2) % features.length],
//   ];

//   const statsData = [
//     { label: "Questions Solved", value: 1247, display: "1,247", max: 2000, color: C.violet, seed: 0 },
//     { label: "Quiz Accuracy",    value: 84,   display: "84%",   max: 100,  color: C.teal,   seed: 2 },
//     { label: "Day Streak",       value: 14,   display: "14",    max: 30,   color: C.amber,  seed: 4 },
//   ];

//   return (
//     <Box sx={{
//       display: "flex", minHeight: "100vh",
//       background: `linear-gradient(145deg, #0f0f22 0%, ${C.base} 40%, #181830 100%)`,
//       position: "relative", overflow: "hidden",
//       fontFamily: "'Nunito', sans-serif",
//     }}>
//       <DriftBlobs />
//       <DotGrid />

//       {/* Sidebar */}
//       <Box sx={{ position: "relative", zIndex: 20 }}><Sidebar /></Box>

//       {/* ── Main ── */}
//       <Box sx={{ flex: 1, p: { xs: 2, md: "32px 36px" }, position: "relative", zIndex: 5, maxWidth: 1100 }}>

//         {/* ── HEADER ── */}
//         <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
//           <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 4 }}>
//             <Box>
//               <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
//                 <LiveTag />
//                 <Typography sx={{ color: "#94a3b8", fontSize: "0.72rem", fontFamily: "'Nunito', sans-serif",
//                   letterSpacing: "0.06em" }}>
//                   IQG AI Platform
//                 </Typography>
//               </Box>

//               <Typography variant="h4" sx={{
//                 fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: { xs: "1.7rem", md: "2.1rem" },
//                 background: `linear-gradient(100deg, #ede9fe 0%, ${C.violet} 45%, ${C.teal} 100%)`,
//                 WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//                 lineHeight: 1.15, mb: 0.5,
//               }}>
//                 Hi Tanisha 👋
//               </Typography>

//               <Typography sx={{ color: "#64748b", fontSize: "0.92rem", fontFamily: "'Nunito', sans-serif",
//                 fontWeight: 500 }}>
//                 Ready to ace your next interview with{" "}
//                 <Box component="span" sx={{ color: C.violet, fontWeight: 700,
//                   textShadow: `0 0 16px ${C.violet}60` }}>
//                   IQG AI
//                 </Box>
//                 ?
//               </Typography>
//             </Box>

//             {/* Animated AI badge */}
//             <motion.div whileHover={{ scale: 1.08, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
//               <Box sx={{
//                 width: 58, height: 58, borderRadius: "50%",
//                 background: `linear-gradient(135deg, ${C.violet}30, ${C.teal}20)`,
//                 border: `2px solid ${C.violet}40`,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 fontSize: 28, boxShadow: `0 0 24px ${C.violet}30`,
//                 position: "relative",
//               }}>
//                 🤖
//                 {/* Orbit ring */}
//                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
//                   style={{ position: "absolute", inset: -8, borderRadius: "50%",
//                     border: `1px dashed ${C.violet}35` }} />
//               </Box>
//             </motion.div>
//           </Box>
//         </motion.div>

//         {/* ── STATS CARDS ── */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.15, duration: 0.6 }}>
//           <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
//             {statsData.map((s, i) => (
//               <motion.div key={s.label}
//                 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.22 + i * 0.1, type: "spring", stiffness: 200 }}
//                 whileHover={{ y: -5, transition: { type: "spring", stiffness: 400 } }}>
//                 <Box sx={{
//                   background: `linear-gradient(145deg, ${C.panel} 0%, ${C.panelHi} 100%)`,
//                   border: `1px solid ${s.color}20`,
//                   borderRadius: "14px", p: "14px 18px", minWidth: 185,
//                   display: "flex", alignItems: "center", gap: 1.8,
//                   position: "relative", overflow: "hidden",
//                   transition: "border-color 0.3s, box-shadow 0.3s",
//                   "&:hover": {
//                     borderColor: `${s.color}45`,
//                     boxShadow: `0 8px 30px ${s.color}18`,
//                   },
//                   // Top shimmer line
//                   "&::before": { content: '""', position: "absolute", top: 0,
//                     left: "10%", right: "10%", height: "1.5px",
//                     background: `linear-gradient(90deg, transparent, ${s.color}70, transparent)` },
//                 }}>
//                   <StatRing value={s.value} max={s.max} color={s.color} size={50} />
//                   <Box sx={{ flex: 1 }}>
//                     <Typography sx={{ fontSize: "0.65rem", color: "#64748b", letterSpacing: "0.1em",
//                       textTransform: "uppercase", fontFamily: "'Nunito', sans-serif", mb: 0.2 }}>
//                       {s.label}
//                     </Typography>
//                     <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: s.color,
//                       fontFamily: "'Syne', sans-serif", lineHeight: 1,
//                       textShadow: `0 0 16px ${s.color}50` }}>
//                       {s.display}
//                     </Typography>
//                     <Sparkline color={s.color} seed={s.seed + tick * 0.7} />
//                   </Box>
//                 </Box>
//               </motion.div>
//             ))}
//           </Box>
//         </motion.div>

//         {/* ── FEATURE CAROUSEL ── */}
//         <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.32, duration: 0.65 }}>
//           <Box sx={{
//             background: `linear-gradient(145deg, ${C.panel}cc, ${C.panelHi}99)`,
//             border: "1px solid rgba(167,139,250,0.1)",
//             borderRadius: "20px", p: "28px 32px",
//             backdropFilter: "blur(16px)", position: "relative", overflow: "visible",
//             // Rainbow top border
//             "&::before": { content: '""', position: "absolute", top: 0,
//               left: "6%", right: "6%", height: "1.5px",
//               background: `linear-gradient(90deg, transparent, ${C.violet}, ${C.teal}, ${C.amber}, transparent)` },
//           }}>

//             {/* Section heading */}
//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 3.5 }}>
//               <Box sx={{ flex: 1, height: "1px", background: `linear-gradient(90deg, transparent, ${C.violet}40)` }} />
//               <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem",
//                 color: "#ede9fe", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
//                 ✦ Explore Features ✦
//               </Typography>
//               <Box sx={{ flex: 1, height: "1px", background: `linear-gradient(90deg, ${C.violet}40, transparent)` }} />
//             </Box>

//             {/* Prev Arrow */}
//             <IconButton onClick={prev}
//               component={motion.button} whileHover={{ scale: 1.15, x: -2 }} whileTap={{ scale: 0.9 }}
//               sx={{ position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)",
//                 background: `linear-gradient(135deg, ${C.panel}, ${C.panelHi})`,
//                 border: `1px solid ${C.violet}35`, color: C.violet, width: 40, height: 40,
//                 boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
//                 "&:hover": { borderColor: `${C.violet}70`, boxShadow: `0 0 18px ${C.violet}30` },
//               }}>
//               <ArrowBackIosNewIcon sx={{ fontSize: 14 }} />
//             </IconButton>

//             {/* Next Arrow */}
//             <IconButton onClick={next}
//               component={motion.button} whileHover={{ scale: 1.15, x: 2 }} whileTap={{ scale: 0.9 }}
//               sx={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
//                 background: `linear-gradient(135deg, ${C.panel}, ${C.panelHi})`,
//                 border: `1px solid ${C.teal}35`, color: C.teal, width: 40, height: 40,
//                 boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
//                 "&:hover": { borderColor: `${C.teal}70`, boxShadow: `0 0 18px ${C.teal}30` },
//               }}>
//               <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
//             </IconButton>

//             {/* Cards */}
//             <Box sx={{ display: "flex", gap: 2.5, justifyContent: "center", overflow: "visible", perspective: "1000px" }}>
//               <AnimatePresence mode="popLayout" custom={direction}>
//                 {visible.map((f, i) => (
//                   <motion.div key={`${f.title}-${index}`}
//                     custom={direction} variants={cardVariants}
//                     initial="enter" animate="center" exit="exit"
//                     transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
//                     style={{ flex: "0 0 auto" }}>
//                     <TiltCard onClick={() => navigate(f.path)}
//                       style={{ width: 214 }}
//                       sx={{
//                         width: 214, height: 218,
//                         background: f.grad,
//                         border: `1px solid ${f.color}22`,
//                         borderRadius: "16px",
//                         backdropFilter: "blur(10px)",
//                         position: "relative", overflow: "hidden",
//                         transition: "border-color 0.3s, box-shadow 0.3s",
//                         display: "flex", flexDirection: "column",
//                         alignItems: "center", justifyContent: "center",
//                         p: 3, gap: 0,
//                         "&:hover": {
//                           borderColor: `${f.color}55`,
//                           boxShadow: `0 16px 50px ${f.color}25, 0 0 0 1px ${f.color}20`,
//                         },
//                         // Corner glow
//                         "&::after": { content: '""', position: "absolute", bottom: -20, right: -20,
//                           width: 100, height: 100, borderRadius: "50%",
//                           background: `radial-gradient(circle, ${f.color}15 0%, transparent 70%)` },
//                       }}>

//                       {/* Top accent line */}
//                       <Box sx={{ position: "absolute", top: 0, left: "20%", right: "20%", height: "2px",
//                         background: `linear-gradient(90deg, transparent, ${f.color}80, transparent)` }} />

//                       {/* Icon with animated ring */}
//                       <Box sx={{ position: "relative", mb: 2 }}>
//                         <Box sx={{
//                           width: 60, height: 60, borderRadius: "50%",
//                           background: `linear-gradient(135deg, ${f.color}20, ${f.color}08)`,
//                           border: `1.5px solid ${f.color}45`,
//                           display: "flex", alignItems: "center", justifyContent: "center",
//                           color: f.color, transition: "all 0.35s",
//                           boxShadow: `0 0 0 0 ${f.color}30`,
//                           "& svg": { fontSize: "1.65rem" },
//                           ".MuiCard-root:hover &, *:hover > &": {
//                             boxShadow: `0 0 0 8px ${f.color}10, 0 0 24px ${f.color}35`,
//                             transform: "scale(1.1) rotate(6deg)",
//                           },
//                         }}>
//                           {f.icon}
//                         </Box>
//                         {/* Spinning orbit dot */}
//                         <motion.div
//                           animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
//                           style={{ position: "absolute", inset: -6, borderRadius: "50%",
//                             border: `1px dashed ${f.color}30` }}>
//                           <div style={{ position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)",
//                             width: 5, height: 5, borderRadius: "50%",
//                             background: f.color, boxShadow: `0 0 6px ${f.color}` }} />
//                         </motion.div>
//                       </Box>

//                       <Typography sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700,
//                         fontSize: "0.85rem", textAlign: "center", color: "#ede9fe",
//                         letterSpacing: "0.02em", mb: 0.5, lineHeight: 1.25 }}>
//                         {f.title}
//                       </Typography>

//                       <Typography sx={{ textAlign: "center", color: "#94a3b8",
//                         fontSize: "0.74rem", fontFamily: "'Nunito', sans-serif", mb: 1.5 }}>
//                         {f.desc}
//                       </Typography>

//                       {/* CTA chip */}
//                       <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
//                         <Box sx={{
//                           px: 2, py: "4px", borderRadius: 99,
//                           background: `${f.color}14`,
//                           border: `1px solid ${f.color}35`,
//                           display: "flex", alignItems: "center", gap: 0.5,
//                         }}>
//                           <Typography sx={{ fontSize: "0.6rem", color: f.color,
//                             letterSpacing: "0.14em", textTransform: "uppercase",
//                             fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
//                             Open
//                           </Typography>
//                           <Typography sx={{ fontSize: "0.65rem", color: f.color }}>→</Typography>
//                         </Box>
//                       </motion.div>
//                     </TiltCard>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </Box>

//             {/* Dot indicators */}
//             <Box sx={{ display: "flex", justifyContent: "center", gap: "8px", mt: 3 }}>
//               {features.map((f, i) => (
//                 <motion.div key={i}
//                   animate={{ width: i === index ? 24 : 7, opacity: i === index ? 1 : 0.28 }}
//                   transition={{ duration: 0.35, type: "spring" }}
//                   onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
//                   style={{ height: 7, borderRadius: 99, cursor: "pointer",
//                     background: i === index
//                       ? `linear-gradient(90deg, ${C.violet}, ${C.teal})`
//                       : "#475569",
//                     boxShadow: i === index ? `0 0 8px ${C.violet}60` : "none",
//                   }}
//                 />
//               ))}
//             </Box>
//           </Box>
//         </motion.div>
//       </Box>
//     </Box>
//   );
// }
// import { useState, useEffect } from "react";
// import { Box, Typography, Card, CardContent, IconButton } from "@mui/material";
// import Sidebar from "../../components/Sidebar";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import ComputerIcon from "@mui/icons-material/Computer";
// import SmartToyIcon from "@mui/icons-material/SmartToy";
// import QuizIcon from "@mui/icons-material/Quiz";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// /* ── Floating particles ─────────────────────────────────────────────────────── */
// function Particles() {
//   const pts = Array.from({ length: 24 }, (_, i) => ({
//     id: i, x: Math.random() * 100, y: Math.random() * 100,
//     size: Math.random() * 3 + 1, dur: Math.random() * 12 + 8, delay: Math.random() * 8,
//     color: i % 3 === 0 ? "#e040fb" : i % 3 === 1 ? "#7c4dff" : "#00e5ff",
//   }));
//   return (
//     <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
//       {pts.map((p) => (
//         <motion.div key={p.id}
//           style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size,
//             borderRadius: "50%", background: p.color, boxShadow: `0 0 ${p.size * 4}px ${p.color}`, opacity: 0.6 }}
//           animate={{ y: [0, -40, 0], opacity: [0.6, 0.2, 0.6], scale: [1, 1.4, 1] }}
//           transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
//         />
//       ))}
//     </Box>
//   );
// }

// /* ── Glow orbs ──────────────────────────────────────────────────────────────── */
// function GlowOrbs() {
//   return (
//     <>
//       {[
//         { top: "-10%", left: "-5%",   w: 500, color: "rgba(224,64,251,0.35)",  dur: 7,  delay: 0 },
//         { bottom: "-15%", right: "-5%", w: 600, color: "rgba(0,229,255,0.25)", dur: 9,  delay: 3 },
//         { top: "40%",  left: "40%",   w: 400, color: "rgba(124,77,255,0.2)",   dur: 11, delay: 1.5 },
//       ].map((o, i) => (
//         <Box key={i} component={motion.div}
//           animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
//           transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut", delay: o.delay }}
//           sx={{ position: "fixed", ...o, width: o.w, height: o.w, borderRadius: "50%",
//             background: `radial-gradient(circle, ${o.color} 0%, transparent 70%)`,
//             filter: "blur(50px)", pointerEvents: "none", zIndex: 0 }} />
//       ))}
//     </>
//   );
// }

// /* ── Animated sparkline bars ─────────────────────────────────────────────────── */
// function SparkBars({ color, seed }) {
//   const h = Array.from({ length: 7 }, (_, i) => ((Math.sin(seed + i * 1.3) + 1) / 2) * 0.7 + 0.3);
//   return (
//     <Box sx={{ display: "flex", gap: "3px", alignItems: "flex-end", height: 28 }}>
//       {h.map((val, i) => (
//         <motion.div key={i}
//           initial={{ scaleY: 0 }} animate={{ scaleY: val }}
//           transition={{ delay: i * 0.06, duration: 0.5, ease: "easeOut" }}
//           style={{ width: 5, height: "100%", background: color, borderRadius: 2,
//             transformOrigin: "bottom", opacity: 0.75 }} />
//       ))}
//     </Box>
//   );
// }

// /* ── Feature list ────────────────────────────────────────────────────────────── */
// const features = [
//   { title: "Generate Questions", desc: "Interview preparation",       icon: <ComputerIcon />,    path: "/generate",         accent: "#e040fb", glow: "rgba(224,64,251,0.4)" },
//   { title: "Chatbot",            desc: "Ask interview doubts",         icon: <SmartToyIcon />,    path: "/chatbot",          accent: "#7c4dff", glow: "rgba(124,77,255,0.4)" },
//   { title: "Quiz Mode",          desc: "Practice with smart quizzes",  icon: <QuizIcon />,        path: "/user/tests",       accent: "#00e5ff", glow: "rgba(0,229,255,0.4)"  },
//   { title: "Resources",          desc: "Curated learning material",    icon: <MenuBookIcon />,    path: "/resources",        accent: "#e040fb", glow: "rgba(224,64,251,0.4)" },
//   { title: "Leaderboard",        desc: "Global rankings",              icon: <EmojiEventsIcon />, path: "/user/leaderboard", accent: "#7c4dff", glow: "rgba(124,77,255,0.4)" },
//   { title: "Performance",        desc: "Your test analytics",          icon: <TrendingUpIcon />,  path: "/user/performance", accent: "#00e5ff", glow: "rgba(0,229,255,0.4)"  },
// ];

// const cardV = {
//   enter:  (d) => ({ opacity: 0, x: d > 0 ? 80 : -80, scale: 0.88 }),
//   center: { opacity: 1, x: 0, scale: 1 },
//   exit:   (d) => ({ opacity: 0, x: d > 0 ? -80 : 80, scale: 0.88 }),
// };

// /* ── Main Dashboard ──────────────────────────────────────────────────────────── */
// export default function UserDashboard() {
//   const [index, setIndex]         = useState(0);
//   const [direction, setDirection] = useState(1);
//   const [tick, setTick]           = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const id = setInterval(() => setTick((t) => t + 1), 4000);
//     return () => clearInterval(id);
//   }, []);

//   const handleNext = () => { setDirection(1);  setIndex((p) => (p + 1) % features.length); };
//   const handlePrev = () => { setDirection(-1); setIndex((p) => (p === 0 ? features.length - 1 : p - 1)); };
//   const visible = [features[index], features[(index + 1) % features.length], features[(index + 2) % features.length]];

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh",
//       background: "linear-gradient(135deg, #08081a 0%, #0d0d24 50%, #080818 100%)",
//       position: "relative", overflow: "hidden" }}>

//       <GlowOrbs />

//       {/* Grid overlay */}
//       <Box sx={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
//         backgroundImage: "linear-gradient(rgba(224,64,251,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(224,64,251,0.04) 1px, transparent 1px)",
//         backgroundSize: "48px 48px" }} />

//       <Particles />

//       <Box sx={{ position: "relative", zIndex: 10 }}><Sidebar /></Box>

//       {/* Main content */}
//       <Box sx={{ flex: 1, p: { xs: 2, md: 4 }, position: "relative", zIndex: 5 }}>

//         {/* ── Header ── */}
//         <motion.div initial={{ opacity: 0, y: -24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
//             <Box sx={{ position: "relative", width: 12, height: 12 }}>
//               <Box component={motion.div}
//                 animate={{ scale: [1, 1.9, 1], opacity: [1, 0, 1] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//                 sx={{ position: "absolute", inset: 0, borderRadius: "50%", bgcolor: "#e040fb", opacity: 0.4 }} />
//               <Box sx={{ position: "absolute", inset: "2px", borderRadius: "50%", bgcolor: "#e040fb" }} />
//             </Box>
//             <Typography sx={{ fontFamily: "'Orbitron', sans-serif", fontSize: "0.68rem",
//               letterSpacing: "0.2em", color: "#e040fb", textTransform: "uppercase", fontWeight: 600 }}>
//               IQG AI — Active Session
//             </Typography>
//           </Box>

//           <Typography variant="h4" sx={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
//             background: "linear-gradient(90deg, #f0f0ff 0%, #e040fb 50%, #00e5ff 100%)",
//             WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "0.04em", mb: 0.5 }}>
//             Hi Tanisha 👋
//           </Typography>
//           <Typography sx={{ color: "#9999cc", mb: 4, fontFamily: "'Rajdhani', sans-serif",
//             fontSize: "1rem", letterSpacing: "0.03em" }}>
//             Let's prepare interviews smarter with{" "}
//             <Box component="span" sx={{ color: "#e040fb", fontWeight: 700, textShadow: "0 0 12px rgba(224,64,251,0.7)" }}>
//               IQG AI
//             </Box>
//           </Typography>
//         </motion.div>

//         {/* ── Stats row ──
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
//           <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
//             {[
//               { label: "Questions Solved", value: "1,247",   color: "#e040fb", delta: "+12 today",     seed: 0 },
//               { label: "Quiz Accuracy",    value: "84%",     color: "#7c4dff", delta: "+3% this week", seed: 2 },
//               { label: "Streak",           value: "14 days", color: "#00e5ff", delta: "🔥 keep going",  seed: 4 },
//             ].map((s, i) => (
//               <motion.div key={s.label}
//                 initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ scale: 1.04, y: -4 }}>
//                 <Box sx={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
//                   border: `1px solid ${s.color}33`, borderRadius: 3, p: 2, minWidth: 178,
//                   backdropFilter: "blur(12px)", position: "relative", overflow: "hidden",
//                   "&::before": { content: '""', position: "absolute", top: 0, left: 0, right: 0, height: "2px",
//                     background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` } }}>
//                   <Typography sx={{ fontSize: "0.68rem", color: "#9999cc", letterSpacing: "0.12em",
//                     textTransform: "uppercase", mb: 0.5, fontFamily: "'Rajdhani', sans-serif" }}>
//                     {s.label}
//                   </Typography>
//                   <Typography sx={{ fontSize: "1.55rem", fontWeight: 800, color: s.color,
//                     fontFamily: "'Orbitron', sans-serif", textShadow: `0 0 20px ${s.color}80`, lineHeight: 1.1 }}>
//                     {s.value}
//                   </Typography>
//                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
//                     <Typography sx={{ fontSize: "0.73rem", color: s.color, opacity: 0.85 }}>{s.delta}</Typography>
//                     <SparkBars color={s.color} seed={s.seed + tick * 0.5} />
//                   </Box>
//                 </Box>
//               </motion.div>
//             ))}
//           </Box>
//         </motion.div> */}

//         {/* ── Feature Carousel ── */}
//         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
//           <Box sx={{ position: "relative", borderRadius: 4, p: 4,
//             background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
//             border: "1px solid rgba(224,64,251,0.15)", backdropFilter: "blur(20px)", overflow: "hidden",
//             "&::before": { content: '""', position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
//               background: "linear-gradient(90deg, transparent, rgba(224,64,251,0.6), rgba(0,229,255,0.6), transparent)" } }}>

//             {/* Title */}
//             <Box sx={{ textAlign: "center", mb: 4 }}>
//               <Typography variant="h5" sx={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
//                 background: "linear-gradient(90deg, #e040fb, #ffffff, #00e5ff)",
//                 WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
//                 letterSpacing: "0.06em", textTransform: "uppercase" }}>
//                 Explore Features
//               </Typography>
//               <Box sx={{ width: 80, height: 2, mx: "auto", mt: 1,
//                 background: "linear-gradient(90deg, #e040fb, #00e5ff)", borderRadius: 1 }} />
//             </Box>

//             {/* Prev */}
//             <IconButton onClick={handlePrev}
//               component={motion.button} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
//               sx={{ position: "absolute", left: -20, top: "50%", transform: "translateY(-50%)",
//                 background: "linear-gradient(135deg, rgba(224,64,251,0.3), rgba(124,77,255,0.3))",
//                 border: "1px solid rgba(224,64,251,0.5)", color: "#e040fb",
//                 boxShadow: "0 0 20px rgba(224,64,251,0.4)",
//                 "&:hover": { background: "linear-gradient(135deg, rgba(224,64,251,0.55), rgba(124,77,255,0.55))" } }}>
//               <ArrowBackIosNewIcon fontSize="small" />
//             </IconButton>

//             {/* Next */}
//             <IconButton onClick={handleNext}
//               component={motion.button} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
//               sx={{ position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
//                 background: "linear-gradient(135deg, rgba(0,229,255,0.3), rgba(124,77,255,0.3))",
//                 border: "1px solid rgba(0,229,255,0.5)", color: "#00e5ff",
//                 boxShadow: "0 0 20px rgba(0,229,255,0.4)",
//                 "&:hover": { background: "linear-gradient(135deg, rgba(0,229,255,0.55), rgba(124,77,255,0.55))" } }}>
//               <ArrowForwardIosIcon fontSize="small" />
//             </IconButton>

//             {/* Cards */}
//             <Box sx={{ display: "flex", gap: 3, justifyContent: "center", overflow: "visible" }}>
//               <AnimatePresence mode="popLayout" custom={direction}>
//                 {visible.map((f, i) => (
//                   <motion.div key={`${f.title}-${index}`}
//                     custom={direction} variants={cardV}
//                     initial="enter" animate="center" exit="exit"
//                     transition={{ duration: 0.45, delay: i * 0.08, ease: "easeOut" }}
//                     whileHover={{ y: -14, transition: { duration: 0.25 } }}
//                     style={{ flex: "0 0 auto" }}>
//                     <Card onClick={() => navigate(f.path)} sx={{
//                       width: 220, height: 225, cursor: "pointer", position: "relative", overflow: "hidden",
//                       background: "linear-gradient(145deg, #1a1a3e 0%, #0d0d28 100%)",
//                       border: `1px solid ${f.accent}30`, borderRadius: 4,
//                       transition: "border-color 0.3s, box-shadow 0.3s",
//                       "&:hover": {
//                         borderColor: `${f.accent}80`,
//                         boxShadow: `0 20px 60px ${f.glow}, 0 0 0 1px ${f.accent}40`,
//                         "& .card-glow": { opacity: 1 },
//                         "& .icon-ring": { boxShadow: `0 0 30px ${f.glow}`, transform: "scale(1.12) rotate(8deg)" },
//                       },
//                       "&::after": { content: '""', position: "absolute", top: 0, right: 0, width: 60, height: 60,
//                         background: `radial-gradient(circle at top right, ${f.accent}20, transparent 70%)` },
//                     }}>
//                       <Box sx={{ position: "absolute", top: 0, left: "15%", right: "15%", height: "2px",
//                         background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }} />
//                       <Box className="card-glow" sx={{ position: "absolute", inset: 0,
//                         background: `radial-gradient(ellipse at center, ${f.accent}10 0%, transparent 70%)`,
//                         opacity: 0, transition: "opacity 0.3s", pointerEvents: "none" }} />

//                       <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center",
//                         justifyContent: "center", height: "100%", p: 3 }}>
//                         <Box className="icon-ring" sx={{ width: 64, height: 64, borderRadius: "50%",
//                           background: `radial-gradient(circle, ${f.accent}22 0%, ${f.accent}08 100%)`,
//                           border: `1.5px solid ${f.accent}60`, display: "flex", alignItems: "center",
//                           justifyContent: "center", color: f.accent, mb: 2,
//                           transition: "box-shadow 0.3s, transform 0.3s", "& svg": { fontSize: "1.7rem" } }}>
//                           {f.icon}
//                         </Box>
//                         <Typography variant="h6" sx={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
//                           fontSize: "0.82rem", textAlign: "center", color: "#f0f0ff", letterSpacing: "0.04em", mb: 0.8 }}>
//                           {f.title}
//                         </Typography>
//                         <Typography variant="body2" sx={{ textAlign: "center", color: "#9999cc",
//                           fontSize: "0.77rem", fontFamily: "'Rajdhani', sans-serif" }}>
//                           {f.desc}
//                         </Typography>
//                         <Box sx={{ mt: 1.5, px: 2, py: 0.5, borderRadius: 99,
//                           border: `1px solid ${f.accent}40`, background: `${f.accent}10` }}>
//                           <Typography sx={{ fontSize: "0.6rem", color: f.accent, letterSpacing: "0.15em",
//                             textTransform: "uppercase", fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>
//                             Launch →
//                           </Typography>
//                         </Box>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </Box>

//             {/* Dot indicators */}
//             <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 3 }}>
//               {features.map((_, i) => (
//                 <Box key={i} component={motion.div}
//                   animate={{ width: i === index ? 24 : 8, opacity: i === index ? 1 : 0.35 }}
//                   transition={{ duration: 0.3 }}
//                   onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
//                   sx={{ height: 8, borderRadius: 99, cursor: "pointer",
//                     background: i === index ? "linear-gradient(90deg, #e040fb, #00e5ff)" : "#9999cc",
//                     boxShadow: i === index ? "0 0 10px rgba(224,64,251,0.6)" : "none" }} />
//               ))}
//             </Box>
//           </Box>
//         </motion.div>
//       </Box>
//     </Box>
//   );
// }