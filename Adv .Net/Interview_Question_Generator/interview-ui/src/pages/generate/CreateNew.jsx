import { useState } from "react";
import { Box, Typography, Tabs, Tab, TextField,
  Button, MenuItem, Select, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { generateAiMcqs } from "../../api/questionApi";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon  from "@mui/icons-material/AutoAwesome";
import HubIcon          from "@mui/icons-material/Hub";
import DashboardIcon    from "@mui/icons-material/Dashboard";
import TopicIcon        from "@mui/icons-material/Topic";
import TextFieldsIcon   from "@mui/icons-material/TextFields";
import LanguageIcon     from "@mui/icons-material/Language";
import UploadFileIcon   from "@mui/icons-material/UploadFile";

const TABS = [
  { label: "Topic",   icon: <TopicIcon    sx={{ fontSize: "1rem" }} /> },
  { label: "Text",    icon: <TextFieldsIcon sx={{ fontSize: "1rem" }} /> },
  { label: "Webpage", icon: <LanguageIcon  sx={{ fontSize: "1rem" }} /> }
];

export default function CreateNew() {
  const [tab,           setTab]           = useState(0);
  const [input,         setInput]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [questionType,  setQuestionType]  = useState("MCQ");
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty,    setDifficulty]    = useState("Easy");

  const navigate = useNavigate();
  const theme    = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const success   = theme.palette.success.main;
  const warning   = theme.palette.warning.main;
  const error     = theme.palette.error.main;

  const handleGenerate = async () => {
    if (!input.trim()) { alert("Please enter a topic or content"); return; }
    try {
      setLoading(true);
      const res = await generateAiMcqs({
        userId: 1, input,
        count: questionCount,
        difficulty, type: questionType,
      });
      navigate("/mcq-preview", { state: { mcqs: res.data } });
    } catch (err) {
      console.error(err);
      alert("Failed to generate MCQs");
    } finally {
      setLoading(false);
    }
  };

  const selectSx = {
    fontFamily: "'Exo 2', sans-serif",
    color: textPri, fontSize: "0.88rem",
    background: paper,
    border: `1px solid rgba(34,211,238,0.18)`,
    borderRadius: "10px", transition: "all 0.25s",
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "& .MuiSvgIcon-root": { color: primary },
    "&:hover": { border: `1px solid ${primary}50`, boxShadow: `0 0 12px ${primary}15` },
    "&.Mui-focused": { border: `1px solid ${primary}70`, boxShadow: `0 0 0 3px ${primary}15` },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        background: "#0d1f3c",
        border: `1px solid rgba(34,211,238,0.18)`,
        borderRadius: "10px", mt: 0.5,
        "& .MuiMenuItem-root": {
          fontFamily: "'Exo 2', sans-serif", fontSize: "0.88rem",
          color: textSec, py: 1, transition: "all 0.18s",
          "&:hover": { background: `${primary}15`, color: primary },
          "&.Mui-selected": {
            background: `${primary}18`, color: primary,
            "&:hover": { background: `${primary}25` },
          },
        },
      },
    },
  };

  const diffColors = { Easy: success, Medium: warning, Hard: error };
  const isReady    = input.trim().length > 0;

  return (
    <Box sx={{
      minHeight: "100vh", background: bg,
      p: { xs: 2, md: "36px 32px" },
      position: "relative", overflow: "hidden",
    }}>

      {/* Ambient glows */}
      <Box sx={{ position: "fixed", top: "-10%", left: "50%",
        transform: "translateX(-50%)", width: 550, height: 550,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${primary}13 0%, transparent 65%)`,
        filter: "blur(65px)", zIndex: 0 }} />
      <Box sx={{ position: "fixed", bottom: "0%", right: "0%",
        width: 400, height: 400, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter: "blur(60px)", zIndex: 0 }} />

      <Box sx={{ maxWidth: 820, mx: "auto", position: "relative", zIndex: 2 }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <Box sx={{ display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.6 }}>
                <HubIcon sx={{ color: primary, fontSize: "0.85rem" }} />
                <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.56rem", color: primary, letterSpacing: "0.2em", opacity: 0.8 }}>
                  AI_ENGINE // CREATE_QUIZ
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily: "'Exo 2', sans-serif", fontWeight: 900,
                fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.1,
                background: `linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Create Quiz
              </Typography>
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                color: textSec, fontSize: "0.88rem", mt: 0.4 }}>
                Build a custom quiz from topic, text, webpage or file.
              </Typography>
            </Box>

            {/* Dashboard */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Box onClick={() => navigate("/user/dashboard")} sx={{
                display: "flex", alignItems: "center", gap: 1,
                px: 2, py: 1, borderRadius: "9px", cursor: "pointer",
                border: `1px solid rgba(34,211,238,0.18)`,
                background: "rgba(34,211,238,0.04)", transition: "all 0.22s",
                "&:hover": { background: "rgba(34,211,238,0.1)",
                  border: `1px solid ${primary}40` },
              }}>
                <DashboardIcon sx={{ color: primary, fontSize: "1rem" }} />
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontSize: "0.82rem", fontWeight: 500, color: textSec }}>
                  Dashboard
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* ── MAIN CARD ── */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <Box sx={{
            borderRadius: "18px", p: { xs: "20px 18px", md: "28px 30px" },
            background: `linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
            border: `1px solid rgba(34,211,238,0.13)`,
            boxShadow: `0 4px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(34,211,238,0.06)`,
            position: "relative", overflow: "hidden",
            "&::before": {
              content: '""', position: "absolute",
              top: 0, left: "8%", right: "8%", height: "1.5px",
              background: `linear-gradient(90deg, transparent, ${primary}70, ${secondary}50, transparent)`,
            },
          }}>

            {/* ── TABS ── */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)}
              sx={{
                mb: 3,
                "& .MuiTabs-root": { minHeight: 40 },
                "& .MuiTabs-indicator": {
                  background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                  height: 2, borderRadius: 99,
                  boxShadow: `0 0 8px ${primary}80`,
                },
                "& .MuiTab-root": {
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 600, fontSize: "0.82rem",
                  color: textSec, minHeight: 40,
                  textTransform: "none", letterSpacing: "0.02em",
                  transition: "color 0.22s",
                  "&.Mui-selected": { color: primary },
                  "&:hover": { color: primary, opacity: 0.85 },
                },
                "& .MuiTabs-flexContainer": { gap: 0.5 },
              }}>
              {TABS.map((t, i) => (
                <Tab key={t.label} label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                    <Box sx={{ color: tab === i ? primary : textSec,
                      transition: "color 0.22s" }}>{t.icon}</Box>
                    {t.label}
                  </Box>
                } />
              ))}
            </Tabs>

            {/* ── INPUT LABEL ── */}
            <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.52rem", color: "rgba(71,85,105,0.85)",
              letterSpacing: "0.18em", mb: 1 }}>
              // INPUT
            </Typography>

            {/* ── TEXT FIELD ── */}
            <TextField fullWidth multiline minRows={3} maxRows={7}
              placeholder={
                tab === 0 ? "e.g. React Hooks, Machine Learning, Data Structures..." :
                tab === 1 ? "Paste your content here..." :
                tab === 2 ? "Enter a webpage URL..." :
                            "Describe what to generate from your file..."
              }
              value={input}
              onChange={e => setInput(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiInputBase-root": {
                  fontFamily: "'Exo 2', sans-serif",
                  fontSize: "0.92rem", color: textPri,
                  background: `${paper}cc`,
                  border: `1px solid rgba(34,211,238,0.18)`,
                  borderRadius: "12px",
                  transition: "all 0.25s",
                  "&:hover": {
                    border: `1px solid ${primary}45`,
                    boxShadow: `0 0 12px ${primary}12`,
                  },
                  "&.Mui-focused": {
                    border: `1px solid ${primary}65`,
                    boxShadow: `0 0 0 3px ${primary}12`,
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiInputBase-input::placeholder": {
                  color: textSec, opacity: 0.5,
                  fontFamily: "'Exo 2', sans-serif",
                },
              }}
            />

            {/* ── PARAMS LABEL ── */}
            <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.52rem", color: "rgba(71,85,105,0.85)",
              letterSpacing: "0.18em", mb: 1.5 }}>
              // PARAMETERS
            </Typography>

            {/* ── SELECTS ROW ── */}
            <Box sx={{ display: "flex", gap: 2, mb: 3.5, flexWrap: "wrap" }}>

              {/* Question type */}
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontSize: "0.7rem", color: textSec, mb: 0.7, letterSpacing: "0.04em" }}>
                  Question Type
                </Typography>
                <Select fullWidth value={questionType}
                  onChange={e => setQuestionType(e.target.value)}
                  sx={selectSx} MenuProps={menuProps}>
                  <MenuItem value="MCQ">Multiple Choice</MenuItem>
                  <MenuItem value="ONE_WORD">One Word Answer</MenuItem>
                  <MenuItem value="THEORY">Theory Based</MenuItem>
                </Select>
              </Box>

              {/* Count */}
              <Box sx={{ flex: 1, minWidth: 140 }}>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontSize: "0.7rem", color: textSec, mb: 0.7, letterSpacing: "0.04em" }}>
                  Question Count
                </Typography>
                <Select fullWidth value={questionCount}
                  onChange={e => setQuestionCount(Number(e.target.value))}
                  sx={selectSx} MenuProps={menuProps}>
                  {[5, 10, 20].map(n => (
                    <MenuItem key={n} value={n}>{n} Questions</MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Difficulty */}
              <Box sx={{ flex: 1, minWidth: 140 }}>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontSize: "0.7rem", color: textSec, mb: 0.7, letterSpacing: "0.04em" }}>
                  Difficulty Level
                </Typography>
                <Select fullWidth value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  sx={selectSx} MenuProps={menuProps}>
                  {["Easy", "Medium", "Hard"].map(d => (
                    <MenuItem key={d} value={d}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 7, height: 7, borderRadius: "50%",
                          background: diffColors[d],
                          boxShadow: `0 0 5px ${diffColors[d]}` }} />
                        {d}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            {/* ── GENERATE BUTTON ── */}
            <motion.div whileHover={{ scale: isReady ? 1.015 : 1 }}
              whileTap={{ scale: isReady ? 0.97 : 1 }}>
              <Button fullWidth onClick={handleGenerate}
                disabled={loading || !isReady}
                sx={{
                  height: 54, borderRadius: "12px",
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 800, fontSize: "0.92rem",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: isReady && !loading
                    ? `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`
                    : "rgba(34,211,238,0.06)",
                  color: isReady && !loading ? "#030712" : textSec,
                  border: `1px solid ${isReady ? primary + "55" : "rgba(34,211,238,0.1)"}`,
                  boxShadow: isReady && !loading ? `0 4px 22px ${primary}40` : "none",
                  transition: "all 0.28s",
                  "&:hover": isReady && !loading ? {
                    background: `linear-gradient(135deg, ${primary}, #67e8f9)`,
                    boxShadow: `0 8px 36px ${primary}60`,
                  } : {},
                  "&.Mui-disabled": {
                    background: "rgba(34,211,238,0.04)",
                    color: "rgba(125,211,252,0.28)",
                    border: "1px solid rgba(34,211,238,0.08)",
                  },
                }}>
                {loading
                  ? <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <CircularProgress size={18} sx={{ color: primary }} />
                      <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.7rem", color: primary, letterSpacing: "0.12em" }}>
                        GENERATING...
                      </Typography>
                    </Box>
                  : <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AutoAwesomeIcon sx={{ fontSize: "1rem" }} />
                      Generate Quiz
                    </Box>}
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        <Box sx={{ height: 40 }} />
      </Box>
    </Box>
  );
}
// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Tabs,
//   Tab,
//   TextField,
//   Button,
//   MenuItem,
//   Select
// } from "@mui/material";
// import { generateAiMcqs } from "../../api/questionApi";
// import { useNavigate } from "react-router-dom";

// export default function CreateNew() {
//   const [tab, setTab] = useState(0);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ NEW STATES FOR SELECTS
//   const [questionType, setQuestionType] = useState("MCQ");
//   const [questionCount, setQuestionCount] = useState(5);
//   const [difficulty, setDifficulty] = useState("Easy");

//   const navigate = useNavigate();

//   const handleGenerate = async () => {
//     if (!input.trim()) {
//       alert("Please enter a topic or content");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await generateAiMcqs({
//         userId: 1,
//         input,
//         count: questionCount,
//         difficulty,
//         type: questionType
//       });

//       navigate("/mcq-preview", {
//         state: { mcqs: res.data }
//       });

//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate MCQs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box maxWidth="1000px" mx="auto" mt={6}>
//       <Typography variant="h4" fontWeight={700} mb={1}>
//         Create Quiz
//       </Typography>

//       <Typography color="text.secondary" mb={4}>
//         Build a custom quiz from topic, text, webpage or file
//       </Typography>

//       <Paper sx={{ p: 4, borderRadius: 4, bgcolor: "#F8FAFF" }}>
//         {/* Tabs */}
//         <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
//           <Tab label="Topic" />
//           <Tab label="Text" />
//           <Tab label="Webpage" />
//           <Tab label="Files" />
//         </Tabs>

