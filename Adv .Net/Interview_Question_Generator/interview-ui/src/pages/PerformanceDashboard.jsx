import { useEffect, useState } from "react";
import api from "../api/axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import HubIcon        from "@mui/icons-material/Hub";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from "recharts";

export default function PerformanceDashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const theme = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;
  const warningC  = theme.palette.warning.main;
  const errorC    = theme.palette.error.main;

  useEffect(() => {
    // ── Fetch ALL test sessions for this user ──────────────────────────────
    // Your backend should return ALL sessions for the logged-in user,
    // not just the latest one. If you only get 1 result, fix the backend
    // (see note at the bottom of this file).
    api.get("/Users/user/results")
      .then(res => {
        const raw = res.data;

        // Handle both array of sessions and single object
        const list = Array.isArray(raw) ? raw : [raw];

        // Map each session to chart data — filter out null scores
        const mapped = list
          .filter(r => r.score !== null && r.score !== undefined)
          .map((r, i) => ({
            name:      `Test ${i + 1}`,
            score:     r.score,
            sessionId: r.sessionId,
            skill:     r.skill?.skillName || r.skillName || "General",
            date:      r.completedAt
              ? new Date(r.completedAt).toLocaleDateString()
              : `Session ${r.sessionId}`,
          }));

        setResults(mapped);
      })
      .catch(() => setError("Failed to load performance data."))
      .finally(() => setLoading(false));
  }, []);

  // ── Computed stats ─────────────────────────────────────────────────────
  const totalTests = results.length;
  const avgScore   = totalTests > 0
    ? (results.reduce((s, r) => s + r.score, 0) / totalTests).toFixed(1)
    : "0";
  const bestScore  = totalTests > 0 ? Math.max(...results.map(r => r.score)) : 0;
  const latestScore = totalTests > 0 ? results[results.length - 1].score : 0;

  // Score color based on value
  const scoreColor = (s) =>
    s >= 70 ? successC : s >= 40 ? warningC : errorC;

  // ── Custom tooltip ─────────────────────────────────────────────────────
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const val = payload[0].value;
    return (
      <Box sx={{ background:"#0d1f3c", border:`1px solid ${primary}30`,
        borderRadius:"10px", p:"12px 16px",
        boxShadow:`0 8px 24px rgba(0,0,0,0.5)` }}>
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.58rem", color:primary, letterSpacing:"0.1em", mb:0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
          fontWeight:800, fontSize:"1.1rem", color:scoreColor(val),
          textShadow:`0 0 10px ${scoreColor(val)}60` }}>
          {val}
          <Box component="span" sx={{ fontSize:"0.72rem", color:textSec, ml:0.5 }}>pts</Box>
        </Typography>
        {payload[0].payload?.skill && (
          <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
            fontSize:"0.52rem", color:textSec, mt:0.3, letterSpacing:"0.08em" }}>
            {payload[0].payload.skill}
          </Typography>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display:"flex", minHeight:"100vh", background:bg, position:"relative" }}>

      {/* Ambient glows */}
      <Box sx={{ position:"fixed", top:"-8%", left:"45%", width:480, height:480,
        borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter:"blur(65px)", zIndex:0 }} />
      <Box sx={{ position:"fixed", bottom:"5%", right:"2%", width:340, height:340,
        borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter:"blur(55px)", zIndex:0 }} />

      <Box sx={{ position:"relative", zIndex:20 }}><Sidebar /></Box>

      <Box sx={{ flex:1, p:{ xs:2, md:"36px 32px" }, position:"relative", zIndex:2 }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}>
          <Box sx={{ mb:4 }}>
            <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
              <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                METRICS // PERFORMANCE
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily:"'Exo 2', sans-serif", fontWeight:900,
              fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
              background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              Performance
            </Typography>
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
              color:textSec, fontSize:"0.85rem", mt:0.4 }}>
              {totalTests > 0
                ? `${totalTests} test${totalTests !== 1 ? "s" : ""} completed`
                : "No tests completed yet"}
            </Typography>
          </Box>
        </motion.div>

        {/* ── ERROR ── */}
        {error && (
          <Box sx={{ mb:3, px:2, py:"11px", borderRadius:"10px",
            background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.3)" }}>
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
              fontSize:"0.88rem", color:errorC }}>{error}</Typography>
          </Box>
        )}

        {/* ── STAT CARDS ── */}
        <Box sx={{ display:"flex", gap:2, mb:4, flexWrap:"wrap" }}>
          {[
            { label:"Total Tests",    value: loading ? "—" : totalTests,    icon:<AssignmentIcon />, color:primary   },
            { label:"Average Score",  value: loading ? "—" : avgScore,      icon:<TrendingUpIcon />, color:secondary },
            { label:"Best Score",     value: loading ? "—" : bestScore,     icon:<EmojiEventsIcon />, color:"#fbbf24" },
            { label:"Latest Score",   value: loading ? "—" : latestScore,   icon:<TrendingUpIcon />, color:successC  },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.1+i*0.08, type:"spring", stiffness:180 }}
              whileHover={{ y:-5, transition:{ type:"spring", stiffness:400 } }}>
              <Box sx={{
                borderRadius:"14px", p:"16px 20px", minWidth:170,
                background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                border:`1px solid rgba(34,211,238,0.12)`,
                boxShadow:`0 4px 20px rgba(0,0,0,0.3)`,
                position:"relative", overflow:"hidden",
                transition:"border-color 0.25s, box-shadow 0.25s",
                "&:hover":{ borderColor:`${s.color}40`, boxShadow:`0 8px 28px ${s.color}18` },
                "&::before":{ content:'""', position:"absolute",
                  top:0, left:0, right:0, height:"2px",
                  background:`linear-gradient(90deg, transparent, ${s.color}90, transparent)` },
              }}>
                <Box sx={{ display:"flex", justifyContent:"space-between",
                  alignItems:"flex-start", mb:0.5 }}>
                  <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                    fontSize:"0.55rem", color:textSec, letterSpacing:"0.1em",
                    textTransform:"uppercase" }}>
                    {s.label}
                  </Typography>
                  <Box sx={{ width:28, height:28, borderRadius:"8px",
                    background:`${s.color}18`, border:`1px solid ${s.color}30`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:s.color, "& svg":{ fontSize:"0.95rem" } }}>
                    {s.icon}
                  </Box>
                </Box>
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontWeight:900, fontSize:"1.8rem", color:textPri, lineHeight:1,
                  textShadow:`0 0 16px ${s.color}40` }}>
                  {s.value}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* ── AREA CHART ── */}
        <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.3, duration:0.6 }}>
          <Box sx={{
            borderRadius:"16px", p:"24px 24px 16px", mb:3,
            background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
            border:`1px solid rgba(34,211,238,0.13)`,
            boxShadow:`0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.06)`,
            position:"relative", overflow:"hidden",
            "&::before":{ content:'""', position:"absolute",
              top:0, left:"8%", right:"8%", height:"1.5px",
              background:`linear-gradient(90deg, transparent, ${primary}70, ${secondary}50, transparent)` },
          }}>
            <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:3 }}>
              <TrendingUpIcon sx={{ color:primary, fontSize:"1.1rem" }} />
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontWeight:700, fontSize:"1rem", color:textPri }}>
                Score Trend
              </Typography>
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.52rem", color:textSec, letterSpacing:"0.12em", ml:0.5 }}>
                // ALL_SESSIONS ({totalTests} total)
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display:"flex", justifyContent:"center", py:6 }}>
                <CircularProgress sx={{ color:primary }} />
              </Box>
            ) : results.length === 0 ? (
              <Box sx={{ textAlign:"center", py:6,
                border:`1px dashed rgba(34,211,238,0.15)`, borderRadius:"12px" }}>
                <TrendingUpIcon sx={{ color:primary, fontSize:"2.5rem", opacity:0.3, mb:1 }} />
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  color:textSec, fontSize:"0.9rem" }}>
                  No test data yet. Take a test to see your trend!
                </Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={results} margin={{ top:8, right:8, bottom:0, left:-10 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={primary} stopOpacity="0.3" />
                      <stop offset="95%" stopColor={primary} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3"
                    stroke="rgba(34,211,238,0.07)" vertical={false} />
                  <XAxis dataKey="name"
                    tick={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:10, fill:textSec, letterSpacing:"0.08em" }}
                    axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]}
                    tick={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:10, fill:textSec }}
                    axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="score"
                    stroke={primary} strokeWidth={2.5}
                    fill="url(#scoreGrad)" dot={false}
                    activeDot={{ r:5, fill:primary,
                      stroke:"#0d1f3c", strokeWidth:2,
                      filter:`drop-shadow(0 0 6px ${primary})` }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Box>
        </motion.div>

        {/* ── BAR CHART (score per test) ── */}
        {!loading && results.length > 0 && (
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.4, duration:0.6 }}>
            <Box sx={{
              borderRadius:"16px", p:"24px 24px 16px",
              background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
              border:`1px solid rgba(34,211,238,0.13)`,
              boxShadow:`0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.06)`,
              position:"relative", overflow:"hidden",
              "&::before":{ content:'""', position:"absolute",
                top:0, left:"8%", right:"8%", height:"1.5px",
                background:`linear-gradient(90deg, transparent, ${secondary}70, ${primary}50, transparent)` },
            }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:3 }}>
                <AssignmentIcon sx={{ color:secondary, fontSize:"1.1rem" }} />
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontWeight:700, fontSize:"1rem", color:textPri }}>
                  Score per Test
                </Typography>
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.52rem", color:textSec, letterSpacing:"0.12em", ml:0.5 }}>
                  // COLOR_CODED_BY_SCORE
                </Typography>
              </Box>

              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={results} margin={{ top:8, right:8, bottom:0, left:-10 }}
                  barSize={results.length > 10 ? 16 : 28}>
                  <CartesianGrid strokeDasharray="3 3"
                    stroke="rgba(34,211,238,0.07)" vertical={false} />
                  <XAxis dataKey="name"
                    tick={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:10, fill:textSec }}
                    axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]}
                    tick={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:10, fill:textSec }}
                    axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="score" radius={[6,6,0,0]}>
                    {results.map((r, i) => (
                      <Cell key={i}
                        fill={scoreColor(r.score)}
                        opacity={0.85}
                        style={{ filter:`drop-shadow(0 0 4px ${scoreColor(r.score)}60)` }}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Legend */}
              <Box sx={{ display:"flex", gap:2.5, mt:1.5, justifyContent:"center" }}>
                {[
                  { color:successC, label:"≥70 Good" },
                  { color:warningC, label:"40–69 Average" },
                  { color:errorC,   label:"<40 Needs work" },
                ].map(({ color, label }) => (
                  <Box key={label} sx={{ display:"flex", alignItems:"center", gap:0.7 }}>
                    <Box sx={{ width:8, height:8, borderRadius:"50%",
                      background:color, boxShadow:`0 0 5px ${color}` }} />
                    <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:"0.5rem", color:textSec, letterSpacing:"0.08em" }}>
                      {label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* ── SESSION HISTORY TABLE ── */}
        {!loading && results.length > 0 && (
          <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.5, duration:0.6 }}>
            <Box sx={{
              borderRadius:"16px", p:"24px", mt:3,
              background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
              border:`1px solid rgba(34,211,238,0.13)`,
              boxShadow:`0 4px 32px rgba(0,0,0,0.4)`,
            }}>
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.52rem", color:"rgba(71,85,105,0.85)",
                letterSpacing:"0.18em", mb:2 }}>
                // SESSION_HISTORY
              </Typography>

              {results.map((r, i) => (
                <motion.div key={r.sessionId || i}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay:0.05*i }}>
                  <Box sx={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    py:"12px", px:"16px", mb:1, borderRadius:"10px",
                    background:"rgba(34,211,238,0.03)",
                    border:`1px solid rgba(34,211,238,0.08)`,
                    transition:"all 0.22s",
                    "&:hover":{ background:"rgba(34,211,238,0.07)",
                      border:`1px solid rgba(34,211,238,0.2)` },
                  }}>
                    <Box sx={{ display:"flex", alignItems:"center", gap:1.5 }}>
                      <Box sx={{ width:28, height:28, borderRadius:"7px",
                        background:`${scoreColor(r.score)}18`,
                        border:`1px solid ${scoreColor(r.score)}35`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.6rem", fontWeight:700,
                          color:scoreColor(r.score) }}>
                          {String(i+1).padStart(2,"0")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                          fontWeight:600, fontSize:"0.88rem", color:textPri }}>
                          {r.name}
                        </Typography>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.52rem", color:textSec, letterSpacing:"0.06em" }}>
                          {r.skill} · {r.date}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ px:1.8, py:"5px", borderRadius:"7px",
                      background:`${scoreColor(r.score)}15`,
                      border:`1px solid ${scoreColor(r.score)}35` }}>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontWeight:800, fontSize:"1rem",
                        color:scoreColor(r.score) }}>
                        {r.score}
                        <Box component="span" sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.55rem", color:textSec, ml:0.4 }}>pts</Box>
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        )}

        <Box sx={{ height:40 }} />
      </Box>
    </Box>
  );
}

/*
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔴 BACKEND FIX — if you're only getting 1 test result:

  In your UsersController, find the endpoint GET /Users/user/results
  and make sure it returns ALL sessions for the user, not just FindAsync.

  It should look like this:

  [HttpGet("user/results")]
  public async Task<IActionResult> GetUserResults()
  {
      var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

      var sessions = await _db.TestSessions
          .Include(s => s.Skill)
          .Where(s => s.UserId == userId && s.Score != null)  // ← ALL sessions, not just one
          .OrderBy(s => s.CompletedAt)
          .Select(s => new {
              s.SessionId,
              s.Score,
              s.CompletedAt,
              SkillName = s.Skill.SkillName
          })
          .ToListAsync();

      return Ok(sessions);
  }

  The key fix is:
  - Use .Where() to get ALL sessions for userId
  - NOT FindAsync() which returns only 1 record by primary key
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/