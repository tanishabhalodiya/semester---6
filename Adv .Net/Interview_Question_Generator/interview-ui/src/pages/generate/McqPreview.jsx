import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import DashboardIcon     from "@mui/icons-material/Dashboard";
import VisibilityIcon    from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon          from "@mui/icons-material/Save";
import ArrowBackIcon     from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon  from "@mui/icons-material/ArrowForward";
import CheckCircleIcon   from "@mui/icons-material/CheckCircle";
import HubIcon           from "@mui/icons-material/Hub";
import DownloadIcon      from "@mui/icons-material/Download";
import LightbulbIcon     from "@mui/icons-material/Lightbulb";
import Menu     from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import * as XLSX  from "xlsx";
import { saveAs } from "file-saver";
import jsPDF      from "jspdf";
import autoTable  from "jspdf-autotable";

const PAGE_SIZE = 5;

// ── Helpers to normalise field names from any AI response shape ───────────────
// Backend returns: Correct_Answer (set in AiMcqDto) for all question types
function getCorrectAnswer(q) {
  return (
    q.correct_Answer ??   // AiMcqDto field name (C# → JSON camelCase = correct_Answer)
    q.Correct_Answer ??   // PascalCase variant
    q.correctAnswer  ??   // camelCase variant
    q.correct_answer ??   // snake_case from raw AI (ONE_WORD/THEORY)
    q.answer         ??   // direct "answer" field
    q.Answer         ??
    ""
  );
}

function getQuestion(q) {
  return q.question ?? q.Question ?? q.questionText ?? "";
}

function getOptions(q) {
  const opts = q.options ?? q.Options ?? null;
  // Return null if options object is empty (ONE_WORD / THEORY)
  if (!opts || Object.keys(opts).length === 0) return null;
  return opts;
}

// Detect question type from the data shape
function getQuestionType(q) {
  const opts = getOptions(q);
  if (!opts) return "OPEN"; // ONE_WORD or THEORY
  return "MCQ";
}

