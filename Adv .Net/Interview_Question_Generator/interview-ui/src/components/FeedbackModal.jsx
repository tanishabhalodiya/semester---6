import { useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";   // uses your existing axios instance — no separate feedbackApi needed
import CloseIcon       from "@mui/icons-material/Close";
import StarIcon        from "@mui/icons-material/Star";
import StarBorderIcon  from "@mui/icons-material/StarBorder";
import SendIcon        from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SkipNextIcon    from "@mui/icons-material/SkipNext";

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const theme   = useTheme();
  const warning = theme.palette.warning.main;

  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

  return (
    <Box sx={{ textAlign:"center" }}>
      <Box sx={{ display:"flex", justifyContent:"center", gap:0.5, mb:0.8 }}>
        {[1,2,3,4,5].map(star => (
          <motion.div key={star}
            whileHover={{ scale:1.25 }} whileTap={{ scale:0.9 }}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            style={{ cursor:"pointer" }}>
            {star <= (hovered || value)
              ? <StarIcon sx={{ fontSize:"2.2rem", color:warning,
                  filter:`drop-shadow(0 0 6px ${warning}80)`,
                  transition:"all 0.15s" }} />
              : <StarBorderIcon sx={{ fontSize:"2.2rem",
                  color:"rgba(34,211,238,0.3)", transition:"all 0.15s" }} />}
          </motion.div>
        ))}
      </Box>
      <AnimatePresence mode="wait">
        {(hovered || value) > 0 && (
          <motion.div key={hovered || value}
            initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:4 }} transition={{ duration:0.18 }}>
            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
              fontSize:"0.65rem", color:warning, letterSpacing:"0.14em" }}>
              {labels[hovered || value].toUpperCase()}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

// ── FeedbackModal ─────────────────────────────────────────────────────────────
// Props:
//   open        — boolean
//   onClose     — function
//   userId      — int  (logged-in user's id)
//   questionId  — int  (session id or question id being rated)
//   title       — optional string
export default function FeedbackModal({ open, onClose, userId, questionId, title }) {
  const [rating,     setRating]     = useState(0);
  const [comment,    setComment]    = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [errMsg,     setErrMsg]     = useState("");

  const theme     = useTheme();
  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;
  const errorC    = theme.palette.error.main;

  const resetState = () => {
    setRating(0); setComment("");
    setSubmitted(false); setErrMsg("");
  };

  const handleSkip = () => { onClose(); resetState(); };

  const handleSubmit = async () => {
    if (rating === 0) { setErrMsg("Please select a star rating."); return; }
    try {
      setSubmitting(true); setErrMsg("");

      // ── Matches your FeedbackDto exactly ─────────────────────────────────
      // FeedbackDto: UserId, QuestionId, Rating, Comment
      // POST /api/Feedback — Authorize(Roles="User")
      await api.post("/Feedback", {
        userId,          // int
        questionId,      // int  (session id passed as questionId)
        rating,          // int 1–5
        comment,         // string (optional)
      });

      setSubmitted(true);
      setTimeout(() => { onClose(); resetState(); }, 2000);
    } catch (err) {
      setErrMsg(
        err.response?.data?.message ||
        err.response?.status === 401 ? "Login required to submit feedback." :
        "Failed to submit. Please try again."
      );
    } finally { setSubmitting(false); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.25 }}
            onClick={handleSkip}
            style={{
              position:"fixed", inset:0, zIndex:1200,
              background:"rgba(3,7,18,0.78)", backdropFilter:"blur(6px)",
            }} />

          {/* Modal */}
          <motion.div
            initial={{ opacity:0, scale:0.88, y:24 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:0.88, y:24 }}
            transition={{ type:"spring", stiffness:280, damping:22 }}
            style={{
              position:"fixed", inset:0, zIndex:1300,
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"16px", pointerEvents:"none",
            }}>
            <Box sx={{
              pointerEvents:"auto",
              width:"100%", maxWidth:480,
              borderRadius:"20px", p:"32px 28px",
              background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
              border:`1px solid rgba(34,211,238,0.18)`,
              boxShadow:`0 24px 60px rgba(0,0,0,0.7),
                0 0 0 1px rgba(34,211,238,0.08),
                inset 0 1px 0 rgba(34,211,238,0.1)`,
              position:"relative", overflow:"hidden",
              "&::before":{ content:'""', position:"absolute",
                top:0, left:"10%", right:"10%", height:"1.5px",
                background:`linear-gradient(90deg, transparent, ${primary}80, ${secondary}60, transparent)` },
            }}>

              {/* X close */}
              <Box onClick={handleSkip} sx={{
                position:"absolute", top:14, right:14,
                width:30, height:30, borderRadius:"8px", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                background:"rgba(34,211,238,0.06)", border:"1px solid rgba(34,211,238,0.15)",
                transition:"all 0.2s",
                "&:hover":{ background:"rgba(34,211,238,0.14)",
                  border:"1px solid rgba(34,211,238,0.35)" },
              }}>
                <CloseIcon sx={{ color:textSec, fontSize:"0.9rem" }} />
              </Box>

              {/* ── Submitted state ── */}
              {submitted ? (
                <motion.div initial={{ opacity:0, scale:0.85 }}
                  animate={{ opacity:1, scale:1 }}
                  transition={{ type:"spring", stiffness:300 }}
                  style={{ textAlign:"center", padding:"16px 0" }}>
                  <Box sx={{ width:60, height:60, borderRadius:"50%", mx:"auto", mb:2,
                    background:`${successC}18`, border:`2px solid ${successC}50`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:`0 0 24px ${successC}40` }}>
                    <CheckCircleIcon sx={{ color:successC, fontSize:"1.8rem" }} />
                  </Box>
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif", fontWeight:800,
                    fontSize:"1.15rem", color:textPri, mb:0.5 }}>
                    Thank you! 🎉
                  </Typography>
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontSize:"0.88rem", color:textSec }}>
                    Your feedback has been saved.
                  </Typography>
                </motion.div>
              ) : (
                <>
                  {/* Header */}
                  <Box sx={{ mb:3, textAlign:"center" }}>
                    <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:"0.52rem", color:primary, letterSpacing:"0.2em",
                      opacity:0.8, mb:0.5 }}>
                      // FEEDBACK
                    </Typography>
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif", fontWeight:800,
                      fontSize:"1.25rem", color:textPri, mb:0.4 }}>
                      {title || "How was your experience?"}
                    </Typography>
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontSize:"0.85rem", color:textSec }}>
                      Your feedback is optional — skip anytime
                    </Typography>
                  </Box>

                  {/* Star Rating */}
                  <Box sx={{ mb:3 }}>
                    <StarRating value={rating} onChange={setRating} />
                  </Box>

                  {/* Comment textarea */}
                  <Box sx={{ mb:2.5 }}>
                    <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:"0.52rem", color:textSec, letterSpacing:"0.14em",
                      textTransform:"uppercase", mb:0.8 }}>
                      Comment (Optional)
                    </Typography>
                    <Box component="textarea" value={comment}
                      onChange={e => setComment(e.target.value)}
                      rows={3} maxLength={500}
                      placeholder="Share your thoughts about this question or session..."
                      sx={{
                        width:"100%", p:"12px 14px",
                        borderRadius:"10px", border:`1px solid rgba(34,211,238,0.18)`,
                        background:bg, color:textPri, fontSize:"0.9rem",
                        fontFamily:"'Exo 2', sans-serif", outline:"none",
                        resize:"vertical", display:"block", lineHeight:1.6,
                        transition:"all 0.25s",
                        "&:focus":{ border:`1px solid ${primary}70`,
                          boxShadow:`0 0 0 3px ${primary}15` },
                        "&::placeholder":{ color:textSec, opacity:0.45 },
                      }} />
                    <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                      fontSize:"0.5rem", color:textSec, opacity:0.5,
                      textAlign:"right", mt:0.5, letterSpacing:"0.08em" }}>
                      {comment.length}/500
                    </Typography>
                  </Box>

                  {/* Error */}
                  <AnimatePresence>
                    {errMsg && (
                      <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
                        exit={{ opacity:0 }} transition={{ duration:0.2 }}>
                        <Box sx={{ mb:2, px:2, py:"9px", borderRadius:"8px",
                          background:"rgba(248,113,113,0.08)",
                          border:"1px solid rgba(248,113,113,0.3)" }}>
                          <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                            fontSize:"0.82rem", color:errorC }}>{errMsg}</Typography>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action buttons */}
                  <Box sx={{ display:"flex", gap:1.5 }}>
                    {/* Skip */}
                    <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                      style={{ flex:1 }}>
                      <Box onClick={handleSkip} sx={{
                        display:"flex", alignItems:"center", justifyContent:"center", gap:0.8,
                        py:"12px", borderRadius:"11px", cursor:"pointer",
                        background:"rgba(34,211,238,0.05)",
                        border:"1px solid rgba(34,211,238,0.18)",
                        transition:"all 0.22s",
                        "&:hover":{ background:"rgba(34,211,238,0.1)",
                          border:`1px solid ${primary}40` },
                      }}>
                        <SkipNextIcon sx={{ color:textSec, fontSize:"1rem" }} />
                        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                          fontWeight:600, fontSize:"0.88rem", color:textSec }}>
                          Skip
                        </Typography>
                      </Box>
                    </motion.div>

                    {/* Submit */}
                    <motion.div whileHover={{ scale: rating > 0 ? 1.03 : 1 }}
                      whileTap={{ scale: rating > 0 ? 0.97 : 1 }}
                      style={{ flex:2 }}>
                      <Box onClick={handleSubmit} sx={{
                        display:"flex", alignItems:"center", justifyContent:"center", gap:0.8,
                        py:"12px", borderRadius:"11px",
                        cursor: rating > 0 && !submitting ? "pointer" : "default",
                        background: rating > 0
                          ? `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`
                          : "rgba(34,211,238,0.07)",
                        border:`1px solid ${rating > 0 ? primary + "55" : "rgba(34,211,238,0.12)"}`,
                        boxShadow: rating > 0 ? `0 4px 18px ${primary}40` : "none",
                        opacity: rating > 0 ? 1 : 0.45,
                        transition:"all 0.28s",
                        "&:hover": rating > 0 && !submitting
                          ? { boxShadow:`0 8px 28px ${primary}60` } : {},
                      }}>
                        {submitting
                          ? <CircularProgress size={16} sx={{ color:"#030712" }} />
                          : <SendIcon sx={{ color: rating > 0 ? "#030712" : textSec,
                              fontSize:"0.95rem" }} />}
                        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                          fontWeight:800, fontSize:"0.88rem", letterSpacing:"0.06em",
                          textTransform:"uppercase",
                          color: rating > 0 ? "#030712" : textSec }}>
                          {submitting ? "Submitting..." : "Submit Feedback"}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                </>
              )}
            </Box>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}