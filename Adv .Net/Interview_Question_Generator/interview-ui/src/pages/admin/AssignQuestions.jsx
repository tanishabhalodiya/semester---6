import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import AdminSidebar      from "../../components/AdminSidebar";
import HubIcon           from "@mui/icons-material/Hub";
import QuizIcon          from "@mui/icons-material/Quiz";
import CheckCircleIcon   from "@mui/icons-material/CheckCircle";
import SaveIcon          from "@mui/icons-material/Save";
import ArrowBackIcon     from "@mui/icons-material/ArrowBack";
import SearchIcon        from "@mui/icons-material/Search";
import VisibilityIcon    from "@mui/icons-material/Visibility";
import EditIcon          from "@mui/icons-material/Edit";

export default function AssignQuestions() {
  const { sessionId }    = useParams();
  const [searchParams]   = useSearchParams();
  const mode             = searchParams.get("mode"); // "view" | "edit"
  const navigate         = useNavigate();
  const theme            = useTheme();

  const [allQuestions,     setAllQuestions]     = useState([]);
  const [displayQuestions, setDisplayQuestions] = useState([]);
  const [selected,         setSelected]         = useState([]);
  const [loading,          setLoading]          = useState(true);
  const [saving,           setSaving]           = useState(false);
  const [saved,            setSaved]            = useState(false);
  const [search,           setSearch]           = useState("");

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;
  const errorC    = theme.palette.error.main;

  useEffect(() => { loadAllData(); }, []);

  const loadAllData = async () => {
    try {
      const [qRes, sRes] = await Promise.all([
        api.get("/GeneratedQuestions"),
        api.get(`/TestSessions/${sessionId}`),
      ]);
      const allQ = qRes.data || [];
      setAllQuestions(allQ);

      let assignedIds = [];
      if (sRes.data?.userAnswersJson && sRes.data.userAnswersJson !== "[]") {
        const parsed = JSON.parse(sRes.data.userAnswersJson);
        assignedIds  = parsed.map(x => x.questionId);
      }
      setSelected(assignedIds);

      if (mode === "view") {
        setDisplayQuestions(allQ.filter(q => assignedIds.includes(q.questionId)));
      } else {
        setDisplayQuestions(allQ);
      }
    } catch (err) {
      console.error("Error loading assign data", err);
    } finally { setLoading(false); }
  };

  const toggle = (id) => {
    if (mode === "view") return;
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const assign = async () => {
    if (selected.length === 0) { alert("Please select at least one question"); return; }
    try {
      setSaving(true);
      await api.post(`/TestSessions/admin/assign-questions/${sessionId}`, selected);
      setSaved(true);
      setTimeout(() => navigate("/admin/sessions"), 1400);
    } catch { alert("Failed to assign questions"); }
    finally { setSaving(false); }
  };

  // ── filtered display ─────────────────────────────────────────────────────
  const filtered = displayQuestions.filter(q =>
    !search.trim() || q.questionText?.toLowerCase().includes(search.toLowerCase())
  );

  const isView     = mode === "view";
  const selCount   = selected.length;

  return (
    <Box sx={{ display:"flex", minHeight:"100vh", background:bg, position:"relative" }}>

      {/* ── Ambient glows ── */}
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
          <Box sx={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", mb:4, gap:2, flexWrap:"wrap" }}>
            <Box>
              <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
                <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                  ADMIN // SESSION_{sessionId} // {isView ? "VIEW_MODE" : "EDIT_MODE"}
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
                background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                {isView ? "Assigned Questions" : "Assign Questions"}
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:textSec, fontSize:"0.85rem", mt:0.4 }}>
                Session #{sessionId} · {filtered.length} question{filtered.length !== 1 ? "s" : ""}
              </Typography>
            </Box>

            {/* Right: mode badge + back button */}
            <Box sx={{ display:"flex", alignItems:"center", gap:1.5, flexWrap:"wrap" }}>
              {/* Mode badge */}
              <Box sx={{ display:"flex", alignItems:"center", gap:0.7,
                px:1.5, py:"7px", borderRadius:"9px",
                background: isView ? `${primary}12` : `${secondary}12`,
                border:`1px solid ${isView ? primary : secondary}35` }}>
                {isView
                  ? <VisibilityIcon sx={{ color:primary, fontSize:"0.9rem" }} />
                  : <EditIcon sx={{ color:secondary, fontSize:"0.9rem" }} />}
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.58rem", color: isView ? primary : secondary,
                  letterSpacing:"0.1em" }}>
                  {isView ? "VIEW_MODE" : "EDIT_MODE"}
                </Typography>
              </Box>

              {/* Selected count badge (edit only) */}
              {!isView && (
                <motion.div animate={{ scale:[1, selCount > 0 ? 1.05 : 1, 1] }}
                  transition={{ duration:0.3 }}>
                  <Box sx={{ px:1.8, py:"7px", borderRadius:"9px",
                    background:`${successC}15`, border:`1px solid ${successC}40` }}>
                    <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:"0.6rem", color:successC, letterSpacing:"0.1em", fontWeight:700 }}>
                      {selCount} SELECTED
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {/* Back button */}
              <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                <Box onClick={()=>navigate("/admin/sessions")}
                  sx={{ display:"flex", alignItems:"center", gap:0.7,
                    px:1.8, py:"7px", borderRadius:"9px", cursor:"pointer",
                    background:"rgba(34,211,238,0.05)",
                    border:`1px solid rgba(34,211,238,0.18)`,
                    transition:"all 0.22s",
                    "&:hover":{ background:"rgba(34,211,238,0.12)",
                      border:`1px solid ${primary}40` } }}>
                  <ArrowBackIcon sx={{ color:primary, fontSize:"0.9rem" }} />
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontSize:"0.82rem", color:textSec }}>Sessions</Typography>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* ── SEARCH BAR ── */}
        {!loading && displayQuestions.length > 0 && (
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1, duration:0.45 }}>
            <Box sx={{ position:"relative", mb:3 }}>
              <SearchIcon sx={{ position:"absolute", left:14, top:"50%",
                transform:"translateY(-50%)", color:primary,
                fontSize:"1rem", pointerEvents:"none", opacity:0.7 }} />
              <Box component="input" value={search}
                onChange={e=>setSearch(e.target.value)}
                placeholder="Search questions..."
                sx={{ width:"100%", pl:"40px", pr:2, py:"11px",
                  borderRadius:"11px", border:`1px solid rgba(34,211,238,0.18)`,
                  background:paper, color:textPri, fontSize:"0.88rem",
                  fontFamily:"'Exo 2', sans-serif", outline:"none",
                  transition:"all 0.25s",
                  "&:focus":{ border:`1px solid ${primary}70`,
                    boxShadow:`0 0 0 3px ${primary}15` },
                  "&::placeholder":{ color:textSec, opacity:0.5 },
                }} />
            </Box>
          </motion.div>
        )}

        {/* ── LOADING ── */}
        {loading && (
          <Box sx={{ display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", py:10 }}>
            <CircularProgress sx={{ color:primary, mb:2 }} />
            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
              fontSize:"0.62rem", color:primary, letterSpacing:"0.2em" }}>
              LOADING_QUESTIONS...
            </Typography>
          </Box>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
            <Box sx={{ textAlign:"center", py:8,
              border:`1px dashed rgba(34,211,238,0.18)`, borderRadius:"14px",
              background:"rgba(34,211,238,0.02)" }}>
              <QuizIcon sx={{ color:primary, fontSize:"2.5rem", opacity:0.35, mb:1 }} />
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:textSec, fontSize:"0.92rem" }}>
                {search ? "No questions match your search." : "No questions assigned to this session yet."}
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* ── QUESTION LIST ── */}
        <AnimatePresence>
          {filtered.map((q, i) => {
            const isSelected = selected.includes(q.questionId);
            return (
              <motion.div key={q.questionId}
                initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-8 }}
                transition={{ delay: i < 20 ? i * 0.03 : 0, type:"spring", stiffness:180 }}
                whileHover={!isView ? { x:3, transition:{ duration:0.15 } } : {}}>

                <Box onClick={()=>toggle(q.questionId)} sx={{
                  borderRadius:"13px", p:"15px 18px", mb:1.5,
                  background: isSelected
                    ? `linear-gradient(145deg, ${primary}12, ${primary}06)`
                    : `linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                  border:`1px solid ${isSelected
                    ? primary + "45"
                    : "rgba(34,211,238,0.1)"}`,
                  boxShadow: isSelected
                    ? `0 4px 20px ${primary}15`
                    : `0 3px 14px rgba(0,0,0,0.25)`,
                  cursor: isView ? "default" : "pointer",
                  transition:"all 0.22s",
                  display:"flex", alignItems:"center", gap:1.8,
                  position:"relative", overflow:"hidden",
                  "&:hover": !isView ? {
                    borderColor: isSelected ? `${primary}60` : "rgba(34,211,238,0.28)",
                    boxShadow:`0 6px 22px ${primary}12`,
                  } : {},
                  // left accent bar
                  "&::before":{ content:'""', position:"absolute",
                    top:0, left:0, bottom:0, width:"3px",
                    background: isSelected
                      ? `linear-gradient(180deg, ${primary}, ${secondary})`
                      : "rgba(34,211,238,0.12)",
                    boxShadow: isSelected ? `0 0 8px ${primary}60` : "none",
                    transition:"all 0.25s" },
                }}>

                  {/* Custom checkbox */}
                  <Box sx={{ flexShrink:0, width:22, height:22, borderRadius:"6px",
                    border:`2px solid ${isSelected ? primary : "rgba(34,211,238,0.25)"}`,
                    background: isSelected ? `${primary}20` : "transparent",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all 0.22s",
                    boxShadow: isSelected ? `0 0 10px ${primary}50` : "none",
                    flexShrink:0,
                  }}>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div initial={{ scale:0, opacity:0 }}
                          animate={{ scale:1, opacity:1 }} exit={{ scale:0, opacity:0 }}
                          transition={{ type:"spring", stiffness:400, damping:18 }}>
                          <CheckCircleIcon sx={{ color:primary, fontSize:"0.85rem",
                            display:"block" }} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>

                  {/* Question icon */}
                  <Box sx={{ width:36, height:36, borderRadius:"9px", flexShrink:0,
                    background: isSelected ? `${primary}18` : `${primary}0d`,
                    border:`1px solid ${isSelected ? primary + "40" : primary + "20"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    transition:"all 0.22s" }}>
                    <QuizIcon sx={{ color:primary, fontSize:"1rem", opacity: isSelected ? 1 : 0.6 }} />
                  </Box>

                  {/* Question text */}
                  <Box sx={{ flex:1, minWidth:0 }}>
                    <Typography sx={{
                      fontFamily:"'Exo 2', sans-serif",
                      fontWeight: isSelected ? 600 : 400,
                      fontSize:"0.9rem",
                      color: isSelected ? textPri : textSec,
                      lineHeight:1.5,
                      transition:"all 0.22s",
                    }}>
                      {q.questionText}
                    </Typography>

                    {/* Meta chips */}
                    {(q.difficulty || q.category || q.skillName) && (
                      <Box sx={{ display:"flex", gap:0.8, mt:0.7, flexWrap:"wrap" }}>
                        {q.difficulty && (
                          <Box sx={{ px:1, py:"2px", borderRadius:"5px",
                            background: q.difficulty === "Easy" ? `${successC}12`
                              : q.difficulty === "Medium" ? `${theme.palette.warning.main}12`
                              : `${errorC}12`,
                            border:`1px solid ${q.difficulty === "Easy" ? successC
                              : q.difficulty === "Medium" ? theme.palette.warning.main
                              : errorC}28` }}>
                            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                              fontSize:"0.54rem", letterSpacing:"0.06em",
                              color: q.difficulty === "Easy" ? successC
                                : q.difficulty === "Medium" ? theme.palette.warning.main
                                : errorC }}>
                              {q.difficulty.toUpperCase()}
                            </Typography>
                          </Box>
                        )}
                        {q.category && (
                          <Box sx={{ px:1, py:"2px", borderRadius:"5px",
                            background:`${primary}10`, border:`1px solid ${primary}25` }}>
                            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                              fontSize:"0.54rem", color:primary, letterSpacing:"0.06em" }}>
                              {q.category}
                            </Typography>
                          </Box>
                        )}
                        {q.skillName && (
                          <Box sx={{ px:1, py:"2px", borderRadius:"5px",
                            background:`${secondary}10`, border:`1px solid ${secondary}25` }}>
                            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                              fontSize:"0.54rem", color:secondary, letterSpacing:"0.06em" }}>
                              {q.skillName}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* Selected indicator on right */}
                  {isSelected && !isView && (
                    <motion.div initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }}
                      exit={{ opacity:0, x:8 }} transition={{ duration:0.2 }}>
                      <Box sx={{ px:1.2, py:"4px", borderRadius:"6px", flexShrink:0,
                        background:`${successC}15`, border:`1px solid ${successC}35` }}>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.52rem", color:successC, letterSpacing:"0.1em" }}>
                          ADDED
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* ── SAVE BUTTON (edit mode only) ── */}
        {!isView && !loading && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.3, duration:0.5 }}>
            <Box sx={{ mt:3, display:"flex", gap:2, alignItems:"center", flexWrap:"wrap" }}>
              <motion.div whileHover={{ scale: selCount > 0 ? 1.02 : 1 }}
                whileTap={{ scale: selCount > 0 ? 0.98 : 1 }}
                style={{ flex:1, maxWidth:320 }}>
                <Box onClick={assign} sx={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:1.2,
                  py:"14px", borderRadius:"12px",
                  cursor: selCount > 0 && !saving ? "pointer" : "default",
                  background: saved
                    ? `linear-gradient(135deg, #065f46, ${successC}cc)`
                    : selCount > 0
                    ? `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`
                    : "rgba(34,211,238,0.06)",
                  border:`1px solid ${
                    saved ? successC + "55"
                    : selCount > 0 ? primary + "55"
                    : "rgba(34,211,238,0.12)"}`,
                  boxShadow: saved
                    ? `0 4px 20px ${successC}40`
                    : selCount > 0 ? `0 4px 20px ${primary}40` : "none",
                  opacity: selCount > 0 || saved ? 1 : 0.4,
                  transition:"all 0.3s",
                  "&:hover": selCount > 0 && !saved && !saving
                    ? { boxShadow:`0 8px 32px ${primary}60` } : {},
                }}>
                  {saving
                    ? <CircularProgress size={18} sx={{ color:"#030712" }} />
                    : saved
                    ? <CheckCircleIcon sx={{ color:"#030712", fontSize:"1.1rem" }} />
                    : <SaveIcon sx={{ color: selCount > 0 ? "#030712" : textSec, fontSize:"1.1rem" }} />}
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontWeight:800, fontSize:"0.9rem", letterSpacing:"0.08em",
                    textTransform:"uppercase",
                    color: selCount > 0 || saved ? "#030712" : textSec }}>
                    {saving ? "Saving..."
                      : saved ? "Saved!"
                      : `Save Questions (${selCount})`}
                  </Typography>
                </Box>
              </motion.div>

              {/* Deselect all */}
              {selCount > 0 && !saved && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                  <Box onClick={()=>setSelected([])} sx={{
                    px:2, py:"13px", borderRadius:"12px", cursor:"pointer",
                    border:"1px solid rgba(248,113,113,0.25)",
                    background:"rgba(248,113,113,0.07)",
                    transition:"all 0.22s",
                    "&:hover":{ background:"rgba(248,113,113,0.15)",
                      border:"1px solid rgba(248,113,113,0.45)" } }}>
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontWeight:700, fontSize:"0.82rem", color:errorC,
                      letterSpacing:"0.04em" }}>
                      Clear All
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </Box>
          </motion.div>
        )}

        <Box sx={{ height:40 }} />
      </Box>
    </Box>
  );
}