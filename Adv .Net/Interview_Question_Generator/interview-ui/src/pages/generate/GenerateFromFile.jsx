import { useState, useRef } from "react";
import {
  Box, Typography, Button, Select,
  MenuItem, CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import UploadFileIcon      from "@mui/icons-material/UploadFile";
import AutoAwesomeIcon     from "@mui/icons-material/AutoAwesome";
import DashboardIcon       from "@mui/icons-material/Dashboard";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon           from "@mui/icons-material/Close";

export default function GenerateFromFile() {
  const [file,          setFile]          = useState(null);
  const [loading,       setLoading]       = useState(false);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty,    setDifficulty]    = useState("Easy");
  const [dragOver,      setDragOver]      = useState(false);
  const fileRef  = useRef();
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
    if (!file) { alert("Please select a PDF or PPT file"); return; }
    const formData = new FormData();
    formData.append("file",       file);
    formData.append("count",      questionCount);
    formData.append("difficulty", difficulty);
    try {
      setLoading(true);
      const res = await api.post("/ai/generate-from-file", formData);
      navigate("/mcq-preview", { state: { mcqs: res.data, source: "FILE" } });
    } catch (err) {
      console.error(err);
      alert("Failed to generate questions from file");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
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

  return (
    <Box sx={{
      minHeight: "100vh", background: bg,
      display: "flex", alignItems: "flex-start",
      justifyContent: "center",
      p: { xs: 2, md: "40px 24px" },
      position: "relative", overflow: "hidden",
    }}>

      {/* Ambient glows */}
      <Box sx={{ position: "fixed", top: "-10%", left: "50%",
        transform: "translateX(-50%)", width: 500, height: 500,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${primary}14 0%, transparent 65%)`,
        filter: "blur(60px)", zIndex: 0 }} />
      <Box sx={{ position: "fixed", bottom: "5%", right: "5%",
        width: 350, height: 350, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${secondary}12 0%, transparent 65%)`,
        filter: "blur(55px)", zIndex: 0 }} />

      <Box sx={{ width: "100%", maxWidth: 660, position: "relative", zIndex: 2 }}>

        {/* ── BACK BUTTON ── */}
        <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}>
          <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.97 }}
            style={{ display: "inline-block", marginBottom: 22 }}>
            <Box onClick={() => navigate("/user/dashboard")} sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              px: 2, py: 0.9, borderRadius: "9px", cursor: "pointer",
              border: `1px solid rgba(34,211,238,0.15)`,
              background: "rgba(34,211,238,0.04)",
              transition: "all 0.22s",
              "&:hover": {
                background: "rgba(34,211,238,0.09)",
                border: `1px solid ${primary}40`,
                boxShadow: `0 0 14px ${primary}15`,
              },
            }}>
              <Typography sx={{ color: textSec, fontSize: "0.78rem", lineHeight: 1 }}>←</Typography>
              <DashboardIcon sx={{ color: primary, fontSize: "0.95rem" }} />
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 500,
                fontSize: "0.82rem", color: textSec }}>
                Dashboard
              </Typography>
            </Box>
          </motion.div>
        </motion.div>

        {/* ── HEADING ── */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          <Box sx={{ mb: 3.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.6 }}>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%",
                background: primary, boxShadow: `0 0 6px ${primary}` }} />
              <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.56rem", color: primary,
                letterSpacing: "0.2em", opacity: 0.8 }}>
                AI_GENERATE // FILE_INPUT
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily: "'Exo 2', sans-serif", fontWeight: 900,
              fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.15, mb: 0.5,
              background: `linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Generate from File
            </Typography>
            <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
              color: textSec, fontSize: "0.88rem", opacity: 0.8 }}>
              Upload a PDF or PowerPoint — AI extracts and generates questions instantly.
            </Typography>
          </Box>
        </motion.div>

        {/* ── MAIN CARD ── */}
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <Box sx={{
            borderRadius: "18px", p: "26px",
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

            {/* ── DROP ZONE ── */}
            <Box
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              sx={{
                mb: 3, borderRadius: "12px", p: "26px 20px",
                border: `1.5px dashed ${dragOver ? primary : file ? success + "60" : "rgba(34,211,238,0.22)"}`,
                background: dragOver ? `${primary}10` : file ? `${success}06` : "rgba(34,211,238,0.02)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.25s", gap: 1.5,
                "&:hover": {
                  border: `1.5px dashed ${primary}55`,
                  background: `${primary}07`,
                  boxShadow: `0 0 18px ${primary}10`,
                },
              }}>
              <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx"
                style={{ display: "none" }}
                onChange={e => setFile(e.target.files[0])} />

              {file ? (
                <motion.div initial={{ scale: 0.88, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 10, width: "100%" }}>
                  <Box sx={{ width: 50, height: 50, borderRadius: "12px",
                    background: `${success}18`, border: `1px solid ${success}40`,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <InsertDriveFileIcon sx={{ color: success, fontSize: "1.4rem" }} />
                  </Box>
                  <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                    fontWeight: 600, fontSize: "0.88rem", color: success, textAlign: "center" }}>
                    {file.name}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.56rem", color: `${success}80`, letterSpacing: "0.12em" }}>
                    {(file.size / 1024).toFixed(1)} KB · READY
                  </Typography>
                  <Box onClick={e => { e.stopPropagation(); setFile(null); }}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5,
                      px: 1.5, py: 0.4, borderRadius: "6px", cursor: "pointer",
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.22)",
                      "&:hover": { background: "rgba(248,113,113,0.16)" } }}>
                    <CloseIcon sx={{ color: error, fontSize: "0.7rem" }} />
                    <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                      fontSize: "0.7rem", color: error }}>Remove</Typography>
                  </Box>
                </motion.div>
              ) : (
                <>
                  <Box sx={{ width: 54, height: 54, borderRadius: "14px",
                    background: `${primary}14`, border: `1px solid ${primary}35`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: `0 0 18px ${primary}18` }}>
                    <UploadFileIcon sx={{ color: primary, fontSize: "1.5rem" }} />
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                      fontWeight: 600, fontSize: "0.9rem", color: textPri, mb: 0.3 }}>
                      Drop your file here
                    </Typography>
                    <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                      fontSize: "0.78rem", color: textSec }}>
                      or{" "}
                      <Box component="span" sx={{ color: primary, fontWeight: 600,
                        textDecoration: "underline", textUnderlineOffset: 3 }}>
                        browse to upload
                      </Box>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {[".PDF", ".PPT", ".PPTX"].map(ext => (
                      <Box key={ext} sx={{ px: 1.2, py: "3px", borderRadius: "6px",
                        background: `${primary}10`, border: `1px solid ${primary}25` }}>
                        <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.56rem", color: primary, letterSpacing: "0.1em" }}>
                          {ext}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </Box>

            {/* ── PARAMETERS ── */}
            <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.52rem", color: "rgba(71,85,105,0.85)",
              letterSpacing: "0.18em", mb: 1.5 }}>
              // PARAMETERS
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <Box sx={{ flex: 1, minWidth: 145 }}>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontSize: "0.72rem", color: textSec, mb: 0.7, letterSpacing: "0.04em" }}>
                  Question Count
                </Typography>
                <Select fullWidth value={questionCount}
                  onChange={e => setQuestionCount(Number(e.target.value))}
                  sx={selectSx} MenuProps={menuProps}>
                  {[5, 10, 20, 30].map(n => (
                    <MenuItem key={n} value={n}>{n} Questions</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ flex: 1, minWidth: 145 }}>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontSize: "0.72rem", color: textSec, mb: 0.7, letterSpacing: "0.04em" }}>
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
            <motion.div whileHover={{ scale: file && !loading ? 1.015 : 1 }}
              whileTap={{ scale: file && !loading ? 0.97 : 1 }}>
              <Button fullWidth onClick={handleGenerate}
                disabled={loading || !file}
                sx={{
                  height: 52, borderRadius: "11px",
                  fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 800, fontSize: "0.9rem",
                  letterSpacing: "0.08em", textTransform: "uppercase",
                  background: file && !loading
                    ? `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`
                    : "rgba(34,211,238,0.06)",
                  color: file && !loading ? "#030712" : textSec,
                  border: `1px solid ${file ? primary + "55" : "rgba(34,211,238,0.1)"}`,
                  boxShadow: file && !loading ? `0 4px 22px ${primary}40` : "none",
                  transition: "all 0.28s",
                  "&:hover": file && !loading ? {
                    background: `linear-gradient(135deg, ${primary}, #67e8f9)`,
                    boxShadow: `0 8px 34px ${primary}60`,
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
                        PROCESSING...
                      </Typography>
                    </Box>
                  : <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AutoAwesomeIcon sx={{ fontSize: "1rem" }} />
                      Generate from File
                    </Box>}
              </Button>
            </motion.div>
          </Box>
        </motion.div>

        {/* ── GO TO DASHBOARD ── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.45 }}>
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Box onClick={() => navigate("/user/dashboard")} sx={{
              mt: 2.5, p: "13px 20px", borderRadius: "12px",
              border: `1px solid rgba(34,211,238,0.12)`,
              background: "rgba(34,211,238,0.03)",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 1.2,
              cursor: "pointer", transition: "all 0.25s",
              "&:hover": {
                background: "rgba(34,211,238,0.08)",
                border: `1px solid ${primary}35`,
                boxShadow: `0 0 18px ${primary}12`,
              },
            }}>
              <DashboardIcon sx={{ color: primary, fontSize: "1.05rem" }} />
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                fontWeight: 600, fontSize: "0.87rem", color: textSec }}>
                Go to Dashboard
              </Typography>
              <Typography sx={{ color: textSec, fontSize: "0.75rem",
                opacity: 0.45, ml: "auto" }}>→</Typography>
            </Box>
          </motion.div>
        </motion.div>

      </Box>
    </Box>
  );
}

// import { useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   Select,
//   MenuItem
// } from "@mui/material";
// import api from "../../api/axios";
// import { useNavigate } from "react-router-dom";

// export default function GenerateFromFile() {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [questionCount, setQuestionCount] = useState(10);
//   const [difficulty, setDifficulty] = useState("Easy");

//   const navigate = useNavigate();

//   const handleGenerate = async () => {
//     if (!file) {
//       alert("Please select a PDF or PPT file");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("count", questionCount);
//     formData.append("difficulty", difficulty);

//     try {
//       setLoading(true);

//       const res = await api.post(
//         "/ai/generate-from-file",
//         formData
//       );

//       // ✅ SAME PRACTICE: NAVIGATION HERE
//       navigate("/mcq-preview", {
//         state: {
//           mcqs: res.data,
//           source: "FILE"
//         }
//       });

//     } catch (err) {
//       console.error(err);
//       alert("Failed to generate questions from file");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box maxWidth="700px" mx="auto" mt={6}>
//       <Typography variant="h4" fontWeight={700} mb={2}>
//         Generate Questions from File
//       </Typography>

//       <Paper sx={{ p: 4, borderRadius: 4, bgcolor: "#F8FAFF" }}>
//         {/* FILE UPLOAD */}
//         <input
//           type="file"
//           accept=".pdf,.ppt,.pptx"
//           onChange={(e) => setFile(e.target.files[0])}
//         />

//         {/* OPTIONS */}
//         <Box display="flex" gap={2} mt={4}>
//           <Select
//             fullWidth
//             value={questionCount}
//             onChange={(e) => setQuestionCount(Number(e.target.value))}
//           >
//             <MenuItem value={5}>5 Questions</MenuItem>
//             <MenuItem value={10}>10 Questions</MenuItem>
//             <MenuItem value={20}>20 Questions</MenuItem>
//             <MenuItem value={30}>30 Questions</MenuItem>
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

//         {/* GENERATE BUTTON */}
//         <Button
//           fullWidth
//           onClick={handleGenerate}
//           disabled={loading}
//           sx={{
//             mt: 4,
//             bgcolor: "#2563EB",
//             color: "white",
//             fontWeight: 600,
//             py: 1.4
//           }}
//         >
//           {loading ? "Generating..." : "✨ Generate from File"}
//         </Button>
//       </Paper>
//     </Box>
//   );
// }