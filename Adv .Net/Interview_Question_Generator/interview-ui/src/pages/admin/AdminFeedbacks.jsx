import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar      from "../../components/AdminSidebar";
import HubIcon           from "@mui/icons-material/Hub";
import StarIcon          from "@mui/icons-material/Star";
import StarBorderIcon    from "@mui/icons-material/StarBorder";
import PersonIcon        from "@mui/icons-material/Person";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FilterListIcon    from "@mui/icons-material/FilterList";
import SearchIcon        from "@mui/icons-material/Search";
import ChatBubbleIcon    from "@mui/icons-material/ChatBubble";
import TrendingUpIcon    from "@mui/icons-material/TrendingUp";
import QuizIcon          from "@mui/icons-material/Quiz";

// ── Star display component ────────────────────────────────────────────────────
function StarDisplay({ rating }) {
  const theme   = useTheme();
  const warning = theme.palette.warning.main;
  return (
    <Box sx={{ display:"flex", alignItems:"center", gap:"2px" }}>
      {[1,2,3,4,5].map(s => (
        s <= rating
          ? <StarIcon key={s} sx={{ fontSize:"1rem", color:warning,
              filter:`drop-shadow(0 0 4px ${warning}80)` }} />
          : <StarBorderIcon key={s} sx={{ fontSize:"1rem",
              color:"rgba(34,211,238,0.2)" }} />
      ))}
    </Box>
  );
}

