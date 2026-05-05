import { useEffect, useState } from "react";
import api from "../api/axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardIcon  from "@mui/icons-material/Dashboard";
import PlayArrowIcon  from "@mui/icons-material/PlayArrow";
import QuizIcon       from "@mui/icons-material/Quiz";
import HubIcon        from "@mui/icons-material/Hub";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CodeIcon       from "@mui/icons-material/Code";
import RefreshIcon    from "@mui/icons-material/Refresh";

export default function AvailableTests() {
  const [tests,   setTests]   = useState([]);
  const [loading, setLoading] = useState(true);
  const theme    = useTheme();
  const navigate = useNavigate();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;
  const warningC  = theme.palette.warning.main;

  useEffect(() => {
    api.get("/Users/user/available")
      .then(res => setTests(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <Box sx={{ minHeight:"100vh", background:bg,
      display:"flex", alignItems:"center", justifyContent:"center" }}>
      <Box sx={{ textAlign:"center" }}>
        <CircularProgress sx={{ color:primary, mb:2 }} />
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.65rem", color:primary, letterSpacing:"0.2em" }}>
          FETCHING_TESTS...
        </Typography>
      </Box>
    </Box>
  );

  // ── Separate new tests from reassigned tests ────────────────────────────
  // A test is "reassigned" if it has a isReassigned flag or if its score was
  // reset to null by the admin. The API should return both types.
  // We distinguish them by checking if t.isReassigned === true (add this to your
  // backend response) — if your backend doesn't support it yet, all tests
  // show as new, which still works correctly.
  const newTests        = tests.filter(t => !t.isReassigned);
  const reassignedTests = tests.filter(t =>  t.isReassigned);

  const TestCard = ({ t, isReassigned }) => (
    <motion.div
      initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
      transition={{ type:"spring", stiffness:180 }}>
      <Box sx={{
        borderRadius:"14px", p:"20px 24px", mb:2.5,
        background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
        border:`1px solid ${isReassigned ? warningC + "20" : "rgba(34,211,238,0.12)"}`,
        boxShadow:`0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(34,211,238,0.05)`,
        position:"relative", overflow:"hidden", transition:"all 0.25s",
        "&:hover":{ borderColor: isReassigned ? `${warningC}40` : `rgba(34,211,238,0.28)`,
          boxShadow: isReassigned
            ? `0 8px 32px ${warningC}12`
            : `0 8px 32px rgba(34,211,238,0.1)` },
        "&::before":{ content:'""', position:"absolute",
          top:0, left:0, bottom:0, width:"3px",
          background: isReassigned
            ? `linear-gradient(180deg, ${warningC}, ${secondary})`
            : `linear-gradient(180deg, ${primary}, ${secondary})`,
          boxShadow: isReassigned
            ? `0 0 10px ${warningC}60`
            : `0 0 10px ${primary}60` },
      }}>
        <Box sx={{ display:"flex", alignItems:"center",
          justifyContent:"space-between", flexWrap:"wrap", gap:2 }}>
          <Box sx={{ flex:1 }}>
            {/* Chips */}
            <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:1, flexWrap:"wrap" }}>
              <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
                background:`${primary}15`, border:`1px solid ${primary}30` }}>
                <Box sx={{ display:"flex", alignItems:"center", gap:0.6 }}>
                  <CodeIcon sx={{ color:primary, fontSize:"0.7rem" }} />
                  <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                    fontSize:"0.58rem", color:primary, letterSpacing:"0.1em" }}>
                    {t.skill || "GENERAL"}
                  </Typography>
                </Box>
              </Box>

              {/* ACTIVE or REASSIGNED badge */}
              <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
                background: isReassigned ? `${warningC}12` : `${successC}12`,
                border:`1px solid ${isReassigned ? warningC + "30" : successC + "30"}` }}>
                <Box sx={{ display:"flex", alignItems:"center", gap:0.5 }}>
                  {isReassigned && <RefreshIcon sx={{ color:warningC, fontSize:"0.65rem" }} />}
                  <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                    fontSize:"0.56rem",
                    color: isReassigned ? warningC : successC,
                    letterSpacing:"0.1em" }}>
                    {isReassigned ? "REASSIGNED" : "ACTIVE"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
              fontWeight:700, fontSize:"1rem", color:textPri, mb:0.5 }}>
              Test Session #{t.sessionId}
            </Typography>

            {isReassigned && (
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontSize:"0.78rem", color:warningC, mb:0.5, opacity:0.9 }}>
                ↺ Admin has updated this test — you can retake it
              </Typography>
            )}

            <Box sx={{ display:"flex", alignItems:"center", gap:0.6 }}>
              <AccessTimeIcon sx={{ color:textSec, fontSize:"0.8rem" }} />
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontSize:"0.78rem", color:textSec }}>
                {new Date(t.startedAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {/* Start button */}
          <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}>
            <Box onClick={() => navigate(`/user/test/${t.sessionId}`)} sx={{
              display:"flex", alignItems:"center", gap:1,
              px:2.5, py:1, borderRadius:"10px", cursor:"pointer",
              background: isReassigned
                ? `linear-gradient(135deg, #92400e, ${warningC}cc)`
                : `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`,
              boxShadow: isReassigned
                ? `0 4px 18px ${warningC}40`
                : `0 4px 18px ${primary}40`,
              transition:"all 0.25s",
              "&:hover":{ boxShadow: isReassigned
                ? `0 8px 28px ${warningC}60`
                : `0 8px 28px ${primary}60` },
            }}>
              <PlayArrowIcon sx={{ color:"#030712", fontSize:"1.1rem" }} />
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontWeight:800, fontSize:"0.82rem", color:"#030712",
                letterSpacing:"0.06em", textTransform:"uppercase" }}>
                {isReassigned ? "Retake" : "Start Test"}
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );

  return (
    <Box sx={{ minHeight:"100vh", background:bg,
      p:{ xs:2, md:"36px 32px" }, position:"relative", overflow:"hidden" }}>

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
                  ARENA // AVAILABLE_TESTS
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
                background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                Available Tests
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:textSec, fontSize:"0.85rem", mt:0.4 }}>
                {tests.length} test{tests.length !== 1 ? "s" : ""} ready to attempt
              </Typography>
            </Box>

            <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
              <Box onClick={() => navigate("/user/dashboard")} sx={{
                display:"flex", alignItems:"center", gap:1,
                px:2, py:1, borderRadius:"9px", cursor:"pointer",
                border:`1px solid rgba(34,211,238,0.18)`,
                background:"rgba(34,211,238,0.04)", transition:"all 0.22s",
                "&:hover":{ background:"rgba(34,211,238,0.1)", border:`1px solid ${primary}40` },
              }}>
                <DashboardIcon sx={{ color:primary, fontSize:"1rem" }} />
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontSize:"0.82rem", fontWeight:500, color:textSec }}>
                  Dashboard
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Empty state */}
        {tests.length === 0 && (
          <Box sx={{ textAlign:"center", py:8,
            border:`1px dashed rgba(34,211,238,0.18)`, borderRadius:"14px",
            background:"rgba(34,211,238,0.02)" }}>
            <QuizIcon sx={{ color:primary, fontSize:"2.5rem", opacity:0.4, mb:1 }} />
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif", color:textSec }}>
              No active tests available.
            </Typography>
          </Box>
        )}

        {/* ── Reassigned tests (shown first with amber highlight) ── */}
        {reassignedTests.length > 0 && (
          <>
            <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:1.5 }}>
              <RefreshIcon sx={{ color:warningC, fontSize:"0.85rem" }} />
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.52rem", color:warningC, letterSpacing:"0.18em" }}>
                // REASSIGNED_BY_ADMIN · YOU CAN RETAKE THESE
              </Typography>
            </Box>
            {reassignedTests.map(t => (
              <TestCard key={t.sessionId} t={t} isReassigned={true} />
            ))}
          </>
        )}

        {/* ── New / regular tests ── */}
        {newTests.length > 0 && (
          <>
            {reassignedTests.length > 0 && (
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.52rem", color:"rgba(71,85,105,0.85)",
                letterSpacing:"0.18em", mb:1.5, mt:1 }}>
                // NEW_TESTS
              </Typography>
            )}
            {newTests.map(t => (
              <TestCard key={t.sessionId} t={t} isReassigned={false} />
            ))}
          </>
        )}
      </Box>
    </Box>
  );
}