//         {/* Input */}
//         <TextField
//           fullWidth
//           placeholder="Enter topic / content"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />

//         {/* ✅ OPTIONS (FIXED) */}
//         <Box display="flex" gap={2} mt={4}>
//           <Select
//             fullWidth
//             value={questionType}
//             onChange={(e) => setQuestionType(e.target.value)}
//           >
//             <MenuItem value="MCQ">Multiple Choice</MenuItem>
//             <MenuItem value="ONE_WORD">One Word Answer</MenuItem>
//             <MenuItem value="THEORY">Theory Based</MenuItem>
//           </Select>

//           <Select
//             fullWidth
//             value={questionCount}
//             onChange={(e) => setQuestionCount(Number(e.target.value))}
//           >
//             <MenuItem value={5}>5 Questions</MenuItem>
//             <MenuItem value={10}>10 Questions</MenuItem>
//             <MenuItem value={20}>20 Questions</MenuItem>
//           </Select>

//           <Select
//             fullWidth
//             value={difficulty}
//             onChange={(e) => setDifficulty(e.target.value)}
//           >
//             <MenuItem value="Easy">Easy</MenuItem>
//             <MenuItem value="Medium">Medium</MenuItem>
//             <MenuItem value="Hard">Hard</MenuItem>
//           </Select>
//         </Box>

//         {/* Generate Button */}
//         <Button
//           fullWidth
//           onClick={handleGenerate}
//           disabled={loading}
//           sx={{
//             mt: 4,
//             bgcolor: "#2563EB",
//             color: "white",
//             py: 1.5,
//             fontWeight: 600
//           }}
//         >
//           {loading ? "Generating..." : "✨ Generate Quiz"}
//         </Button>
//       </Paper>
//     </Box>
//   );
// }