export default function AdminFeedbacks() {
  const [feedbacks,    setFeedbacks]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [search,       setSearch]       = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [deleting,     setDeleting]     = useState(null);

  const theme     = useTheme();
  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;
  const warningC  = theme.palette.warning.main;
  const errorC    = theme.palette.error.main;

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      // GET /api/Feedback  — requires Admin role JWT token
      const res = await api.get("/Feedback");
      setFeedbacks(res.data);
    } catch (err) {
      setError(
        err.response?.status === 401 ? "Unauthorized — make sure you are logged in as Admin." :
        err.response?.status === 403 ? "Forbidden — Admin role required." :
        "Failed to load feedbacks."
      );
    } finally { setLoading(false); }
  };

  // DELETE /api/Feedback/{id}  — requires Admin role (fix backend [Authorize(Roles="Admin")])
  const handleDelete = async (feedbackId) => {
    if (!window.confirm("Delete this feedback?")) return;
    setDeleting(feedbackId);
    try {
      await api.delete(`/Feedback/${feedbackId}`);
      setFeedbacks(prev => prev.filter(f => f.feedbackId !== feedbackId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete feedback.");
    } finally { setDeleting(null); }
  };

  // ── Filter logic ───────────────────────────────────────────────────────────
  const filtered = feedbacks.filter(f => {
    const matchRating = ratingFilter === 0 || f.rating === ratingFilter;
    const matchSearch = !search.trim() ||
      String(f.userId).includes(search.trim()) ||
      String(f.questionId).includes(search.trim()) ||
      (f.comment || "").toLowerCase().includes(search.toLowerCase());
    return matchRating && matchSearch;
  });

  // ── Stats ──────────────────────────────────────────────────────────────────
  const total       = feedbacks.length;
  const avgRating   = total > 0
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / total).toFixed(1)
    : "—";
  const withComment = feedbacks.filter(f => f.comment?.trim()).length;
  const fiveStar    = feedbacks.filter(f => f.rating === 5).length;

  // Rating distribution [5 → 1]
  const ratingDist = [5,4,3,2,1].map(r => ({
    star:  r,
    count: feedbacks.filter(f => f.rating === r).length,
    pct:   total > 0
      ? Math.round((feedbacks.filter(f => f.rating === r).length / total) * 100)
      : 0,
  }));

  const ratingColor = (r) =>
    r >= 4 ? successC : r === 3 ? warningC : errorC;

  const sentimentLabel = (r) =>
    r >= 4 ? "POSITIVE" : r === 3 ? "NEUTRAL" : "NEGATIVE";

  // ── Stat card ──────────────────────────────────────────────────────────────
  const StatCard = ({ label, value, icon, color, delay }) => (
    <motion.div
      initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
      transition={{ delay, type:"spring", stiffness:180 }}
      whileHover={{ y:-5, transition:{ type:"spring", stiffness:400 } }}>
      <Box sx={{
        borderRadius:"14px", p:"16px 20px", minWidth:165,
        background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
        border:`1px solid rgba(34,211,238,0.12)`,
        boxShadow:`0 4px 20px rgba(0,0,0,0.3)`,
        position:"relative", overflow:"hidden",
        transition:"border-color 0.25s, box-shadow 0.25s",
        "&:hover":{ borderColor:`${color}40`, boxShadow:`0 8px 28px ${color}18` },
        "&::before":{ content:'""', position:"absolute", top:0, left:0, right:0, height:"2px",
          background:`linear-gradient(90deg, transparent, ${color}90, transparent)` },
      }}>
        <Box sx={{ display:"flex", justifyContent:"space-between",
          alignItems:"flex-start", mb:0.6 }}>
          <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
            fontSize:"0.55rem", color:textSec, letterSpacing:"0.1em",
            textTransform:"uppercase" }}>
            {label}
          </Typography>
          <Box sx={{ width:28, height:28, borderRadius:"8px",
            background:`${color}18`, border:`1px solid ${color}30`,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:color, "& svg":{ fontSize:"0.95rem" } }}>
            {icon}
          </Box>
        </Box>
        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
          fontWeight:900, fontSize:"1.9rem", color:textPri, lineHeight:1,
          textShadow:`0 0 16px ${color}40` }}>
          {value}
        </Typography>
      </Box>
    </motion.div>
  );

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
                ADMIN // USER_FEEDBACKS
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily:"'Exo 2', sans-serif", fontWeight:900,
              fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
              background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              User Feedbacks
            </Typography>
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
              color:textSec, fontSize:"0.85rem", mt:0.4 }}>
              {total} feedback{total !== 1 ? "s" : ""} collected from users
            </Typography>
          </Box>
        </motion.div>

        {/* ── API ERROR ── */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0 }} transition={{ duration:0.25 }}>
              <Box sx={{ mb:3, px:2, py:"12px", borderRadius:"10px",
                background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.3)" }}>
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontSize:"0.9rem", color:errorC }}>{error}</Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STAT CARDS ── */}
        <Box sx={{ display:"flex", gap:2, mb:4, flexWrap:"wrap" }}>
          <StatCard label="Total"        value={loading ? "—" : total}
            icon={<ChatBubbleIcon />} color={primary}   delay={0.1} />
          <StatCard label="Avg Rating"   value={loading ? "—" : `${avgRating}★`}
            icon={<StarIcon />}        color={warningC}  delay={0.17} />
          <StatCard label="5-Star"       value={loading ? "—" : fiveStar}
            icon={<StarIcon />}        color={successC}  delay={0.24} />
          <StatCard label="With Comment" value={loading ? "—" : withComment}
            icon={<ChatBubbleIcon />}  color={secondary} delay={0.31} />
        </Box>

        {/* ── RATING DISTRIBUTION ── */}
        {!loading && !error && total > 0 && (
          <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.35, duration:0.55 }}>
            <Box sx={{
              borderRadius:"16px", p:"22px 26px", mb:3,
              background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
              border:`1px solid rgba(34,211,238,0.13)`,
              boxShadow:`0 4px 32px rgba(0,0,0,0.4)`,
              position:"relative", overflow:"hidden",
              "&::before":{ content:'""', position:"absolute",
                top:0, left:"8%", right:"8%", height:"1.5px",
                background:`linear-gradient(90deg, transparent, ${warningC}70, ${primary}50, transparent)` },
            }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:2.5 }}>
                <TrendingUpIcon sx={{ color:warningC, fontSize:"1.1rem" }} />
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontWeight:700, fontSize:"1rem", color:textPri }}>
                  Rating Distribution
                </Typography>
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.5rem", color:textSec, letterSpacing:"0.12em", ml:0.5 }}>
                  // {total} TOTAL
                </Typography>
              </Box>

              <Box sx={{ display:"flex", flexDirection:"column", gap:1.4 }}>
                {ratingDist.map(({ star, count, pct }) => (
                  <Box key={star} sx={{ display:"flex", alignItems:"center", gap:2 }}>
                    {/* Star label */}
                    <Box sx={{ display:"flex", alignItems:"center", gap:0.5,
                      minWidth:50, flexShrink:0 }}>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontSize:"0.88rem", fontWeight:700, color:ratingColor(star) }}>
                        {star}
                      </Typography>
                      <StarIcon sx={{ fontSize:"0.8rem", color:ratingColor(star) }} />
                    </Box>

                    {/* Animated bar */}
                    <Box sx={{ flex:1, height:10, borderRadius:99,
                      background:"rgba(34,211,238,0.08)", overflow:"hidden" }}>
                      <motion.div
                        initial={{ width:0 }}
                        animate={{ width:`${Math.max(pct, count > 0 ? 3 : 0)}%` }}
                        transition={{ delay:0.4, duration:0.8, ease:"easeOut" }}
                        style={{
                          height:"100%", borderRadius:99,
                          background:`linear-gradient(90deg, ${ratingColor(star)}, ${ratingColor(star)}aa)`,
                          boxShadow:`0 0 8px ${ratingColor(star)}60`,
                        }} />
                    </Box>

                    {/* Count + % */}
                    <Box sx={{ display:"flex", alignItems:"center", gap:1,
                      flexShrink:0, minWidth:80 }}>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontSize:"0.88rem", color:textPri, fontWeight:600, minWidth:24 }}>
                        {count}
                      </Typography>
                      <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                        fontSize:"0.55rem", color:textSec, letterSpacing:"0.06em" }}>
                        ({pct}%)
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}

        {/* ── SEARCH + STAR FILTER ── */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.2, duration:0.5 }}>
          <Box sx={{
            borderRadius:"14px", p:"14px 18px", mb:3,
            background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
            border:`1px solid rgba(34,211,238,0.12)`,
            display:"flex", gap:2, flexWrap:"wrap", alignItems:"center",
          }}>
            {/* Search */}
            <Box sx={{ flex:1, minWidth:200, position:"relative" }}>
              <SearchIcon sx={{ position:"absolute", left:12, top:"50%",
                transform:"translateY(-50%)", color:primary,
                fontSize:"1rem", pointerEvents:"none" }} />
              <Box component="input" value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by userId, questionId or comment..."
                sx={{
                  width:"100%", pl:"36px", pr:2, py:"9px",
                  borderRadius:"10px", border:`1px solid rgba(34,211,238,0.18)`,
                  background:paper, color:textPri, fontSize:"0.88rem",
                  fontFamily:"'Exo 2', sans-serif", outline:"none", transition:"all 0.25s",
                  "&:focus":{ border:`1px solid ${primary}70`, boxShadow:`0 0 0 3px ${primary}15` },
                  "&::placeholder":{ color:textSec, opacity:0.45 },
                }} />
            </Box>

            {/* Filter label */}
            <Box sx={{ display:"flex", alignItems:"center", gap:0.8 }}>
              <FilterListIcon sx={{ color:textSec, fontSize:"0.9rem" }} />
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.52rem", color:textSec, letterSpacing:"0.1em" }}>
                RATING:
              </Typography>
            </Box>

            {/* Star filter pills */}
            <Box sx={{ display:"flex", gap:0.8, flexWrap:"wrap" }}>
              {[0,5,4,3,2,1].map(r => (
                <Box key={r} onClick={() => setRatingFilter(r)} sx={{
                  px:1.4, py:"6px", borderRadius:"8px", cursor:"pointer",
                  background: ratingFilter === r
                    ? `${r === 0 ? primary : ratingColor(r)}18`
                    : "rgba(34,211,238,0.04)",
                  border:`1px solid ${ratingFilter === r
                    ? (r === 0 ? primary : ratingColor(r)) + "45"
                    : "rgba(34,211,238,0.12)"}`,
                  transition:"all 0.22s",
                  "&:hover":{ background:"rgba(34,211,238,0.1)" },
                }}>
                  <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                    fontSize:"0.62rem",
                    color: ratingFilter === r
                      ? (r === 0 ? primary : ratingColor(r))
                      : textSec,
                    letterSpacing:"0.06em" }}>
                    {r === 0 ? "ALL" : `${r}★`}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* ── COUNT LABEL ── */}
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.52rem", color:"rgba(71,85,105,0.85)",
          letterSpacing:"0.18em", mb:1.5 }}>
          // SHOWING {filtered.length} OF {total} FEEDBACKS
        </Typography>

        {/* ── LOADING ── */}
        {loading && (
          <Box sx={{ display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", py:10 }}>
            <CircularProgress sx={{ color:primary, mb:2 }} />
            <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
              fontSize:"0.62rem", color:primary, letterSpacing:"0.2em" }}>
              LOADING_FEEDBACKS...
            </Typography>
          </Box>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !error && filtered.length === 0 && (
          <Box sx={{ textAlign:"center", py:8,
            border:`1px dashed rgba(34,211,238,0.18)`, borderRadius:"14px",
            background:"rgba(34,211,238,0.02)" }}>
            <ChatBubbleIcon sx={{ color:primary, fontSize:"2.5rem", opacity:0.35, mb:1 }} />
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif", color:textSec }}>
              {total === 0
                ? "No feedbacks submitted by users yet."
                : "No feedbacks match your current filters."}
            </Typography>
          </Box>
        )}

        {/* ── FEEDBACK LIST ── */}
        {/* Fields from FeedbackController: feedbackId, userId, questionId, rating, comment */}
        <AnimatePresence>
          {filtered.map((f, i) => (
            <motion.div key={f.feedbackId}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ delay:i < 15 ? i*0.04 : 0, type:"spring", stiffness:180 }}>
              <Box sx={{
                borderRadius:"14px", p:"18px 20px", mb:2,
                background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                border:`1px solid rgba(34,211,238,0.1)`,
                boxShadow:`0 3px 18px rgba(0,0,0,0.3)`,
                position:"relative", overflow:"hidden",
                transition:"all 0.25s",
                "&:hover":{ borderColor:"rgba(34,211,238,0.25)",
                  boxShadow:`0 8px 28px rgba(34,211,238,0.08)` },
                // Left bar color = rating sentiment
                "&::before":{ content:'""', position:"absolute",
                  top:0, left:0, bottom:0, width:"3px",
                  background:`linear-gradient(180deg,
                    ${ratingColor(f.rating)},
                    ${ratingColor(f.rating)}55)`,
                  boxShadow:`0 0 8px ${ratingColor(f.rating)}50` },
              }}>
                <Box sx={{ display:"flex", alignItems:"flex-start",
                  justifyContent:"space-between", gap:2, flexWrap:"wrap" }}>

                  {/* ── LEFT CONTENT ── */}
                  <Box sx={{ flex:1, minWidth:0 }}>

                    {/* Row 1: badges */}
                    <Box sx={{ display:"flex", alignItems:"center",
                      gap:1, mb:1.5, flexWrap:"wrap" }}>

                      {/* Feedback ID */}
                      <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
                        background:"rgba(34,211,238,0.07)",
                        border:"1px solid rgba(34,211,238,0.18)" }}>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.55rem", color:primary, letterSpacing:"0.1em" }}>
                          #{f.feedbackId}
                        </Typography>
                      </Box>

                      {/* User ID */}
                      <Box sx={{ display:"flex", alignItems:"center", gap:0.6,
                        px:1.4, py:"4px", borderRadius:"7px",
                        background:`${primary}12`, border:`1px solid ${primary}28` }}>
                        <PersonIcon sx={{ color:primary, fontSize:"0.78rem" }} />
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.6rem", color:primary, letterSpacing:"0.1em" }}>
                          USER_{String(f.userId).padStart(4,"0")}
                        </Typography>
                      </Box>

                      {/* Question ID */}
                      <Box sx={{ display:"flex", alignItems:"center", gap:0.6,
                        px:1.4, py:"4px", borderRadius:"7px",
                        background:`${secondary}10`, border:`1px solid ${secondary}28` }}>
                        <QuizIcon sx={{ color:secondary, fontSize:"0.78rem" }} />
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.6rem", color:secondary, letterSpacing:"0.08em" }}>
                          Q_{String(f.questionId).padStart(4,"0")}
                        </Typography>
                      </Box>

                      {/* Sentiment chip */}
                      <Box sx={{ px:1.2, py:"3px", borderRadius:"6px",
                        background:`${ratingColor(f.rating)}12`,
                        border:`1px solid ${ratingColor(f.rating)}30` }}>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.55rem", color:ratingColor(f.rating),
                          letterSpacing:"0.08em" }}>
                          {sentimentLabel(f.rating)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Row 2: stars + numeric */}
                    <Box sx={{ display:"flex", alignItems:"center", gap:1.5, mb:1.5 }}>
                      <StarDisplay rating={f.rating} />
                      <Box sx={{ px:1.4, py:"4px", borderRadius:"7px",
                        background:`${ratingColor(f.rating)}15`,
                        border:`1px solid ${ratingColor(f.rating)}35` }}>
                        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                          fontWeight:900, fontSize:"0.95rem",
                          color:ratingColor(f.rating),
                          textShadow:`0 0 10px ${ratingColor(f.rating)}50` }}>
                          {f.rating} / 5
                        </Typography>
                      </Box>
                    </Box>

                    {/* Row 3: comment */}
                    {f.comment?.trim() ? (
                      <Box sx={{ px:2, py:"11px", borderRadius:"10px",
                        background:"rgba(34,211,238,0.04)",
                        border:`1px solid rgba(34,211,238,0.1)`,
                        position:"relative" }}>
                        {/* Quote mark */}
                        <Typography sx={{
                          position:"absolute", top:4, left:10,
                          color:primary, opacity:0.35,
                          fontFamily:"Georgia, serif", fontSize:"1.4rem", lineHeight:1 }}>
                          "
                        </Typography>
                        <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                          fontSize:"0.9rem", color:textPri,
                          lineHeight:1.65, pl:2 }}>
                          {f.comment}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display:"flex", alignItems:"center", gap:0.8,
                        px:1.6, py:"8px", borderRadius:"8px",
                        background:"rgba(34,211,238,0.03)",
                        border:"1px solid rgba(34,211,238,0.08)" }}>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.55rem", color:textSec, opacity:0.5,
                          letterSpacing:"0.1em" }}>
                          // NO_COMMENT_PROVIDED
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* ── DELETE BUTTON ── */}
                  <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }}>
                    <Box onClick={() => handleDelete(f.feedbackId)} sx={{
                      display:"flex", alignItems:"center", gap:0.6,
                      px:1.6, py:"8px", borderRadius:"9px", cursor:"pointer",
                      background:"rgba(248,113,113,0.08)",
                      border:"1px solid rgba(248,113,113,0.22)",
                      transition:"all 0.22s", flexShrink:0,
                      opacity: deleting === f.feedbackId ? 0.5 : 1,
                      "&:hover":{ background:"rgba(248,113,113,0.18)",
                        border:"1px solid rgba(248,113,113,0.5)" },
                    }}>
                      {deleting === f.feedbackId
                        ? <CircularProgress size={14} sx={{ color:errorC }} />
                        : <DeleteOutlineIcon sx={{ color:errorC, fontSize:"0.9rem" }} />}
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontSize:"0.78rem", color:errorC, fontWeight:600 }}>
                        Delete
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          ))}
        </AnimatePresence>

        <Box sx={{ height:40 }} />
      </Box>
    </Box>
  );
}