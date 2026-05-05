import { useEffect, useState } from "react";
import {
  Box, Typography, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert, TextField
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getSavedQuestionsByUser, deleteSavedMcq } from "../../api/questionApi";
import DashboardIcon    from "@mui/icons-material/Dashboard";
import BookmarkIcon     from "@mui/icons-material/Bookmark";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon       from "@mui/icons-material/Search";
import ArrowBackIcon    from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon  from "@mui/icons-material/CheckCircle";
import HubIcon          from "@mui/icons-material/Hub";

const PAGE_SIZE = 5;

export default function SavedQuestions() {
  const [questions,          setQuestions]          = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [page,               setPage]               = useState(1);
  const [search,             setSearch]             = useState("");
  const [openDialog,         setOpenDialog]         = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [snackbar,           setSnackbar]           = useState({ open: false, message: "", severity: "success" });

  const theme    = useTheme();
  const navigate = useNavigate();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const success   = theme.palette.success.main;
  const error     = theme.palette.error.main;

  useEffect(() => {
    async function load() {
      try {
        const res = await getSavedQuestionsByUser();
        setQuestions(res.data);
      } catch {
        setSnackbar({ open: true, message: "Failed to load saved MCQs", severity: "error" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const confirmDelete = (id) => { setSelectedQuestionId(id); setOpenDialog(true); };

  const handleDelete = async () => {
    try {
      await deleteSavedMcq(selectedQuestionId);
      setQuestions(prev => prev.filter(q => q.questionId !== selectedQuestionId));
      setSnackbar({ open: true, message: "MCQ removed successfully", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to remove MCQ", severity: "error" });
    } finally {
      setOpenDialog(false); setSelectedQuestionId(null);
    }
  };

  const filtered    = questions.filter(q => q.questionText.toLowerCase().includes(search.toLowerCase()));
  const startIndex  = (page - 1) * PAGE_SIZE;
  const paginated   = filtered.slice(startIndex, startIndex + PAGE_SIZE);
  const totalPages  = Math.ceil(filtered.length / PAGE_SIZE);

  if (loading) return (
    <Box sx={{ minHeight: "100vh", background: bg, display: "flex",
      alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ textAlign: "center" }}>
        <CircularProgress sx={{ color: primary, mb: 2 }} />
        <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
          fontSize: "0.65rem", color: primary, letterSpacing: "0.2em" }}>
          LOADING_DATA...
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", background: bg,
      p: { xs: 2, md: "36px 32px" }, position: "relative", overflow: "hidden" }}>

      {/* Ambient glows */}
      <Box sx={{ position: "fixed", top: "-8%", left: "40%",
        width: 480, height: 480, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter: "blur(65px)", zIndex: 0 }} />
      <Box sx={{ position: "fixed", bottom: "5%", right: "2%",
        width: 340, height: 340, borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter: "blur(55px)", zIndex: 0 }} />

      <Box sx={{ maxWidth: 860, mx: "auto", position: "relative", zIndex: 2 }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", mb: 4, flexWrap: "wrap", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.6 }}>
                <HubIcon sx={{ color: primary, fontSize: "0.85rem" }} />
                <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.56rem", color: primary, letterSpacing: "0.2em", opacity: 0.8 }}>
                  VAULT // SAVED_QUESTIONS
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily: "'Exo 2', sans-serif", fontWeight: 900,
                fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.1,
                background: `linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                Saved MCQs
              </Typography>
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                color: textSec, fontSize: "0.85rem", mt: 0.4 }}>
                {filtered.length} question{filtered.length !== 1 ? "s" : ""} in your vault
              </Typography>
            </Box>

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

        {/* ── SEARCH ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}>
          <Box sx={{ position: "relative", mb: 3 }}>
            <SearchIcon sx={{ position: "absolute", left: 14, top: "50%",
              transform: "translateY(-50%)", color: primary, fontSize: "1.1rem", opacity: 0.7 }} />
            <TextField fullWidth placeholder="Search saved MCQs..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              sx={{
                "& .MuiInputBase-root": {
                  fontFamily: "'Exo 2', sans-serif", fontSize: "0.9rem", color: textPri,
                  background: paper,
                  border: `1px solid rgba(34,211,238,0.18)`,
                  borderRadius: "11px", pl: "44px", transition: "all 0.25s",
                  "&:hover": { border: `1px solid ${primary}45`, boxShadow: `0 0 12px ${primary}12` },
                  "&.Mui-focused": { border: `1px solid ${primary}65`, boxShadow: `0 0 0 3px ${primary}12` },
                },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "& .MuiInputBase-input::placeholder": { color: textSec, opacity: 0.5 },
              }} />
          </Box>
        </motion.div>

        {/* ── EMPTY STATE ── */}
        {paginated.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Box sx={{ textAlign: "center", py: 8,
              border: `1px dashed rgba(34,211,238,0.18)`,
              borderRadius: "14px",
              background: "rgba(34,211,238,0.02)" }}>
              <BookmarkIcon sx={{ color: primary, fontSize: "2.5rem", opacity: 0.4, mb: 1 }} />
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                color: textSec, fontSize: "0.92rem" }}>
                No saved MCQs found.
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* ── QUESTION CARDS ── */}
        <AnimatePresence mode="wait">
          <motion.div key={page + search}
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.32 }}>
            {paginated.map((q, i) => (
              <Box key={q.questionId} sx={{
                borderRadius: "14px", p: "20px 22px", mb: 2,
                background: `linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                border: `1px solid rgba(34,211,238,0.12)`,
                boxShadow: `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(34,211,238,0.05)`,
                position: "relative", overflow: "hidden",
                transition: "border-color 0.25s, box-shadow 0.25s",
                "&:hover": { borderColor: `rgba(34,211,238,0.25)`,
                  boxShadow: `0 8px 28px rgba(34,211,238,0.08)` },
                "&::before": { content: '""', position: "absolute",
                  top: 0, left: 0, bottom: 0, width: "3px",
                  background: `linear-gradient(180deg, ${primary}, ${secondary})`,
                  boxShadow: `0 0 10px ${primary}60` },
              }}>
                {/* Question */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.8 }}>
                  <Box sx={{ flexShrink: 0, width: 28, height: 28, borderRadius: "7px",
                    background: `${primary}18`, border: `1px solid ${primary}35`,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                      fontSize: "0.6rem", color: primary, fontWeight: 700 }}>
                      {String(startIndex + i + 1).padStart(2, "0")}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                    fontWeight: 600, fontSize: "0.95rem", color: textPri,
                    lineHeight: 1.5, flex: 1 }}>
                    {q.questionText}
                  </Typography>
                </Box>

                {/* Options */}
                {q.options && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.7, ml: "43px", mb: 1.5 }}>
                    {Object.entries(q.options).map(([key, value]) => (
                      <Box key={key} sx={{
                        display: "flex", alignItems: "center", gap: 1,
                        px: "12px", py: "7px", borderRadius: "8px",
                        background: "rgba(34,211,238,0.03)",
                        border: "1px solid rgba(34,211,238,0.08)",
                      }}>
                        <Box sx={{ width: 20, height: 20, borderRadius: "5px", flexShrink: 0,
                          background: `${primary}10`, border: `1px solid ${primary}25`,
                          display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "0.6rem", color: primary, fontWeight: 700 }}>
                            {key.toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                          fontSize: "0.86rem", color: textSec }}>{value}</Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Correct answer */}
                <Box sx={{ ml: "43px", display: "flex", alignItems: "center",
                  gap: 1, mb: 1.8 }}>
                  <CheckCircleIcon sx={{ color: success, fontSize: "0.9rem" }} />
                  <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                    fontSize: "0.65rem", color: success, letterSpacing: "0.08em" }}>
                    CORRECT: {q.correctAnswer ? q.correctAnswer.toUpperCase() : "N/A"}
                  </Typography>
                </Box>

                {/* Remove button */}
                <Box sx={{ ml: "43px" }}>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
                    style={{ display: "inline-block" }}>
                    <Box onClick={() => confirmDelete(q.questionId)} sx={{
                      display: "inline-flex", alignItems: "center", gap: 0.7,
                      px: 1.8, py: "6px", borderRadius: "8px", cursor: "pointer",
                      background: "rgba(248,113,113,0.08)",
                      border: "1px solid rgba(248,113,113,0.25)",
                      transition: "all 0.22s",
                      "&:hover": { background: "rgba(248,113,113,0.16)",
                        border: "1px solid rgba(248,113,113,0.5)" },
                    }}>
                      <DeleteOutlineIcon sx={{ color: error, fontSize: "0.9rem" }} />
                      <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                        fontSize: "0.78rem", color: error, fontWeight: 600 }}>
                        Remove
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </Box>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", alignItems: "center",
            justifyContent: "space-between", mt: 2, mb: 3 }}>
            <Box onClick={() => page > 1 && setPage(p => p - 1)} sx={{
              display: "flex", alignItems: "center", gap: 0.8,
              px: 2, py: 0.9, borderRadius: "9px", cursor: page > 1 ? "pointer" : "default",
              border: `1px solid ${page > 1 ? "rgba(34,211,238,0.22)" : "rgba(34,211,238,0.08)"}`,
              background: page > 1 ? "rgba(34,211,238,0.05)" : "transparent",
              opacity: page > 1 ? 1 : 0.35, transition: "all 0.22s",
              "&:hover": page > 1 ? { background: "rgba(34,211,238,0.1)" } : {},
            }}>
              <ArrowBackIcon sx={{ color: primary, fontSize: "0.9rem" }} />
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                fontSize: "0.82rem", color: textSec }}>Prev</Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 0.8, alignItems: "center" }}>
              {Array.from({ length: totalPages }, (_, i) => (
                <motion.div key={i}
                  animate={{ width: i + 1 === page ? 22 : 7, opacity: i + 1 === page ? 1 : 0.28 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setPage(i + 1)}
                  style={{ height: 7, borderRadius: 99, cursor: "pointer",
                    background: i + 1 === page
                      ? `linear-gradient(90deg, ${primary}, ${secondary})`
                      : "#475569",
                    boxShadow: i + 1 === page ? `0 0 8px ${primary}70` : "none" }}
                />
              ))}
            </Box>

            <Box onClick={() => page < totalPages && setPage(p => p + 1)} sx={{
              display: "flex", alignItems: "center", gap: 0.8,
              px: 2, py: 0.9, borderRadius: "9px",
              cursor: page < totalPages ? "pointer" : "default",
              border: `1px solid ${page < totalPages ? "rgba(34,211,238,0.22)" : "rgba(34,211,238,0.08)"}`,
              background: page < totalPages ? "rgba(34,211,238,0.05)" : "transparent",
              opacity: page < totalPages ? 1 : 0.35, transition: "all 0.22s",
              "&:hover": page < totalPages ? { background: "rgba(34,211,238,0.1)" } : {},
            }}>
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                fontSize: "0.82rem", color: textSec }}>Next</Typography>
              <ArrowForwardIcon sx={{ color: primary, fontSize: "0.9rem" }} />
            </Box>
          </Box>
        )}
      </Box>

      {/* ── DELETE DIALOG ── */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}
        PaperProps={{ sx: {
          background: "#0d1f3c", border: `1px solid rgba(34,211,238,0.2)`,
          borderRadius: "14px", boxShadow: `0 20px 60px rgba(0,0,0,0.6)`,
        }}}>
        <DialogTitle sx={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700,
          color: textPri, fontSize: "1rem", borderBottom: `1px solid rgba(34,211,238,0.1)`,
          pb: 1.5 }}>
          Confirm Remove
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
            color: textSec, fontSize: "0.88rem", mt: 1 }}>
            Are you sure you want to remove this MCQ from your vault?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Box onClick={() => setOpenDialog(false)} sx={{
            px: 2, py: 0.8, borderRadius: "8px", cursor: "pointer",
            border: `1px solid rgba(34,211,238,0.2)`,
            "&:hover": { background: "rgba(34,211,238,0.08)" },
          }}>
            <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
              fontSize: "0.82rem", color: textSec }}>Cancel</Typography>
          </Box>
          <Box onClick={handleDelete} sx={{
            px: 2, py: 0.8, borderRadius: "8px", cursor: "pointer",
            background: "rgba(248,113,113,0.12)",
            border: "1px solid rgba(248,113,113,0.35)",
            "&:hover": { background: "rgba(248,113,113,0.22)" },
          }}>
            <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
              fontSize: "0.82rem", color: error, fontWeight: 600 }}>Remove</Typography>
          </Box>
        </DialogActions>
      </Dialog>

      {/* ── SNACKBAR ── */}
      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}
          onClose={() => setSnackbar(s => ({ ...s, open: false }))}
          sx={{ fontFamily: "'Exo 2', sans-serif",
            background: snackbar.severity === "success" ? "#065f46" : "#7f1d1d",
            color: "#fff", border: `1px solid ${snackbar.severity === "success" ? success : error}40` }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   CircularProgress,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Snackbar,
//   Alert,
//   TextField
// } from "@mui/material";

// import {
//   getSavedQuestionsByUser,
//   deleteSavedMcq
// } from "../../api/questionApi";

// const PAGE_SIZE = 5;

// export default function SavedQuestions() {
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [page, setPage] = useState(1);
//   const [search, setSearch] = useState("");

//   const [openDialog, setOpenDialog] = useState(false);
//   const [selectedQuestionId, setSelectedQuestionId] = useState(null);

//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   });

//   // 🔹 Load saved MCQs (JWT-based)
//   useEffect(() => {
//     async function loadSavedQuestions() {
//       try {
//         const res = await getSavedQuestionsByUser(); // ✅ NO userId
//         setQuestions(res.data);
//       } catch (err) {
//         console.error(err);
//         setSnackbar({
//           open: true,
//           message: "Failed to load saved MCQs",
//           severity: "error"
//         });
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadSavedQuestions();
//   }, []);

//   // 🔹 Confirm delete
//   const confirmDelete = (questionId) => {
//     setSelectedQuestionId(questionId);
//     setOpenDialog(true);
//   };

//   // 🔹 Delete MCQ
//   const handleDelete = async () => {
//     try {
//       await deleteSavedMcq(selectedQuestionId);

//       setQuestions(prev =>
//         prev.filter(q => q.questionId !== selectedQuestionId)
//       );

//       setSnackbar({
//         open: true,
//         message: "MCQ removed successfully",
//         severity: "success"
//       });
//     } catch {
//       setSnackbar({
//         open: true,
//         message: "Failed to remove MCQ",
//         severity: "error"
//       });
//     } finally {
//       setOpenDialog(false);
//       setSelectedQuestionId(null);
//     }
//   };

//   // 🔹 Search filter
//   const filteredQuestions = questions.filter(q =>
//     q.questionText.toLowerCase().includes(search.toLowerCase())
//   );

//   // 🔹 Pagination
//   const startIndex = (page - 1) * PAGE_SIZE;
//   const paginatedQuestions = filteredQuestions.slice(
//     startIndex,
//     startIndex + PAGE_SIZE
//   );

//   const totalPages = Math.ceil(filteredQuestions.length / PAGE_SIZE);

//   if (loading) {
//     return (
//       <Box p={4} textAlign="center">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box p={4} maxWidth="900px" mx="auto">
//       <Typography variant="h5" mb={2}>
//         Saved AI MCQs
//       </Typography>

//       {/* 🔍 Search */}
//       <TextField
//         fullWidth
//         placeholder="Search saved MCQs..."
//         value={search}
//         onChange={(e) => {
//           setSearch(e.target.value);
//           setPage(1);
//         }}
//         sx={{ mb: 3 }}
//       />

//       {paginatedQuestions.length === 0 && (
//         <Typography color="text.secondary">
//           No saved MCQs found.
//         </Typography>
//       )}

//       {paginatedQuestions.map((q, index) => (
//         <Paper
//   key={q.questionId}
//   sx={{
//     p: 3,
//     mb: 2,
//     borderRadius: 3,
//     backgroundColor: "#FAF7F2",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
//   }}
// >
//   <Typography fontWeight={600} mb={1}>
//     Q{startIndex + index + 1}. {q.questionText}
//   </Typography>

//   {q.options && Object.entries(q.options).map(([key, value]) => (
//     <Typography key={key}>
//       {key.toUpperCase()}. {value}
//     </Typography>
//   ))}

//   <Typography color="green" mt={1}>
//     Correct Answer: {q.correctAnswer ? q.correctAnswer.toUpperCase() : "N/A"}
//   </Typography>

//   <Button
//     variant="outlined"
//     color="error"
//     size="small"
//     sx={{ mt: 2 }}
//     onClick={() => confirmDelete(q.questionId)}
//   >
//     Remove
//   </Button>
// </Paper>
//       ))}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <Box display="flex" justifyContent="space-between" mt={3}>
//           <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
//             Previous
//           </Button>

//           <Typography>
//             Page {page} of {totalPages}
//           </Typography>

//           <Button
//             disabled={page === totalPages}
//             onClick={() => setPage(p => p + 1)}
//           >
//             Next
//           </Button>
//         </Box>
//       )}

//       {/* Delete dialog */}
//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           Are you sure you want to remove this MCQ?
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
//           <Button color="error" onClick={handleDelete}>
//             Remove
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Snackbar */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={3000}
//         onClose={() => setSnackbar({ ...snackbar, open: false })}
//       >
//         <Alert
//           severity={snackbar.severity}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }