import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import HubIcon        from "@mui/icons-material/Hub";
import ArrowBackIcon  from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SendIcon       from "@mui/icons-material/Send";
import TimerIcon      from "@mui/icons-material/Timer";

export default function TakeTest() {
  const { sessionId } = useParams();
  const navigate      = useNavigate();
  const theme         = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const success   = theme.palette.success.main;
  const error     = theme.palette.error.main;
  const warning   = theme.palette.warning.main;

  const [questions, setQuestions] = useState([]);
  const [answers,   setAnswers]   = useState({});
  const [index,     setIndex]     = useState(0);
  const [timeLeft,  setTimeLeft]  = useState(30 * 60);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    api.get(`/Users/user/session/${sessionId}`)
      .then(res => {
        setQuestions(res.data.filter(q => q.optionsJson));
      })
      .catch(() => setQuestions([]))
      .finally(() => setLoading(false));
  }, [sessionId]);

  useEffect(() => {
    if (timeLeft <= 0) { submitTest(); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const timerColor = timeLeft < 120 ? error : timeLeft < 300 ? warning : primary;
  const progress   = (index / Math.max(questions.length, 1)) * 100;

  const handleChange = (qid, val) => setAnswers(p => ({ ...p, [qid]: val }));

  const submitTest = async () => {
    const payload = {
      answers: Object.keys(answers).map(qid => ({
        questionId: parseInt(qid), answer: answers[qid],
      })),
    };
    await api.post(`/Users/user/submit/${sessionId}`, payload);
    navigate(`/user/result/${sessionId}`);
  };

  const visible    = questions.slice(index, index + 3);
  const isLastPage = index + 3 >= questions.length;

  if (loading) return (
    <Box sx={{ minHeight: "100vh", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress sx={{ color: primary }} />
    </Box>
  );

  if (questions.length === 0) return (
    <Box sx={{ minHeight: "100vh", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ textAlign: "center", p: 4, borderRadius: "14px",
        border: `1px solid rgba(248,113,113,0.25)`,
        background: "rgba(248,113,113,0.05)" }}>
        <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
          color: error, fontSize: "1rem" }}>
          No MCQ questions assigned to this test.
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", background: bg,
      p: { xs: 2, md: "28px 32px" }, position: "relative", overflow: "hidden" }}>

      <Box sx={{ position: "fixed", top: "-8%", left: "40%", width: 480, height: 480,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter: "blur(65px)", zIndex: 0 }} />

      <Box sx={{ maxWidth: 820, mx: "auto", position: "relative", zIndex: 2 }}>

        {/* ── TOP BAR ── */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}>
          <Box sx={{ display: "flex", alignItems: "center",
            justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
              <HubIcon sx={{ color: primary, fontSize: "1rem" }} />
              <Box>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800,
                  fontSize: "1.2rem", color: textPri, lineHeight: 1 }}>
                  Skill Test
                </Typography>
                <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.52rem", color: primary, letterSpacing: "0.15em" }}>
                  SESSION_{sessionId}
                </Typography>
              </Box>
            </Box>

            {/* Timer */}
            <motion.div animate={{ scale: timeLeft < 60 ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 0.5, repeat: timeLeft < 60 ? Infinity : 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1,
                px: 2, py: 0.9, borderRadius: "10px",
                background: `${timerColor}12`,
                border: `1px solid ${timerColor}40`,
                boxShadow: timeLeft < 120 ? `0 0 16px ${timerColor}30` : "none" }}>
                <TimerIcon sx={{ color: timerColor, fontSize: "1rem" }} />
                <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                  fontWeight: 700, fontSize: "1rem", color: timerColor,
                  letterSpacing: "0.08em",
                  textShadow: timeLeft < 120 ? `0 0 10px ${timerColor}` : "none" }}>
                  {formatTime()}
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* ── PROGRESS BAR ── */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", mb: 1 }}>
            <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.55rem", color: primary, letterSpacing: "0.15em" }}>
              PROGRESS
            </Typography>
            <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.55rem", color: textSec, letterSpacing: "0.1em" }}>
              Q{index + 1}–{Math.min(index + 3, questions.length)} / {questions.length}
            </Typography>
          </Box>
          <Box sx={{ height: 3, borderRadius: 99, background: "rgba(34,211,238,0.1)", overflow: "hidden" }}>
            <motion.div animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }}
              style={{ height: "100%", borderRadius: 99,
                background: `linear-gradient(90deg, ${primary}, ${secondary})`,
                boxShadow: `0 0 8px ${primary}80` }} />
          </Box>
        </Box>

        {/* ── QUESTION CARDS ── */}
        <AnimatePresence mode="wait">
          <motion.div key={index}
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }}>
            {visible.map((q, i) => {
              let options = {};
              try { options = JSON.parse(q.optionsJson); } catch { return null; }
              const qNum = index + i + 1;

              return (
                <Box key={q.questionId} sx={{
                  borderRadius: "14px", p: "20px 22px", mb: 2.5,
                  background: `linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                  border: `1px solid rgba(34,211,238,0.12)`,
                  boxShadow: `0 4px 24px rgba(0,0,0,0.35)`,
                  position: "relative", overflow: "hidden",
                  "&::before": { content: '""', position: "absolute",
                    top: 0, left: 0, bottom: 0, width: "3px",
                    background: `linear-gradient(180deg, ${primary}, ${secondary})` },
                }}>
                  {/* Question */}
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                    <Box sx={{ flexShrink: 0, width: 28, height: 28, borderRadius: "7px",
                      background: `${primary}18`, border: `1px solid ${primary}35`,
                      display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.6rem", color: primary, fontWeight: 700 }}>
                        {String(qNum).padStart(2, "0")}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                      fontWeight: 600, fontSize: "0.95rem", color: textPri,
                      lineHeight: 1.5, flex: 1 }}>
                      {q.questionText}
                    </Typography>
                  </Box>

                  {/* Options */}
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.9, ml: "43px" }}>
                    {Object.values(options).map((opt, idx) => {
                      const isSelected = answers[q.questionId] === opt;
                      return (
                        <motion.div key={idx}
                          whileHover={{ x: 3 }} whileTap={{ scale: 0.98 }}>
                          <Box onClick={() => handleChange(q.questionId, opt)} sx={{
                            display: "flex", alignItems: "center", gap: 1.2,
                            px: "14px", py: "10px", borderRadius: "9px",
                            cursor: "pointer", transition: "all 0.22s",
                            background: isSelected ? `${primary}18` : "rgba(34,211,238,0.03)",
                            border: `1px solid ${isSelected ? primary + "50" : "rgba(34,211,238,0.1)"}`,
                            boxShadow: isSelected ? `0 0 14px ${primary}20` : "none",
                          }}>
                            {/* Radio circle */}
                            <Box sx={{ width: 18, height: 18, borderRadius: "50%",
                              border: `2px solid ${isSelected ? primary : "rgba(34,211,238,0.3)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              flexShrink: 0, transition: "all 0.22s",
                              boxShadow: isSelected ? `0 0 8px ${primary}60` : "none" }}>
                              {isSelected && (
                                <Box sx={{ width: 8, height: 8, borderRadius: "50%",
                                  background: primary, boxShadow: `0 0 6px ${primary}` }} />
                              )}
                            </Box>
                            <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                              fontSize: "0.88rem",
                              color: isSelected ? primary : textSec,
                              fontWeight: isSelected ? 600 : 400,
                              transition: "color 0.22s" }}>
                              {opt}
                            </Typography>
                          </Box>
                        </motion.div>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── NAV BUTTONS ── */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1, gap: 2 }}>
          <motion.div whileHover={{ scale: index > 0 ? 1.03 : 1 }}
            whileTap={{ scale: index > 0 ? 0.97 : 1 }}>
            <Box onClick={() => index > 0 && setIndex(index - 3)} sx={{
              display: "flex", alignItems: "center", gap: 0.8,
              px: 2.5, py: 1, borderRadius: "10px",
              cursor: index > 0 ? "pointer" : "default",
              border: `1px solid ${index > 0 ? "rgba(34,211,238,0.22)" : "rgba(34,211,238,0.08)"}`,
              background: index > 0 ? "rgba(34,211,238,0.05)" : "transparent",
              opacity: index > 0 ? 1 : 0.35, transition: "all 0.22s",
              "&:hover": index > 0 ? { background: "rgba(34,211,238,0.1)" } : {},
            }}>
              <ArrowBackIcon sx={{ color: primary, fontSize: "1rem" }} />
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                fontSize: "0.85rem", color: textSec }}>Previous</Typography>
            </Box>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {isLastPage ? (
              <Box onClick={submitTest} sx={{
                display: "flex", alignItems: "center", gap: 1,
                px: 2.5, py: 1, borderRadius: "10px", cursor: "pointer",
                background: `linear-gradient(135deg, #065f46, ${success}cc)`,
                border: `1px solid ${success}50`,
                boxShadow: `0 4px 18px ${success}30`,
                transition: "all 0.25s",
                "&:hover": { boxShadow: `0 8px 28px ${success}50` },
              }}>
                <SendIcon sx={{ color: "#fff", fontSize: "1rem" }} />
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 800, fontSize: "0.85rem", color: "#fff",
                  letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Submit Test
                </Typography>
              </Box>
            ) : (
              <Box onClick={() => setIndex(index + 3)} sx={{
                display: "flex", alignItems: "center", gap: 1,
                px: 2.5, py: 1, borderRadius: "10px", cursor: "pointer",
                background: `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`,
                boxShadow: `0 4px 18px ${primary}40`,
                transition: "all 0.25s",
                "&:hover": { boxShadow: `0 8px 28px ${primary}60` },
              }}>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 800, fontSize: "0.85rem", color: "#030712",
                  letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Next
                </Typography>
                <ArrowForwardIcon sx={{ color: "#030712", fontSize: "1rem" }} />
              </Box>
            )}
          </motion.div>
        </Box>

        <Box sx={{ height: 40 }} />
      </Box>
    </Box>
  );
}
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import api from "../api/axios";
// import {
//   Box,
//   Typography,
//   Card,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Button,
//   Stack,
//   LinearProgress
// } from "@mui/material";

