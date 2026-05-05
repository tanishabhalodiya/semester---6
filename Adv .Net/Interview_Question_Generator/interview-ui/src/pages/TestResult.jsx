import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon      from "@mui/icons-material/Cancel";
import DashboardIcon   from "@mui/icons-material/Dashboard";
import HubIcon         from "@mui/icons-material/Hub";
import FeedbackModal   from "../components/FeedbackModal";   // ← import modal

// ── Change this to however you get your logged-in user id ──────────────────
const CURRENT_USER_ID = 1; // 🔴 replace with auth context / localStorage

export default function TestResult() {
  const { sessionId } = useParams();
  const navigate      = useNavigate();
  const theme         = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;
  const errorC    = theme.palette.error.main;

  const [details,       setDetails]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [feedbackOpen,  setFeedbackOpen]  = useState(false); // ← controls modal

  useEffect(() => {
    api.get(`/TestSessions/${sessionId}`).then(res => {
      setDetails(JSON.parse(res.data.userAnswersJson || "[]"));
    }).finally(() => {
      setLoading(false);
      // ✅ Auto-open feedback modal 1.5s after results load
      setTimeout(() => setFeedbackOpen(true), 1500);
    });
  }, [sessionId]);

  const total      = details.length;
  const correct    = details.filter(d => d.isCorrect).length;
  const score      = total > 0 ? Math.round((correct / total) * 100) : 0;
  const scoreColor = score >= 70 ? successC : score >= 40 ? theme.palette.warning.main : errorC;

  if (loading) return (
    <Box sx={{ minHeight:"100vh", background:bg,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <CircularProgress sx={{ color:primary }} />
    </Box>
  );

  return (
    <Box sx={{ minHeight:"100vh", background:bg,
      p:{ xs:2, md:"36px 32px" }, position:"relative", overflow:"hidden" }}>

      {/* Ambient glows */}
      <Box sx={{ position:"fixed", top:"-8%", left:"40%", width:480, height:480,
        borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter:"blur(65px)", zIndex:0 }} />
      <Box sx={{ position:"fixed", bottom:"5%", right:"2%", width:340, height:340,
        borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter:"blur(55px)", zIndex:0 }} />

      <Box sx={{ maxWidth:820, mx:"auto", position:"relative", zIndex:2 }}>

        {/* Header */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}>
          <Box sx={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", mb:4, flexWrap:"wrap", gap:2 }}>
            <Box>
              <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
                <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                  ANALYSIS // TEST_RESULT
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
                background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                Test Result
              </Typography>
            </Box>

            {/* Actions */}
            <Box sx={{ display:"flex", gap:1.2, flexWrap:"wrap" }}>
              {/* Leave Feedback button (manual trigger) */}
              <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                <Box onClick={() => setFeedbackOpen(true)} sx={{
                  display:"flex", alignItems:"center", gap:0.8,
                  px:2, py:"10px", borderRadius:"9px", cursor:"pointer",
                  background:`${secondary}10`, border:`1px solid ${secondary}35`,
                  transition:"all 0.22s",
                  "&:hover":{ background:`${secondary}20`, border:`1px solid ${secondary}55` },
                }}>
                  <Typography sx={{ fontSize:"0.9rem" }}>⭐</Typography>
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontSize:"0.82rem", fontWeight:600, color:secondary }}>
                    Feedback
                  </Typography>
                </Box>
              </motion.div>

              {/* Back to tests */}
              <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                <Box onClick={() => navigate("/user/tests")} sx={{
                  display:"flex", alignItems:"center", gap:1,
                  px:2, py:"10px", borderRadius:"9px", cursor:"pointer",
                  border:`1px solid rgba(34,211,238,0.18)`,
                  background:"rgba(34,211,238,0.04)", transition:"all 0.22s",
                  "&:hover":{ background:"rgba(34,211,238,0.1)",
                    border:`1px solid ${primary}40` },
                }}>
                  <DashboardIcon sx={{ color:primary, fontSize:"1rem" }} />
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontSize:"0.82rem", fontWeight:500, color:textSec }}>
                    Back to Tests
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Score summary card */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.5 }}>
          <Box sx={{ borderRadius:"16px", p:"24px 28px", mb:4,
            background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
            border:`1px solid rgba(34,211,238,0.15)`,
            boxShadow:`0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.07)`,
            position:"relative", overflow:"hidden",
            "&::before":{ content:'""', position:"absolute",
              top:0, left:"8%", right:"8%", height:"1.5px",
              background:`linear-gradient(90deg, transparent, ${scoreColor}80, transparent)` },
          }}>
            <Box sx={{ display:"flex", alignItems:"center", gap:3, flexWrap:"wrap" }}>
              {/* SVG score circle */}
              <Box sx={{ position:"relative", width:90, height:90, flexShrink:0 }}>
                <svg width="90" height="90" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="45" cy="45" r="38" fill="none"
                    stroke={`${scoreColor}20`} strokeWidth="5" />
                  <motion.circle cx="45" cy="45" r="38" fill="none"
                    stroke={scoreColor} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 38}
                    initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 38 * (1 - score / 100) }}
                    transition={{ duration:1.4, ease:[0.34,1.56,0.64,1], delay:0.3 }}
                    style={{ filter:`drop-shadow(0 0 6px ${scoreColor}80)` }}
                  />
                </svg>
                <Box sx={{ position:"absolute", inset:0, display:"flex",
                  alignItems:"center", justifyContent:"center" }}>
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontWeight:900, fontSize:"1.3rem",
                    color:scoreColor, textShadow:`0 0 12px ${scoreColor}60` }}>
                    {score}%
                  </Typography>
                </Box>
              </Box>

              {/* Stats */}
              <Box sx={{ flex:1 }}>
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontWeight:800, fontSize:"1.15rem", color:textPri, mb:1.5 }}>
                  {score >= 70 ? "Excellent work! 🎉" : score >= 40 ? "Good effort! 💪" : "Keep practicing! 📚"}
                </Typography>
                <Box sx={{ display:"flex", gap:2, flexWrap:"wrap" }}>
                  {[
                    { label:"Total",   val:total,          color:primary   },
                    { label:"Correct", val:correct,         color:successC  },
                    { label:"Wrong",   val:total - correct, color:errorC    },
                  ].map(s => (
                    <Box key={s.label} sx={{ px:2, py:1, borderRadius:"9px",
                      background:`${s.color}12`, border:`1px solid ${s.color}30` }}>
                      <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                        fontSize:"0.55rem", color:s.color, letterSpacing:"0.1em", mb:0.3 }}>
                        {s.label.toUpperCase()}
                      </Typography>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontWeight:800, fontSize:"1.2rem", color:s.color }}>
                        {s.val}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* Question details */}
        {details.map((d, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.15 + i * 0.05 }}>
            <Box sx={{
              borderRadius:"12px", p:"18px 20px", mb:2,
              background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
              border:`1px solid ${d.isCorrect ? successC + "25" : errorC + "25"}`,
              boxShadow:`0 4px 16px rgba(0,0,0,0.25)`,
              position:"relative", overflow:"hidden",
              "&::before":{ content:'""', position:"absolute",
                top:0, left:0, bottom:0, width:"3px",
                background: d.isCorrect ? successC : errorC,
                boxShadow:`0 0 8px ${d.isCorrect ? successC : errorC}60` },
            }}>
              <Box sx={{ display:"flex", alignItems:"flex-start", gap:1.2, mb:1.2 }}>
                {d.isCorrect
                  ? <CheckCircleIcon sx={{ color:successC, fontSize:"1rem", mt:0.2, flexShrink:0 }} />
                  : <CancelIcon     sx={{ color:errorC,   fontSize:"1rem", mt:0.2, flexShrink:0 }} />}
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.6rem", color:textSec, letterSpacing:"0.08em" }}>
                  QUESTION_ID: {d.questionId}
                </Typography>
              </Box>

              <Box sx={{ ml:"28px" }}>
                <Box sx={{ display:"inline-flex", alignItems:"center", gap:0.8,
                  px:1.5, py:"5px", borderRadius:"7px", mb: d.isCorrect ? 0 : 1,
                  background: d.isCorrect ? `${successC}12` : `${errorC}12`,
                  border:`1px solid ${d.isCorrect ? successC + "35" : errorC + "35"}` }}>
                  <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                    fontSize:"0.58rem", color:textSec, letterSpacing:"0.08em" }}>
                    YOUR ANSWER:
                  </Typography>
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontWeight:700, fontSize:"0.82rem",
                    color: d.isCorrect ? successC : errorC }}>
                    {d.userAnswer}
                  </Typography>
                </Box>

                {!d.isCorrect && (
                  <Box sx={{ display:"inline-flex", alignItems:"center", gap:0.8,
                    px:1.5, py:"5px", borderRadius:"7px", ml:1,
                    background:`${successC}12`, border:`1px solid ${successC}35` }}>
                    <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:"0.58rem", color:textSec, letterSpacing:"0.08em" }}>
                      CORRECT:
                    </Typography>
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontWeight:700, fontSize:"0.82rem", color:successC }}>
                      {d.correctAnswer}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        ))}

        <Box sx={{ height:40 }} />
      </Box>

      {/* ── Feedback Modal ── */}
      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        userId={CURRENT_USER_ID}
        questionId={parseInt(sessionId)}  // pass sessionId as the reference
        title="How was this test session?"
      />
    </Box>
  );
}