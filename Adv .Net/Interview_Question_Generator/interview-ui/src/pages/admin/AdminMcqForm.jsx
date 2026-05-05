import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import AdminSidebar    from "../../components/AdminSidebar";
import HubIcon         from "@mui/icons-material/Hub";
import SaveIcon        from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon   from "@mui/icons-material/ArrowBack";
import DashboardIcon   from "@mui/icons-material/Dashboard";
import CodeIcon        from "@mui/icons-material/Code";
import CategoryIcon    from "@mui/icons-material/Category";
import BoltIcon        from "@mui/icons-material/Bolt";
import WorkIcon        from "@mui/icons-material/Work";
import QuizIcon        from "@mui/icons-material/Quiz";

// ── Themed native input ───────────────────────────────────────────────────────
function ThemedInput({ label, icon, value, onChange, name, multiline, rows, placeholder }) {
  const theme   = useTheme();
  const primary = theme.palette.primary.main;
  const paper   = theme.palette.background.paper;
  const textPri = theme.palette.text.primary;
  const textSec = theme.palette.text.secondary;

  return (
    <Box sx={{ mb:2.5 }}>
      <Box sx={{ display:"flex", alignItems:"center", gap:0.8, mb:0.9 }}>
        {icon && <Box sx={{ color:primary, opacity:0.7, "& svg":{ fontSize:"0.8rem" } }}>{icon}</Box>}
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.52rem", color:textSec, letterSpacing:"0.14em", textTransform:"uppercase" }}>
          {label}
        </Typography>
      </Box>
      <Box component={multiline ? "textarea" : "input"}
        name={name} value={value} onChange={onChange}
        rows={multiline ? (rows || 3) : undefined}
        placeholder={placeholder}
        sx={{
          width:"100%", p:"12px 14px",
          borderRadius:"10px", border:`1px solid rgba(34,211,238,0.18)`,
          background:paper, color:textPri, fontSize:"0.95rem",
          fontFamily:"'Exo 2', sans-serif", outline:"none",
          resize:multiline ? "vertical" : "none",
          transition:"all 0.25s", display:"block", lineHeight:1.6,
          "&:focus":{ border:`1px solid ${primary}70`, boxShadow:`0 0 0 3px ${primary}15` },
          "&::placeholder":{ color:textSec, opacity:0.45, fontFamily:"'Exo 2', sans-serif" },
        }} />
    </Box>
  );
}

// ── Themed native select ──────────────────────────────────────────────────────
function ThemedSelect({ label, icon, name, value, onChange, options }) {
  const theme   = useTheme();
  const primary = theme.palette.primary.main;
  const paper   = theme.palette.background.paper;
  const textPri = theme.palette.text.primary;
  const textSec = theme.palette.text.secondary;

  return (
    <Box sx={{ mb:2.5 }}>
      <Box sx={{ display:"flex", alignItems:"center", gap:0.8, mb:0.9 }}>
        {icon && <Box sx={{ color:primary, opacity:0.7, "& svg":{ fontSize:"0.8rem" } }}>{icon}</Box>}
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.52rem", color:textSec, letterSpacing:"0.14em", textTransform:"uppercase" }}>
          {label}
        </Typography>
      </Box>
      <Box component="select" name={name} value={value || ""} onChange={onChange}
        sx={{
          width:"100%", p:"12px 14px",
          borderRadius:"10px", border:`1px solid rgba(34,211,238,0.18)`,
          background:paper, color: value ? textPri : textSec,
          fontSize:"0.95rem", fontFamily:"'Exo 2', sans-serif",
          outline:"none", cursor:"pointer", appearance:"none",
          transition:"all 0.25s",
          "&:focus":{ border:`1px solid ${primary}70`, boxShadow:`0 0 0 3px ${primary}15` },
          "& option":{ background:"#0d1f3c", color:textPri, fontFamily:"'Exo 2', sans-serif" },
        }}>
        <option value="" disabled>Select {label.toLowerCase()}...</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </Box>
    </Box>
  );
}