// export default function TakeTest() {
//   const { sessionId } = useParams();
//   const navigate = useNavigate();

//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [index, setIndex] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(30 * 60);

//   // 🔹 Load questions
//   useEffect(() => {
//     api.get(`/Users/user/session/${sessionId}`)
//       .then(res => {
//         // ✅ KEEP ONLY MCQs WITH OPTIONS
//         const mcqs = res.data.filter(q => q.optionsJson);
//         setQuestions(mcqs);
//       })
//       .catch(() => setQuestions([]));
//   }, [sessionId]);

//   // 🔹 Timer
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       submitTest();
//       return;
//     }
//     const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
//     return () => clearInterval(t);
//   }, [timeLeft]);

//   if (questions.length === 0) {
//     return (
//       <Box p={4}>
//         <Typography color="error" variant="h6">
//           ❌ No MCQ questions assigned to this test.
//         </Typography>
//       </Box>
//     );
//   }

//   const handleChange = (qid, value) => {
//     setAnswers(prev => ({ ...prev, [qid]: value }));
//   };

//   const submitTest = async () => {
//     const payload = {
//       answers: Object.keys(answers).map(qid => ({
//         questionId: parseInt(qid),
//         answer: answers[qid]
//       }))
//     };

//     await api.post(`/Users/user/submit/${sessionId}`, payload);
//     navigate(`/user/result/${sessionId}`);
//   };

