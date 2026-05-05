import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Box, Typography, CircularProgress,
  Select, MenuItem, FormControl
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminSidebar   from "../../components/AdminSidebar";
import HubIcon        from "@mui/icons-material/Hub";
import AddCircleIcon  from "@mui/icons-material/AddCircle";
import EditIcon       from "@mui/icons-material/Edit";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuizIcon       from "@mui/icons-material/Quiz";
import RefreshIcon    from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CloseIcon      from "@mui/icons-material/Close";

// ── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmReassignDialog({ open, session, onConfirm, onCancel }) {
  const theme     = useTheme();
  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const warningC  = theme.palette.warning.main;
  const errorC    = theme.palette.error.main;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onCancel}
            style={{
              position:"fixed", inset:0, zIndex:1200,
              background:"rgba(3,7,18,0.8)", backdropFilter:"blur(6px)",
            }} />

          {/* Dialog */}
          <motion.div
            initial={{ opacity:0, scale:0.88, y:20 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.88, y:20 }}
            transition={{ type:"spring", stiffness:280, damping:22 }}
            style={{
              position:"fixed", inset:0, zIndex:1300,
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"16px", pointerEvents:"none",
            }}>
            <Box sx={{
              pointerEvents:"auto", width:"100%", maxWidth:440,
              borderRadius:"18px", p:"28px 26px",
              background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
              border:`1px solid rgba(251,146,60,0.3)`,
              boxShadow:`0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(251,146,60,0.1)`,
              position:"relative", overflow:"hidden",
              "&::before":{ content:'""', position:"absolute",
                top:0, left:"10%", right:"10%", height:"1.5px",
                background:`linear-gradient(90deg, transparent, ${warningC}80, transparent)` },
            }}>
              {/* Close */}
              <Box onClick={onCancel} sx={{
                position:"absolute", top:14, right:14,
                width:28, height:28, borderRadius:"7px", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                background:"rgba(34,211,238,0.06)", border:"1px solid rgba(34,211,238,0.15)",
                transition:"all 0.2s",
                "&:hover":{ background:"rgba(34,211,238,0.14)" },
              }}>
                <CloseIcon sx={{ color:textSec, fontSize:"0.85rem" }} />
              </Box>

              {/* Icon */}
              <Box sx={{ width:52, height:52, borderRadius:"14px", mb:2,
                background:`${warningC}18`, border:`1px solid ${warningC}40`,
                display:"flex", alignItems:"center", justifyContent:"center",
                boxShadow:`0 0 20px ${warningC}25` }}>
                <WarningAmberIcon sx={{ color:warningC, fontSize:"1.5rem" }} />
              </Box>

              <Typography sx={{ fontFamily:"'Exo 2', sans-serif", fontWeight:800,
                fontSize:"1.1rem", color:textPri, mb:0.8 }}>
                Reassign Session #{session?.sessionId}?
              </Typography>

              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontSize:"0.9rem", color:textSec, lineHeight:1.65, mb:1 }}>
                This will <Box component="span" sx={{ color:warningC, fontWeight:700 }}>
                  reset the user's previous test result
                </Box> for this session. The user will be able to take the test again with the new questions.
              </Typography>

              {/* Info box */}
              <Box sx={{ px:2, py:"10px", borderRadius:"9px", mb:2.5,
                background:"rgba(251,146,60,0.07)", border:"1px solid rgba(251,146,60,0.2)" }}>
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.6rem", color:warningC, letterSpacing:"0.1em" }}>
                  ⚠ PREVIOUS SCORE AND ANSWERS WILL BE CLEARED
                </Typography>
              </Box>

              {/* Buttons */}
              <Box sx={{ display:"flex", gap:1.5 }}>
                <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  style={{ flex:1 }}>
                  <Box onClick={onCancel} sx={{
                    py:"11px", borderRadius:"10px", textAlign:"center", cursor:"pointer",
                    background:"rgba(34,211,238,0.05)", border:"1px solid rgba(34,211,238,0.18)",
                    transition:"all 0.22s",
                    "&:hover":{ background:"rgba(34,211,238,0.1)" },
                  }}>
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontWeight:600, fontSize:"0.88rem", color:textSec }}>
                      Cancel
                    </Typography>
                  </Box>
                </motion.div>

                <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  style={{ flex:2 }}>
                  <Box onClick={onConfirm} sx={{
                    py:"11px", borderRadius:"10px", textAlign:"center", cursor:"pointer",
                    background:`linear-gradient(135deg, #92400e, ${warningC}cc)`,
                    border:`1px solid ${warningC}55`,
                    boxShadow:`0 4px 18px ${warningC}35`,
                    transition:"all 0.25s",
                    "&:hover":{ boxShadow:`0 8px 28px ${warningC}50` },
                  }}>
                    <Box sx={{ display:"flex", alignItems:"center",
                      justifyContent:"center", gap:0.8 }}>
                      <RefreshIcon sx={{ color:"#030712", fontSize:"1rem" }} />
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontWeight:800, fontSize:"0.88rem", color:"#030712",
                        letterSpacing:"0.06em", textTransform:"uppercase" }}>
                        Yes, Reassign
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ManageSessions() {
  const [sessions,       setSessions]       = useState([]);
  const [skills,         setSkills]         = useState([]);
  const [skillId,        setSkillId]        = useState("");
  const [loading,        setLoading]        = useState(true);
  const [creating,       setCreating]       = useState(false);
  const [confirmSession, setConfirmSession] = useState(null); // session to reassign
  const [resetting,      setResetting]      = useState(null); // sessionId being reset

  const navigate = useNavigate();
  const theme    = useTheme();

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
    Promise.all([loadSessions(), loadSkills()]).finally(() => setLoading(false));
  }, []);

  const loadSessions = async () => {
    const res = await api.get("/TestSessions/admin/sessions");
    setSessions(res.data);
  };

  const loadSkills = async () => {
    const res = await api.get("/Skills");
    setSkills(res.data);
  };

  const createSession = async () => {
    if (!skillId) { alert("Please select a skill"); return; }
    try {
      setCreating(true);
      await api.post("/TestSessions/admin/create-session", { skillId: Number(skillId) });
      setSkillId("");
      await loadSessions();
    } catch { alert("Error creating session"); }
    finally { setCreating(false); }
  };

  // ── Called after admin confirms reassign ─────────────────────────────────
  // This resets the session result so the user can retake the test,
  // then navigates to the assign page in edit mode.
  const handleConfirmReassign = async () => {
    const s = confirmSession;
    setConfirmSession(null);
    setResetting(s.sessionId);
    try {
      // 🔴 Reset the user's result for this session so they can retake it.
      // This calls PUT /TestSessions/admin/reset/{sessionId} — see note below.
      await api.put(`/TestSessions/admin/reset/${s.sessionId}`);
      await loadSessions();
      navigate(`/admin/assign/${s.sessionId}?mode=edit`);
    } catch {
      alert("Failed to reset session result. Please check your backend.");
    } finally { setResetting(null); }
  };

  const selectSx = {
    fontFamily:"'Exo 2', sans-serif", color:textPri, fontSize:"0.9rem",
    background:paper, border:`1px solid rgba(34,211,238,0.18)`, borderRadius:"10px",
    transition:"all 0.25s",
    "& .MuiOutlinedInput-notchedOutline":{ border:"none" },
    "& .MuiSvgIcon-root":{ color:primary },
    "&:hover":{ border:`1px solid ${primary}50` },
    "&.Mui-focused":{ border:`1px solid ${primary}70`, boxShadow:`0 0 0 3px ${primary}15` },
  };
  const menuProps = { PaperProps:{ sx:{
    background:"#0d1f3c", border:`1px solid rgba(34,211,238,0.18)`,
    borderRadius:"10px", mt:0.5,
    "& .MuiMenuItem-root":{ fontFamily:"'Exo 2', sans-serif", fontSize:"0.88rem",
      color:textSec, py:1,
      "&:hover":{ background:`${primary}15`, color:primary },
      "&.Mui-selected":{ background:`${primary}18`, color:primary },
    },
  }}};

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

      <Box sx={{ position:"relative", zIndex:20 }}><AdminSidebar /></Box>

      <Box sx={{ flex:1, p:{ xs:2, md:"36px 32px" }, position:"relative", zIndex:2 }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}>
          <Box sx={{ mb:4 }}>
            <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
              <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                ADMIN // TEST_SESSIONS
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily:"'Exo 2', sans-serif", fontWeight:900,
              fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
              background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              Manage Sessions
            </Typography>
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
              color:textSec, fontSize:"0.85rem", mt:0.4 }}>
              {sessions.length} active test session{sessions.length !== 1 ? "s" : ""}
            </Typography>
          </Box>
        </motion.div>

        {/* ── CREATE SESSION ── */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.55 }}>
          <Box sx={{
            borderRadius:"16px", p:"24px 26px", mb:4,
            background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
            border:`1px solid rgba(34,211,238,0.13)`,
            boxShadow:`0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.06)`,
            position:"relative", overflow:"hidden",
            "&::before":{ content:'""', position:"absolute",
              top:0, left:"8%", right:"8%", height:"1.5px",
              background:`linear-gradient(90deg, transparent, ${primary}70, ${secondary}50, transparent)` },
          }}>
            <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:2.5 }}>
              <AddCircleIcon sx={{ color:primary, fontSize:"1.1rem" }} />
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontWeight:700, fontSize:"1rem", color:textPri }}>
                Create New Session
              </Typography>
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.5rem", color:textSec, letterSpacing:"0.12em", ml:0.5 }}>
                // ASSIGN_SKILL
              </Typography>
            </Box>

            <Box sx={{ display:"flex", gap:2, alignItems:"flex-end", flexWrap:"wrap" }}>
              <Box sx={{ flex:1, minWidth:220 }}>
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontSize:"0.72rem", color:textSec, mb:0.8, letterSpacing:"0.04em" }}>
                  Select Skill
                </Typography>
                <FormControl fullWidth>
                  <Select value={skillId} onChange={e=>setSkillId(e.target.value)}
                    displayEmpty sx={selectSx} MenuProps={menuProps}>
                    <MenuItem value="" disabled>
                      <Typography sx={{ color:textSec, fontSize:"0.88rem",
                        fontFamily:"'Exo 2', sans-serif", opacity:0.5 }}>
                        Choose a skill...
                      </Typography>
                    </MenuItem>
                    {skills.map(s=>(
                      <MenuItem key={s.skillId} value={s.skillId}>{s.skillName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <motion.div whileHover={{ scale:skillId ? 1.03 : 1 }}
                whileTap={{ scale:skillId ? 0.97 : 1 }}>
                <Box onClick={createSession} sx={{
                  display:"flex", alignItems:"center", gap:1,
                  px:2.5, py:"13px", borderRadius:"11px", cursor:"pointer",
                  background: skillId && !creating
                    ? `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`
                    : "rgba(34,211,238,0.07)",
                  border:`1px solid ${skillId ? primary + "55" : "rgba(34,211,238,0.12)"}`,
                  boxShadow: skillId && !creating ? `0 4px 20px ${primary}40` : "none",
                  opacity: skillId ? 1 : 0.5, transition:"all 0.28s",
                  "&:hover": skillId && !creating ? { boxShadow:`0 8px 32px ${primary}60` } : {},
                }}>
                  {creating
                    ? <CircularProgress size={16} sx={{ color:"#030712" }} />
                    : <AddCircleIcon sx={{ color:skillId ? "#030712" : textSec, fontSize:"1rem" }} />}
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontWeight:800, fontSize:"0.85rem",
                    color: skillId && !creating ? "#030712" : textSec,
                    letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
                    {creating ? "Creating..." : "Create Session"}
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* ── SESSION LABEL ── */}
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.52rem", color:"rgba(71,85,105,0.85)",
          letterSpacing:"0.18em", mb:1.5 }}>
          // ACTIVE_SESSIONS
        </Typography>

        {/* ── SESSION LIST ── */}
        {loading ? (
          <Box sx={{ display:"flex", justifyContent:"center", py:8 }}>
            <CircularProgress sx={{ color:primary }} />
          </Box>
        ) : sessions.length === 0 ? (
          <Box sx={{ textAlign:"center", py:8,
            border:`1px dashed rgba(34,211,238,0.18)`, borderRadius:"14px",
            background:"rgba(34,211,238,0.02)" }}>
            <AssignmentIcon sx={{ color:primary, fontSize:"2.5rem", opacity:0.4, mb:1 }} />
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif", color:textSec }}>
              No sessions yet. Create one above.
            </Typography>
          </Box>
        ) : (
          <AnimatePresence>
            {sessions.map((s, i) => {
              const isResetting = resetting === s.sessionId;
              // ── Status logic ──────────────────────────────────────────────
              // completed = has score (user finished the test)
              // ready     = questions assigned but not yet taken
              // pending   = no questions assigned
              const isCompleted = s.score !== null && s.score !== undefined;
              const isReady     = s.questionCount > 0 && !isCompleted;
              const isPending   = s.questionCount === 0;

              const statusColor = isCompleted ? errorC : isReady ? successC : warningC;
              const statusLabel = isCompleted ? "COMPLETED" : isReady ? "READY" : "PENDING";

              return (
                <motion.div key={s.sessionId}
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-10 }}
                  transition={{ delay:i*0.06, type:"spring", stiffness:180 }}>
                  <Box
                    onClick={() => navigate(`/admin/assign/${s.sessionId}?mode=view`)}
                    sx={{
                      borderRadius:"14px", p:"18px 22px", mb:2,
                      background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                      border:`1px solid rgba(34,211,238,0.12)`,
                      boxShadow:`0 4px 20px rgba(0,0,0,0.3)`,
                      cursor:"pointer", position:"relative", overflow:"hidden",
                      transition:"all 0.25s", opacity: isResetting ? 0.6 : 1,
                      "&:hover":{ borderColor:`rgba(34,211,238,0.3)`,
                        boxShadow:`0 8px 32px rgba(34,211,238,0.1)`,
                        "& .session-arrow":{ opacity:1, transform:"translateX(0)" } },
                      "&::before":{ content:'""', position:"absolute",
                        top:0, left:0, bottom:0, width:"3px",
                        background:`linear-gradient(180deg, ${statusColor}, ${statusColor}66)`,
                        boxShadow:`0 0 8px ${statusColor}50` },
                    }}>
                    <Box sx={{ display:"flex", alignItems:"center",
                      justifyContent:"space-between", gap:2, flexWrap:"wrap" }}>
                      <Box sx={{ flex:1 }}>
                        {/* Skill + status chips */}
                        <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:1 }}>
                          <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
                            background:`${primary}15`, border:`1px solid ${primary}30` }}>
                            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                              fontSize:"0.58rem", color:primary, letterSpacing:"0.1em" }}>
                              {s.skill || "GENERAL"}
                            </Typography>
                          </Box>
                          <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
                            background:`${statusColor}12`,
                            border:`1px solid ${statusColor}30` }}>
                            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                              fontSize:"0.56rem", color:statusColor, letterSpacing:"0.1em" }}>
                              {statusLabel}
                            </Typography>
                          </Box>
                          {/* Score pill if completed */}
                          {isCompleted && (
                            <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
                              background:`${primary}10`, border:`1px solid ${primary}25` }}>
                              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                                fontSize:"0.56rem", color:primary, letterSpacing:"0.08em" }}>
                                SCORE: {s.score}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                          fontWeight:700, fontSize:"0.95rem", color:textPri, mb:0.4 }}>
                          Session #{s.sessionId}
                        </Typography>

                        <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
                          <Box sx={{ display:"flex", alignItems:"center", gap:0.5 }}>
                            <QuizIcon sx={{ color:textSec, fontSize:"0.8rem" }} />
                            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                              fontSize:"0.78rem", color:textSec }}>
                              {s.questionCount} question{s.questionCount !== 1 ? "s" : ""}
                            </Typography>
                          </Box>
                          <Box sx={{ display:"flex", alignItems:"center", gap:0.5 }}>
                            <AccessTimeIcon sx={{ color:textSec, fontSize:"0.8rem" }} />
                            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                              fontSize:"0.78rem", color:textSec }}>
                              {new Date(s.startedAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {/* Action buttons */}
                      <Box sx={{ display:"flex", alignItems:"center", gap:1.2 }}>
                        <Typography className="session-arrow"
                          sx={{ color:primary, fontSize:"1rem", opacity:0,
                            transform:"translateX(-8px)",
                            transition:"all 0.25s", mr:0.5 }}>
                          →
                        </Typography>

                        {/* Reassign button — for both ready and completed sessions */}
                        {!isPending && (
                          <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}>
                            <Box
                              onClick={e => {
                                e.stopPropagation();
                                // If user already completed → show warning dialog first
                                if (isCompleted) {
                                  setConfirmSession(s);
                                } else {
                                  // Not yet taken → reassign directly
                                  navigate(`/admin/assign/${s.sessionId}?mode=edit`);
                                }
                              }}
                              sx={{
                                display:"flex", alignItems:"center", gap:0.8,
                                px:2, py:"8px", borderRadius:"9px", cursor:"pointer",
                                background: isCompleted
                                  ? `${warningC}15`
                                  : "rgba(34,211,238,0.08)",
                                border: isCompleted
                                  ? `1px solid ${warningC}40`
                                  : `1px solid ${primary}35`,
                                transition:"all 0.22s",
                                "&:hover": isCompleted
                                  ? { background:`${warningC}25`, border:`1px solid ${warningC}60` }
                                  : { background:`${primary}15`, border:`1px solid ${primary}55` },
                              }}>
                              {isResetting
                                ? <CircularProgress size={14} sx={{ color: isCompleted ? warningC : primary }} />
                                : isCompleted
                                ? <RefreshIcon sx={{ color:warningC, fontSize:"0.85rem" }} />
                                : <EditIcon sx={{ color:primary, fontSize:"0.85rem" }} />}
                              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                                fontWeight:700, fontSize:"0.78rem",
                                color: isCompleted ? warningC : primary,
                                letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
                                {isResetting ? "Resetting..." : "Reassign"}
                              </Typography>
                            </Box>
                          </motion.div>
                        )}

                        {/* Assign button — only for pending */}
                        {isPending && (
                          <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}>
                            <Box
                              onClick={e => {
                                e.stopPropagation();
                                navigate(`/admin/assign/${s.sessionId}?mode=edit`);
                              }}
                              sx={{
                                display:"flex", alignItems:"center", gap:0.8,
                                px:2, py:"8px", borderRadius:"9px", cursor:"pointer",
                                background:`linear-gradient(135deg, #0891b2, ${primary})`,
                                border:`1px solid ${primary}55`,
                                boxShadow:`0 4px 14px ${primary}35`,
                                transition:"all 0.22s",
                                "&:hover":{ boxShadow:`0 6px 20px ${primary}50` },
                              }}>
                              <EditIcon sx={{ color:"#030712", fontSize:"0.85rem" }} />
                              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                                fontWeight:700, fontSize:"0.78rem", color:"#030712",
                                letterSpacing:"0.04em", whiteSpace:"nowrap" }}>
                                Assign
                              </Typography>
                            </Box>
                          </motion.div>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* ── Legend ── */}
        {!loading && sessions.length > 0 && (
          <Box sx={{ display:"flex", gap:2, flexWrap:"wrap", mt:1, mb:3 }}>
            {[
              { color:errorC,    label:"COMPLETED — user already took this test" },
              { color:successC,  label:"READY — questions assigned, not yet taken" },
              { color:warningC,  label:"PENDING — no questions assigned yet" },
            ].map(({ color, label }) => (
              <Box key={label} sx={{ display:"flex", alignItems:"center", gap:0.7 }}>
                <Box sx={{ width:7, height:7, borderRadius:"50%",
                  background:color, boxShadow:`0 0 5px ${color}` }} />
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.5rem", color:textSec, letterSpacing:"0.08em" }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ height:40 }} />
      </Box>

      {/* ── Confirm Reassign Dialog ── */}
      <ConfirmReassignDialog
        open={Boolean(confirmSession)}
        session={confirmSession}
        onConfirm={handleConfirmReassign}
        onCancel={() => setConfirmSession(null)}
      />
    </Box>
  );
}