export default function McqPreview() {
  const navigate  = useNavigate();
  const { state } = useLocation();
  const theme     = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const success   = theme.palette.success.main;
  const warningC  = theme.palette.warning.main;

  const mcqs   = state?.mcqs   || [];
  const source = state?.source || "TEXT";

  const [page,           setPage]           = useState(1);
  const [showAnswers,    setShowAnswers]     = useState(false);
  const [downloadAnchor, setDownloadAnchor] = useState(null);
  const [saved,          setSaved]          = useState(false);
  const [saving,         setSaving]         = useState(false);

  const openDownloadMenu  = (e) => setDownloadAnchor(e.currentTarget);
  const closeDownloadMenu = ()  => setDownloadAnchor(null);

  const start       = (page - 1) * PAGE_SIZE;
  const currentMcqs = mcqs.slice(start, start + PAGE_SIZE);
  const totalPages  = Math.ceil(mcqs.length / PAGE_SIZE);

  const handleBack = () => navigate(source === "FILE" ? "/generate-file" : "/create");

  const downloadExcel = () => {
    const data = mcqs.map((q, i) => ({
      No:       i + 1,
      Question: getQuestion(q),
      A:        getOptions(q)?.A || "",
      B:        getOptions(q)?.B || "",
      C:        getOptions(q)?.C || "",
      D:        getOptions(q)?.D || "",
      Answer:   getCorrectAnswer(q),
    }));
    const ws  = XLSX.utils.json_to_sheet(data);
    const wb  = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MCQs");
    const buf = XLSX.write(wb, { bookType:"xlsx", type:"array" });
    saveAs(new Blob([buf], {
      type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }), "questions.xlsx");
    closeDownloadMenu();
  };

  const downloadPDF = () => {
    const doc       = new jsPDF();
    const tableData = mcqs.map((q, i) => [
      i + 1,
      getQuestion(q),
      getOptions(q)?.A || "—",
      getOptions(q)?.B || "—",
      getOptions(q)?.C || "—",
      getOptions(q)?.D || "—",
      getCorrectAnswer(q),
    ]);
    autoTable(doc, {
      head:   [["No","Question","A","B","C","D","Answer"]],
      body:   tableData,
      styles: { fontSize:8 },
    });
    doc.save("questions.pdf");
    closeDownloadMenu();
  };

  const saveAllQuestions = async () => {
    try {
      setSaving(true);
      const payload = mcqs.map(q => ({
        question:       getQuestion(q),
        options:        getOptions(q) ?? {},
        correct_Answer: getCorrectAnswer(q),
      }));
      await api.post("/ai/save-bulk", payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to save questions");
    } finally { setSaving(false); }
  };

  const cardBase = {
    borderRadius:"14px", p:"22px 24px", mb:2.5,
    background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
    border:`1px solid rgba(34,211,238,0.12)`,
    boxShadow:`0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(34,211,238,0.05)`,
    position:"relative", overflow:"hidden",
    transition:"border-color 0.25s, box-shadow 0.25s",
    "&:hover":{ borderColor:`rgba(34,211,238,0.25)`,
      boxShadow:`0 8px 32px rgba(34,211,238,0.08)` },
  };

  if (mcqs.length === 0) return (
    <Box sx={{ minHeight:"100vh", background:bg, display:"flex",
      alignItems:"center", justifyContent:"center" }}>
      <Box sx={{ textAlign:"center" }}>
        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
          color:textSec, fontSize:"1rem", mb:2 }}>
          No questions found
        </Typography>
        <Button onClick={() => navigate("/create")} sx={{
          fontFamily:"'Exo 2', sans-serif", color:primary,
          border:`1px solid ${primary}40`, "&:hover":{ background:`${primary}12` },
        }}>
          Back to Generate
        </Button>
      </Box>
    </Box>
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

      <Box sx={{ maxWidth:860, mx:"auto", position:"relative", zIndex:2 }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5 }}>
          <Box sx={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", mb:4, flexWrap:"wrap", gap:2 }}>
            <Box>
              <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
                <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                  AI_OUTPUT // QUESTION_PREVIEW
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
                background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                Question Preview
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:textSec, fontSize:"0.85rem", mt:0.4 }}>
                {mcqs.length} questions generated · Page {page} of {totalPages}
              </Typography>
            </Box>

            <Box sx={{ display:"flex", alignItems:"center", gap:1.5, flexWrap:"wrap" }}>
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
                    fontSize:"0.82rem", fontWeight:500, color:textSec }}>Dashboard</Typography>
                </Box>
              </motion.div>

              <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
                <Box onClick={openDownloadMenu} sx={{
                  display:"flex", alignItems:"center", gap:1,
                  px:2, py:1, borderRadius:"9px", cursor:"pointer",
                  border:`1px solid ${primary}35`,
                  background:"rgba(34,211,238,0.05)", transition:"all 0.25s",
                  "&:hover":{ background:`${primary}15` },
                }}>
                  <DownloadIcon sx={{ color:primary, fontSize:"1rem" }} />
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontSize:"0.82rem", fontWeight:500, color:primary }}>Download</Typography>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>

        {/* Download menu */}
        <Menu anchorEl={downloadAnchor} open={Boolean(downloadAnchor)}
          onClose={closeDownloadMenu}
          PaperProps={{ sx:{
            background:"#0d1f3c", border:`1px solid rgba(34,211,238,0.2)`,
            borderRadius:"10px", boxShadow:`0 8px 32px rgba(0,0,0,0.5)`,
            "& .MuiMenuItem-root":{ fontFamily:"'Exo 2', sans-serif",
              fontSize:"0.9rem", color:textSec, py:1.2,
              "&:hover":{ background:`${primary}15`, color:primary } },
          }}}>
          <MenuItem onClick={downloadExcel}>📊 Download Excel</MenuItem>
          <MenuItem onClick={downloadPDF}>📄 Download PDF</MenuItem>
        </Menu>

        {/* ── QUESTION CARDS ── */}
        <AnimatePresence mode="wait">
          <motion.div key={page}
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
            exit={{ opacity:0, x:-20 }}
            transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}>
            {currentMcqs.map((q, i) => {
              const correctAns = getCorrectAnswer(q);
              const question   = getQuestion(q);
              const options    = getOptions(q);
              const qType      = getQuestionType(q); // "MCQ" or "OPEN"
              const isMCQ      = qType === "MCQ";

              return (
                <Box key={i} sx={{
                  ...cardBase,
                  "&::before":{ content:'""', position:"absolute",
                    top:0, left:0, bottom:0, width:"3px",
                    background: isMCQ
                      ? `linear-gradient(180deg, ${primary}, ${secondary})`
                      : `linear-gradient(180deg, ${warningC}, ${secondary})`,
                    boxShadow:`0 0 10px ${isMCQ ? primary : warningC}60` },
                }}>

                  {/* Question type badge */}
                  <Box sx={{ position:"absolute", top:14, right:16 }}>
                    <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
                      background: isMCQ ? `${primary}12` : `${warningC}12`,
                      border:`1px solid ${isMCQ ? primary : warningC}28` }}>
                      <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                        fontSize:"0.52rem",
                        color: isMCQ ? primary : warningC,
                        letterSpacing:"0.1em" }}>
                        {isMCQ ? "MCQ" : "OPEN"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Question number + text */}
                  <Box sx={{ display:"flex", alignItems:"flex-start", gap:1.5, mb:1.8 }}>
                    <Box sx={{ flexShrink:0, width:28, height:28, borderRadius:"7px",
                      background:`${primary}18`, border:`1px solid ${primary}35`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                        fontSize:"0.6rem", color:primary, fontWeight:700 }}>
                        {String(start + i + 1).padStart(2,"0")}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontWeight:600, fontSize:"0.95rem", color:textPri,
                      lineHeight:1.5, flex:1, pr:6 }}>
                      {question}
                    </Typography>
                  </Box>

                  {/* ── MCQ OPTIONS ── */}
                  {isMCQ && options && (
                    <Box sx={{ display:"flex", flexDirection:"column", gap:0.8, ml:"43px" }}>
                      {Object.entries(options).map(([key, value]) => {
                        // Case-insensitive match: "A" === "a", "B" === "b" etc.
                        const isCorrect = showAnswers &&
                          correctAns?.toString().trim().toUpperCase() ===
                          key?.toString().trim().toUpperCase();
                        return (
                          <Box key={key} sx={{
                            display:"flex", alignItems:"center", gap:1,
                            px:"12px", py:"8px", borderRadius:"8px",
                            background: isCorrect ? `${success}14` : "rgba(34,211,238,0.03)",
                            border:`1px solid ${isCorrect ? success+"45" : "rgba(34,211,238,0.08)"}`,
                            transition:"all 0.25s",
                          }}>
                            <Box sx={{ width:20, height:20, borderRadius:"5px", flexShrink:0,
                              background: isCorrect ? `${success}25` : `${primary}10`,
                              border:`1px solid ${isCorrect ? success+"50" : primary+"25"}`,
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                                fontSize:"0.6rem",
                                color: isCorrect ? success : primary, fontWeight:700 }}>
                                {key}
                              </Typography>
                            </Box>
                            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                              fontSize:"0.87rem",
                              color: isCorrect ? success : textSec,
                              fontWeight: isCorrect ? 600 : 400 }}>
                              {value}
                            </Typography>
                            {isCorrect && (
                              <CheckCircleIcon sx={{ color:success,
                                fontSize:"0.9rem", ml:"auto" }} />
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}

                  {/* ── ANSWER REVEAL ── */}
                  {/* Shows for BOTH MCQ and ONE_WORD/THEORY when showAnswers = true */}
                  {showAnswers && (
                    <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                      transition={{ duration:0.3 }}>
                      <Box sx={{ ml:"43px", mt:1.5 }}>
                        {isMCQ ? (
                          /* MCQ: show key + full text e.g. "A — Binary Search" */
                          <Box sx={{ display:"inline-flex", alignItems:"center", gap:1,
                            px:1.8, py:"8px", borderRadius:"9px",
                            background:`${success}10`, border:`1px solid ${success}35` }}>
                            <CheckCircleIcon sx={{ color:success, fontSize:"0.9rem" }} />
                            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                              fontSize:"0.68rem", color:success, letterSpacing:"0.1em" }}>
                              ANSWER:&nbsp;
                            </Typography>
                            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                              fontWeight:700, fontSize:"0.88rem", color:success }}>
                              {correctAns
                                ? `${correctAns}${options?.[correctAns] ? ` — ${options[correctAns]}` : ""}`
                                : "N/A"}
                            </Typography>
                          </Box>
                        ) : (
                          /* ONE_WORD / THEORY: show the full answer text */
                          <Box sx={{ display:"flex", alignItems:"flex-start", gap:1,
                            px:2, py:"12px", borderRadius:"10px",
                            background:`${warningC}10`, border:`1px solid ${warningC}35`,
                            maxWidth:"100%" }}>
                            <LightbulbIcon sx={{ color:warningC, fontSize:"1rem", flexShrink:0, mt:"1px" }} />
                            <Box>
                              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                                fontSize:"0.6rem", color:warningC, letterSpacing:"0.1em", mb:0.4 }}>
                                ANSWER
                              </Typography>
                              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                                fontWeight:600, fontSize:"0.92rem", color:textPri,
                                lineHeight:1.6 }}>
                                {correctAns || "No answer provided"}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </motion.div>
                  )}
                </Box>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── PAGINATION ── */}
        <Box sx={{ display:"flex", alignItems:"center",
          justifyContent:"space-between", mt:1, mb:3 }}>
          <motion.div whileHover={{ scale: page > 1 ? 1.04 : 1 }}
            whileTap={{ scale: page > 1 ? 0.97 : 1 }}>
            <Box onClick={() => page > 1 && setPage(p => p-1)} sx={{
              display:"flex", alignItems:"center", gap:0.8,
              px:2, py:0.9, borderRadius:"9px",
              border:`1px solid ${page > 1 ? "rgba(34,211,238,0.22)" : "rgba(34,211,238,0.08)"}`,
              background: page > 1 ? "rgba(34,211,238,0.05)" : "transparent",
              cursor: page > 1 ? "pointer" : "default",
              opacity: page > 1 ? 1 : 0.35, transition:"all 0.22s",
              "&:hover": page > 1 ? { background:"rgba(34,211,238,0.1)",
                border:`1px solid ${primary}40` } : {},
            }}>
              <ArrowBackIcon sx={{ color:primary, fontSize:"0.9rem" }} />
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontSize:"0.82rem", color:textSec }}>Prev</Typography>
            </Box>
          </motion.div>

          <Box sx={{ display:"flex", alignItems:"center", gap:0.8 }}>
            {Array.from({ length:totalPages }, (_, i) => (
              <motion.div key={i}
                animate={{ width: i+1===page ? 22 : 7, opacity: i+1===page ? 1 : 0.28 }}
                transition={{ duration:0.3 }}
                onClick={() => setPage(i+1)}
                style={{ height:7, borderRadius:99, cursor:"pointer",
                  background: i+1===page
                    ? `linear-gradient(90deg, ${primary}, ${secondary})`
                    : "#475569",
                  boxShadow: i+1===page ? `0 0 8px ${primary}70` : "none" }}
              />
            ))}
          </Box>

          <motion.div whileHover={{ scale: page < totalPages ? 1.04 : 1 }}
            whileTap={{ scale: page < totalPages ? 0.97 : 1 }}>
            <Box onClick={() => page < totalPages && setPage(p => p+1)} sx={{
              display:"flex", alignItems:"center", gap:0.8,
              px:2, py:0.9, borderRadius:"9px",
              border:`1px solid ${page < totalPages ? "rgba(34,211,238,0.22)" : "rgba(34,211,238,0.08)"}`,
              background: page < totalPages ? "rgba(34,211,238,0.05)" : "transparent",
              cursor: page < totalPages ? "pointer" : "default",
              opacity: page < totalPages ? 1 : 0.35, transition:"all 0.22s",
              "&:hover": page < totalPages ? { background:"rgba(34,211,238,0.1)",
                border:`1px solid ${primary}40` } : {},
            }}>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontSize:"0.82rem", color:textSec }}>Next</Typography>
              <ArrowForwardIcon sx={{ color:primary, fontSize:"0.9rem" }} />
            </Box>
          </motion.div>
        </Box>

        {/* ── ACTION BUTTONS ── */}
        <Box sx={{ display:"flex", flexDirection:"column", gap:1.5 }}>

          <motion.div whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}>
            <Box onClick={() => setShowAnswers(p => !p)} sx={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:1.2,
              p:"13px", borderRadius:"11px", cursor:"pointer",
              border:`1px solid ${primary}35`,
              background: showAnswers ? `${primary}18` : "rgba(34,211,238,0.05)",
              transition:"all 0.25s",
              "&:hover":{ background:`${primary}22`, boxShadow:`0 0 18px ${primary}15` },
            }}>
              {showAnswers
                ? <VisibilityOffIcon sx={{ color:primary, fontSize:"1.1rem" }} />
                : <VisibilityIcon    sx={{ color:primary, fontSize:"1.1rem" }} />}
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontWeight:600, fontSize:"0.88rem", color:primary }}>
                {showAnswers ? "Hide Answers" : "Show Answers"}
              </Typography>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}>
            <Box onClick={saveAllQuestions} sx={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:1.2,
              p:"13px", borderRadius:"11px", cursor:"pointer",
              background:`linear-gradient(135deg, #065f46, ${success}cc)`,
              border:`1px solid ${success}50`,
              boxShadow:`0 4px 20px ${success}25`,
              transition:"all 0.25s",
              opacity: saving ? 0.7 : 1,
              "&:hover":{ boxShadow:`0 8px 32px ${success}40` },
            }}>
              {saved
                ? <CheckCircleIcon sx={{ color:"#fff", fontSize:"1.1rem" }} />
                : <SaveIcon sx={{ color:"#fff", fontSize:"1.1rem" }} />}
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontWeight:700, fontSize:"0.88rem", color:"#fff", letterSpacing:"0.04em" }}>
                {saving ? "Saving..." : saved ? "Saved!" : "Save All Questions"}
              </Typography>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}>
            <Box onClick={handleBack} sx={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:1.2,
              p:"13px", borderRadius:"11px", cursor:"pointer",
              border:`1px solid rgba(34,211,238,0.15)`,
              background:"rgba(34,211,238,0.03)", transition:"all 0.25s",
              "&:hover":{ background:"rgba(34,211,238,0.08)", border:`1px solid ${primary}35` },
            }}>
              <ArrowBackIcon sx={{ color:textSec, fontSize:"1rem" }} />
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontWeight:500, fontSize:"0.87rem", color:textSec }}>
                Back to  {source === "FILE" ? "File Upload" : "Generate Form"}
              </Typography>
            </Box>
          </motion.div>
        </Box>

        <Box sx={{ height:40 }} />
      </Box>
    </Box>
  );
}