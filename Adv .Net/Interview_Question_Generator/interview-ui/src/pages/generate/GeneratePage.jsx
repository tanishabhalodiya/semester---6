import { useState } from "react";
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HubIcon         from "@mui/icons-material/Hub";
import CodeIcon        from "@mui/icons-material/Code";
import CategoryIcon    from "@mui/icons-material/Category";
import BoltIcon        from "@mui/icons-material/Bolt";
import ArrowBackIcon   from "@mui/icons-material/ArrowBack";
import DashboardIcon   from "@mui/icons-material/Dashboard";

export default function GenerateForm() {
  const [skill,      setSkill]      = useState("");
  const [category,   setCategory]   = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [loading,    setLoading]    = useState(false);

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

  const submit = async (e) => {
    e.preventDefault();
    if (!skill || !category || !difficulty) {
      alert("Please select all filters"); return;
    }
    try {
      setLoading(true);
      const res = await api.post("/ai/generate", {
        skill, category, difficulty, type: "MCQ", count: 10,
      });
      navigate("/mcq-preview", { state: { mcqs: res.data, source: "TEXT" } });
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions");
    } finally { setLoading(false); }
  };

  const selectSx = {
    fontFamily:"'Exo 2', sans-serif", color:textPri, fontSize:"0.9rem",
    background:paper, border:`1px solid rgba(34,211,238,0.18)`, borderRadius:"10px",
    "& .MuiOutlinedInput-notchedOutline":{ border:"none" },
    "& .MuiSvgIcon-root":{ color:primary },
    "&:hover":{ border:`1px solid ${primary}50` },
    "&.Mui-focused":{ border:`1px solid ${primary}70`, boxShadow:`0 0 0 3px ${primary}15` },
    transition:"all 0.25s",
  };

  const menuProps = { PaperProps:{ sx:{
    background:"#0d1f3c", border:`1px solid rgba(34,211,238,0.18)`,
    borderRadius:"10px", mt:0.5,
    "& .MuiMenuItem-root":{ fontFamily:"'Exo 2', sans-serif",
      fontSize:"0.88rem", color:textSec, py:1,
      "&:hover":{ background:`${primary}15`, color:primary },
      "&.Mui-selected":{ background:`${primary}18`, color:primary },
    },
  }}};

  const diffColor = (d) =>
    d === "Easy" ? successC : d === "Medium" ? warningC : d === "Hard" ? errorC : textSec;

  const isReady = !!(skill && category && difficulty);

  const FieldLabel = ({ icon, children }) => (
    <Box sx={{ display:"flex", alignItems:"center", gap:0.8, mb:0.9 }}>
      <Box sx={{ color:primary, opacity:0.7, "& svg":{ fontSize:"0.8rem" } }}>{icon}</Box>
      <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
        fontSize:"0.52rem", color:textSec, letterSpacing:"0.14em", textTransform:"uppercase" }}>
        {children}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight:"100vh", background:bg, position:"relative",
      p:{ xs:2, md:"36px 32px" }, overflow:"hidden" }}>

      {/* ── Ambient glows ── */}
      <Box sx={{ position:"fixed", top:"-8%", left:"40%", width:500, height:500,
        borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter:"blur(65px)", zIndex:0 }} />
      <Box sx={{ position:"fixed", bottom:"5%", right:"2%", width:360, height:360,
        borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter:"blur(55px)", zIndex:0 }} />

      <Box sx={{ maxWidth:540, mx:"auto", position:"relative", zIndex:2 }}>

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}>
          <Box sx={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", mb:4, flexWrap:"wrap", gap:2 }}>
            <Box>
              <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
                <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                  AI // GENERATE_MCQ
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
                background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                Generate MCQs
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:textSec, fontSize:"0.85rem", mt:0.4 }}>
                Configure filters and let AI build your question set
              </Typography>
            </Box>

            {/* ── Back to Dashboard ── */}
            <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
              <Box onClick={()=>navigate("/user/dashboard")}
                sx={{ display:"flex", alignItems:"center", gap:0.8,
                  px:2, py:"10px", borderRadius:"10px", cursor:"pointer",
                  background:"rgba(34,211,238,0.05)",
                  border:`1px solid rgba(34,211,238,0.18)`,
                  transition:"all 0.22s",
                  "&:hover":{ background:"rgba(34,211,238,0.12)",
                    border:`1px solid ${primary}45` } }}>
                <ArrowBackIcon sx={{ color:primary, fontSize:"0.95rem" }} />
                <DashboardIcon sx={{ color:primary, fontSize:"0.95rem" }} />
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontSize:"0.82rem", fontWeight:500, color:textSec }}>
                  Dashboard
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* ── FORM CARD ── */}
        <motion.div initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.55 }}>
          <Box component="form" onSubmit={submit} sx={{
            borderRadius:"18px", p:"28px 30px",
            background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
            border:`1px solid rgba(34,211,238,0.13)`,
            boxShadow:`0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.06)`,
            position:"relative", overflow:"hidden",
            "&::before":{ content:'""', position:"absolute",
              top:0, left:"8%", right:"8%", height:"1.5px",
              background:`linear-gradient(90deg, transparent, ${primary}70, ${secondary}50, transparent)` },
          }}>

            {/* ── SKILL ── */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.18, duration:0.4 }}>
              <Box sx={{ mb:2.5 }}>
                <FieldLabel icon={<CodeIcon />}>Skill</FieldLabel>
                <FormControl fullWidth>
                  <Select value={skill} onChange={e=>setSkill(e.target.value)}
                    displayEmpty sx={selectSx} MenuProps={menuProps}>
                    <MenuItem value="" disabled>
                      <Typography sx={{ color:textSec, fontSize:"0.88rem",
                        fontFamily:"'Exo 2', sans-serif", opacity:0.5 }}>
                        Choose a skill...
                      </Typography>
                    </MenuItem>
                    <MenuItem value={1}>C</MenuItem>
                    <MenuItem value={2}>Java</MenuItem>
                    <MenuItem value={3}>Python</MenuItem>
                    <MenuItem value={4}>.NET</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </motion.div>

            {/* ── CATEGORY ── */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.24, duration:0.4 }}>
              <Box sx={{ mb:2.5 }}>
                <FieldLabel icon={<CategoryIcon />}>Category</FieldLabel>
                <FormControl fullWidth>
                  <Select value={category} onChange={e=>setCategory(e.target.value)}
                    displayEmpty sx={selectSx} MenuProps={menuProps}>
                    <MenuItem value="" disabled>
                      <Typography sx={{ color:textSec, fontSize:"0.88rem",
                        fontFamily:"'Exo 2', sans-serif", opacity:0.5 }}>
                        Choose a category...
                      </Typography>
                    </MenuItem>
                    <MenuItem value={1}>Theory</MenuItem>
                    <MenuItem value={2}>Coding</MenuItem>
                    <MenuItem value={3}>MCQ</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </motion.div>

            {/* ── DIFFICULTY ── */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.30, duration:0.4 }}>
              <Box sx={{ mb:3 }}>
                <FieldLabel icon={<BoltIcon />}>Difficulty</FieldLabel>
                <Box sx={{ display:"flex", gap:1.5 }}>
                  {["Easy","Medium","Hard"].map(d => (
                    <motion.div key={d} whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
                      style={{ flex:1 }}>
                      <Box onClick={()=>setDifficulty(d)} sx={{
                        py:"13px", borderRadius:"11px", textAlign:"center", cursor:"pointer",
                        background: difficulty===d ? `${diffColor(d)}18` : "rgba(34,211,238,0.03)",
                        border:`1px solid ${difficulty===d ? diffColor(d)+"55" : "rgba(34,211,238,0.15)"}`,
                        boxShadow: difficulty===d ? `0 0 18px ${diffColor(d)}22` : "none",
                        transition:"all 0.25s",
                      }}>
                        <Box sx={{ width:8, height:8, borderRadius:"50%", mx:"auto", mb:0.7,
                          background:diffColor(d),
                          boxShadow: difficulty===d ? `0 0 9px ${diffColor(d)}` : "none",
                          transition:"box-shadow 0.25s" }} />
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.65rem", fontWeight:700,
                          color: difficulty===d ? diffColor(d) : textSec,
                          letterSpacing:"0.06em", textTransform:"uppercase" }}>
                          {d}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>
            </motion.div>

            {/* ── Divider ── */}
            <Box sx={{ height:"1px", background:"rgba(34,211,238,0.08)", mb:2.5 }} />

            {/* ── Ready indicator ── */}
            <AnimatePresence>
              {isReady && (
                <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-6 }} transition={{ duration:0.28 }}>
                  <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:2.5,
                    px:2, py:"10px", borderRadius:"9px",
                    background:`${successC}08`, border:`1px solid ${successC}25` }}>
                    <motion.div animate={{ opacity:[0.4,1,0.4] }}
                      transition={{ duration:1.8, repeat:Infinity }}>
                      <Box sx={{ width:6, height:6, borderRadius:"50%",
                        background:successC, boxShadow:`0 0 7px ${successC}` }} />
                    </motion.div>
                    <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:"0.54rem", color:successC, letterSpacing:"0.13em" }}>
                      READY · 10 MCQs will be generated
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── GENERATE BUTTON ── */}
            <motion.div whileHover={{ scale: isReady ? 1.02 : 1 }}
              whileTap={{ scale: isReady ? 0.98 : 1 }}>
              <Box component="button" type="submit"
                disabled={!isReady || loading}
                sx={{
                  width:"100%", display:"flex", alignItems:"center",
                  justifyContent:"center", gap:1.2,
                  py:"14px", borderRadius:"12px", border:"none",
                  cursor: isReady && !loading ? "pointer" : "default",
                  background: isReady
                    ? `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`
                    : "rgba(34,211,238,0.07)",
                  boxShadow: isReady ? `0 4px 22px ${primary}45` : "none",
                  opacity: isReady ? 1 : 0.45,
                  transition:"all 0.28s", outline:"none", fontFamily:"inherit",
                  "&:hover": isReady && !loading ? { boxShadow:`0 8px 34px ${primary}65` } : {},
                }}>
                {loading
                  ? <CircularProgress size={18} sx={{ color:"#030712" }} />
                  : <AutoAwesomeIcon sx={{ color: isReady ? "#030712" : textSec, fontSize:"1.1rem" }} />}
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontWeight:800, fontSize:"0.92rem", letterSpacing:"0.1em",
                  textTransform:"uppercase",
                  color: isReady ? "#030712" : textSec }}>
                  {loading ? "Generating..." : "Generate MCQs"}
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        <Box sx={{ height:40 }} />
      </Box>
    </Box>
  );
}