// ── Option row with mark-correct button ───────────────────────────────────────
function OptionRow({ optKey, value, isCorrect, onChange, onSelect }) {
  const theme   = useTheme();
  const primary = theme.palette.primary.main;
  const paper   = theme.palette.background.paper;
  const textPri = theme.palette.text.primary;
  const textSec = theme.palette.text.secondary;
  const successC = theme.palette.success.main;

  return (
    <Box sx={{ display:"flex", gap:1.2, alignItems:"center", mb:1.8 }}>
      {/* Key badge */}
      <Box sx={{ width:36, height:36, borderRadius:"9px", flexShrink:0,
        background: isCorrect ? `${successC}18` : `${primary}12`,
        border:`1px solid ${isCorrect ? successC + "50" : primary + "28"}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.25s" }}>
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.7rem", fontWeight:800, color: isCorrect ? successC : primary }}>
          {optKey}
        </Typography>
      </Box>

      {/* Input */}
      <Box component="input" value={value}
        placeholder={`Option ${optKey}...`}
        onChange={e => onChange(optKey, e.target.value)}
        sx={{
          flex:1, p:"10px 14px", borderRadius:"10px",
          border:`1px solid ${isCorrect ? successC + "50" : "rgba(34,211,238,0.18)"}`,
          background: isCorrect ? `${successC}06` : paper,
          color:textPri, fontSize:"0.92rem",
          fontFamily:"'Exo 2', sans-serif", outline:"none",
          transition:"all 0.25s",
          "&:focus":{ border:`1px solid ${primary}70`, boxShadow:`0 0 0 3px ${primary}15` },
          "&::placeholder":{ color:textSec, opacity:0.45 },
          boxShadow: isCorrect ? `0 0 12px ${successC}20` : "none",
        }} />

      {/* Mark correct */}
      <motion.div whileHover={{ scale:1.08 }} whileTap={{ scale:0.94 }}>
        <Box onClick={() => onSelect(optKey)} sx={{
          width:36, height:36, borderRadius:"9px", flexShrink:0, cursor:"pointer",
          background: isCorrect ? `${successC}15` : "rgba(34,211,238,0.06)",
          border:`1px solid ${isCorrect ? successC + "50" : "rgba(34,211,238,0.2)"}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.25s",
          "&:hover":{ background:`${successC}20`, border:`1px solid ${successC}50` },
        }}>
          <CheckCircleIcon sx={{ fontSize:"1rem",
            color: isCorrect ? successC : "rgba(34,211,238,0.4)" }} />
        </Box>
      </motion.div>
    </Box>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AddMcqForm() {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();
  const theme    = useTheme();

  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;
  const warningC  = theme.palette.warning.main;
  const errorC    = theme.palette.error.main;

  const [form, setForm] = useState({
    adminId:1, skillId:"", categoryId:"", difficulty:"",
    experience:"", questionText:"",
    options:{ A:"", B:"", C:"", D:"" },
    correctAnswer:"",
  });

  const loadMcq = async () => {
    try {
      const res = await api.get(`/admin/mcq/${id}`);
      const q   = res.data;
      setForm({
        adminId:1,
        skillId:    q.skillId    != null ? parseInt(q.skillId, 10)    : "",
        categoryId: q.categoryId != null ? parseInt(q.categoryId, 10) : "",
        difficulty:    q.difficulty    ?? "",
        experience:    q.experience    ?? "",
        questionText:  q.questionText  ?? "",
        options: q.optionsJson ? JSON.parse(q.optionsJson) : { A:"",B:"",C:"",D:"" },
        correctAnswer: q.correctAnswer ?? "",
      });
    } catch { alert("Failed to load MCQ"); }
  };

  useEffect(() => { if (isEdit) loadMcq(); }, [id]);

  const handleChange  = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleOption  = (key, val) => setForm({ ...form, options:{ ...form.options, [key]:val } });
  const handleCorrect = key => setForm({ ...form, correctAnswer:key });

  const diffColor = (d) =>
    d === "Easy" ? successC : d === "Medium" ? warningC : d === "Hard" ? errorC : textSec;

  const submit = async () => {
    setSaving(true);
    try {
      if (isEdit) await api.put(`/admin/mcq/${id}`, form);
      else        await api.post("/admin/mcq", form);
      setSaved(true);
      setTimeout(() => navigate("/admin/mcq"), 1300);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to save MCQ");
    } finally { setSaving(false); }
  };

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
                  ADMIN // {isEdit ? "EDIT_MCQ" : "CREATE_MCQ"}
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
                background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                {isEdit ? "Edit MCQ" : "Add New MCQ"}
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:textSec, fontSize:"0.85rem", mt:0.4 }}>
                {isEdit ? "Update the existing question details below"
                        : "Fill in all fields to create a new question"}
              </Typography>
            </Box>

            {/* ── Back to Dashboard ── */}
            <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
              <Box onClick={() => navigate("/admin/dashboard")}
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
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.55 }}>
          <Box sx={{
            maxWidth:800, borderRadius:"18px", p:"28px 32px",
            background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
            border:`1px solid rgba(34,211,238,0.13)`,
            boxShadow:`0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.06)`,
            position:"relative", overflow:"hidden",
            "&::before":{ content:'""', position:"absolute",
              top:0, left:"8%", right:"8%", height:"1.5px",
              background:`linear-gradient(90deg, transparent, ${primary}70, ${secondary}50, transparent)` },
          }}>

            {/* ── Row 1: Skill + Category ── */}
            <Box sx={{ display:"flex", gap:2.5, flexWrap:"wrap" }}>
              <Box sx={{ flex:1, minWidth:200 }}>
                <ThemedSelect label="Skill" icon={<CodeIcon />} name="skillId"
                  value={form.skillId} onChange={handleChange}
                  options={[
                    { value:1, label:"C" }, { value:2, label:"Java" },
                    { value:3, label:"Python" }, { value:4, label:".NET" },
                  ]} />
              </Box>
              <Box sx={{ flex:1, minWidth:200 }}>
                <ThemedSelect label="Category" icon={<CategoryIcon />} name="categoryId"
                  value={form.categoryId} onChange={handleChange}
                  options={[
                    { value:1, label:"Theory" }, { value:2, label:"Coding" }, { value:3, label:"MCQ" },
                  ]} />
              </Box>
            </Box>

            {/* ── Row 2: Difficulty pills + Experience ── */}
            <Box sx={{ display:"flex", gap:2.5, flexWrap:"wrap", alignItems:"flex-start" }}>
              {/* Difficulty */}
              <Box sx={{ flex:1, minWidth:200, mb:2.5 }}>
                <Box sx={{ display:"flex", alignItems:"center", gap:0.8, mb:0.9 }}>
                  <BoltIcon sx={{ color:primary, opacity:0.7, fontSize:"0.8rem" }} />
                  <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                    fontSize:"0.52rem", color:textSec, letterSpacing:"0.14em",
                    textTransform:"uppercase" }}>
                    Difficulty
                  </Typography>
                </Box>
                <Box sx={{ display:"flex", gap:1.2 }}>
                  {["Easy","Medium","Hard"].map(d => (
                    <motion.div key={d} whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}
                      style={{ flex:1 }}>
                      <Box onClick={() => setForm({ ...form, difficulty:d })} sx={{
                        py:"11px", borderRadius:"10px", textAlign:"center", cursor:"pointer",
                        background: form.difficulty===d ? `${diffColor(d)}18` : "rgba(34,211,238,0.03)",
                        border:`1px solid ${form.difficulty===d ? diffColor(d)+"55" : "rgba(34,211,238,0.15)"}`,
                        boxShadow: form.difficulty===d ? `0 0 14px ${diffColor(d)}22` : "none",
                        transition:"all 0.25s",
                      }}>
                        <Box sx={{ width:7, height:7, borderRadius:"50%", mx:"auto", mb:0.5,
                          background:diffColor(d),
                          boxShadow: form.difficulty===d ? `0 0 8px ${diffColor(d)}` : "none",
                          transition:"box-shadow 0.25s" }} />
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.62rem", fontWeight:700,
                          color: form.difficulty===d ? diffColor(d) : textSec,
                          letterSpacing:"0.06em", textTransform:"uppercase" }}>
                          {d}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {/* Experience */}
              <Box sx={{ flex:1, minWidth:200 }}>
                <ThemedInput label="Experience Level" icon={<WorkIcon />}
                  name="experience" value={form.experience} onChange={handleChange}
                  placeholder="e.g. Junior, Senior, 2+ years..." />
              </Box>
            </Box>

            {/* ── Question Text ── */}
            <ThemedInput label="Question Text" icon={<QuizIcon />}
              name="questionText" value={form.questionText} onChange={handleChange}
              multiline rows={4}
              placeholder="Enter the full question here..." />

            {/* ── Options ── */}
            <Box sx={{ mb:0.5 }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:0.8, mb:1.5 }}>
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.52rem", color:textSec, letterSpacing:"0.14em",
                  textTransform:"uppercase" }}>
                  Options
                </Typography>
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.5rem", color:successC, opacity:0.75, letterSpacing:"0.1em" }}>
                  // tap ✓ to mark correct
                </Typography>
              </Box>

              {["A","B","C","D"].map(key => (
                <OptionRow key={key} optKey={key}
                  value={form.options[key]}
                  isCorrect={form.correctAnswer === key}
                  onChange={handleOption}
                  onSelect={handleCorrect}
                />
              ))}
            </Box>

            {/* ── Correct answer pill ── */}
            <AnimatePresence>
              {form.correctAnswer && (
                <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-6 }} transition={{ duration:0.25 }}>
                  <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:2.5,
                    px:2, py:"10px", borderRadius:"9px",
                    background:`${successC}10`, border:`1px solid ${successC}30` }}>
                    <CheckCircleIcon sx={{ color:successC, fontSize:"1rem" }} />
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontSize:"0.88rem", color:successC, fontWeight:600 }}>
                      Correct Answer: Option {form.correctAnswer}
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Divider ── */}
            <Box sx={{ height:"1px", background:"rgba(34,211,238,0.08)", mb:2.5 }} />

            {/* ── Save Button ── */}
            <motion.div whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}>
              <Box onClick={submit} sx={{
                display:"flex", alignItems:"center", justifyContent:"center", gap:1,
                py:"14px", borderRadius:"12px", cursor:"pointer",
                background: saved
                  ? `linear-gradient(135deg, #065f46, ${successC}cc)`
                  : `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`,
                border:`1px solid ${saved ? successC + "55" : primary + "55"}`,
                boxShadow:`0 4px 20px ${saved ? successC : primary}40`,
                transition:"all 0.3s",
                "&:hover":{ boxShadow:`0 8px 32px ${saved ? successC : primary}60` },
              }}>
                {saving
                  ? <CircularProgress size={18} sx={{ color:"#030712" }} />
                  : saved
                  ? <CheckCircleIcon sx={{ color:"#030712", fontSize:"1.1rem" }} />
                  : <SaveIcon sx={{ color:"#030712", fontSize:"1.1rem" }} />}
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontWeight:800, fontSize:"0.92rem", color:"#030712",
                  letterSpacing:"0.08em", textTransform:"uppercase" }}>
                  {saving ? "Saving..." : saved ? "Saved!" : isEdit ? "Update MCQ" : "Save MCQ"}
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