//   const visible = questions.slice(index, index + 3);

//   const formatTime = () => {
//     const m = Math.floor(timeLeft / 60);
//     const s = timeLeft % 60;
//     return `${m}:${s < 10 ? "0" : ""}${s}`;
//   };

//   return (
//     <Box sx={{ p: 4, bgcolor: "#F4F8FC", minHeight: "100vh" }}>
//       <Stack direction="row" justifyContent="space-between" mb={3}>
//         <Typography variant="h4">📝 Skill Test</Typography>
//         <Typography color="error">⏱ {formatTime()}</Typography>
//       </Stack>

//       <LinearProgress
//         variant="determinate"
//         value={(index / questions.length) * 100}
//         sx={{ mb: 3 }}
//       />

//       {visible.map((q, i) => {
//         let options = {};

//         try {
//           options = JSON.parse(q.optionsJson);
//         } catch {
//           return null; // skip broken MCQ
//         }

//         return (
//           <Card key={q.questionId} sx={{ p: 3, mb: 2 }}>
//             <Typography fontWeight={600}>
//               Q{index + i + 1}. {q.questionText}
//             </Typography>

//             <RadioGroup
//               value={answers[q.questionId] || ""}
//               onChange={e => handleChange(q.questionId, e.target.value)}
//             >
//               {Object.values(options).map((opt, idx) => (
//                 <FormControlLabel
//                   key={idx}
//                   value={opt}
//                   control={<Radio />}
//                   label={opt}
//                 />
//               ))}
//             </RadioGroup>
//           </Card>
//         );
//       })}

//       <Stack direction="row" justifyContent="space-between" mt={3}>
//         <Button disabled={index === 0} onClick={() => setIndex(index - 3)}>
//           Previous
//         </Button>

//         {index + 3 >= questions.length ? (
//           <Button color="success" variant="contained" onClick={submitTest}>
//             Submit Test
//           </Button>
//         ) : (
//           <Button variant="contained" onClick={() => setIndex(index + 3)}>
//             Next
//           </Button>
//         )}
//       </Stack>
//     </Box>
//   );
// }
