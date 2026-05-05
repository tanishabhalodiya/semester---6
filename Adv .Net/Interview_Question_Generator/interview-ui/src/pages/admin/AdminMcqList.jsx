import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminSidebar        from "../../components/AdminSidebar";
import HubIcon             from "@mui/icons-material/Hub";
import QuizIcon            from "@mui/icons-material/Quiz";
import EditIcon            from "@mui/icons-material/Edit";
import DeleteOutlineIcon   from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterListIcon      from "@mui/icons-material/FilterList";
import SearchIcon          from "@mui/icons-material/Search";

export default function AdminMcqList() {
  const [mcqs,           setMcqs]           = useState([]);
  const [filteredMcqs,   setFilteredMcqs]   = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [skillFilter,    setSkillFilter]    = useState("ALL");
  const [search,         setSearch]         = useState("");
  const [loading,        setLoading]        = useState(true);

  const navigate = useNavigate();
  const theme    = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const errorC    = theme.palette.error.main;
  const successC  = theme.palette.success.main;
  const warningC  = theme.palette.warning.main;

  const load = async () => {
    try {
      const res = await api.get("/admin/mcq");
      setMcqs(res.data);
      setFilteredMcqs(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    let data = mcqs;
    if (categoryFilter !== "ALL")
      data = data.filter(q => q.category?.toLowerCase() === categoryFilter.toLowerCase());
    if (skillFilter !== "ALL")
      data = data.filter(q => q.skillName?.toLowerCase() === skillFilter.toLowerCase());
    if (search.trim())
      data = data.filter(q => q.questionText?.toLowerCase().includes(search.toLowerCase()));
    setFilteredMcqs(data);
  }, [categoryFilter, skillFilter, search, mcqs]);

  const remove = async (id) => {
    if (!window.confirm("Delete this MCQ?")) return;
    await api.delete(`/admin/mcq/${id}`);
    load();
  };

  const diffColor = (d) => {
    if (!d) return textSec;
    const dl = d.toLowerCase();
    return dl === "easy" ? successC : dl === "medium" ? warningC : dl === "hard" ? errorC : textSec;
  };

  // ── unique skill names for filter ─────────────────────────────────────────
  const uniqueSkills = [...new Set(mcqs.map(q => q.skillName).filter(Boolean))];

  const selectSx = {
    fontFamily:"'Exo 2', sans-serif", color:textPri, fontSize:"0.82rem",
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
    "& .MuiMenuItem-root":{ fontFamily:"'Exo 2', sans-serif", fontSize:"0.85rem",
      color:textSec, py:1,
      "&:hover":{ background:`${primary}15`, color:primary },
      "&.Mui-selected":{ background:`${primary}18`, color:primary },
    },
  }}};

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
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <Box sx={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", mb:4, gap:2, flexWrap:"wrap" }}>
            <Box>
              <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
                <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
                <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                  fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                  ADMIN // MCQ_LIBRARY
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
                background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                MCQ Library
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:textSec, fontSize:"0.85rem", mt:0.4 }}>
                {filteredMcqs.length} of {mcqs.length} questions
              </Typography>
            </Box>

            {/* Add button */}
            <motion.div whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
              <Box onClick={()=>navigate("/admin/mcq/add")} sx={{
                display:"flex", alignItems:"center", gap:0.8,
                px:2.2, py:"11px", borderRadius:"11px", cursor:"pointer",
                background:`linear-gradient(135deg, #0891b2, ${primary})`,
                border:`1px solid ${primary}55`,
                boxShadow:`0 4px 18px ${primary}40`,
                transition:"all 0.25s",
                "&:hover":{ boxShadow:`0 8px 28px ${primary}60` },
              }}>
                <AddCircleOutlineIcon sx={{ color:"#030712", fontSize:"1rem" }} />
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif", fontWeight:800,
                  fontSize:"0.85rem", color:"#030712",
                  letterSpacing:"0.06em", textTransform:"uppercase" }}>
                  Add New MCQ
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* ── FILTER BAR ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.5 }}>
          <Box sx={{
            borderRadius:"14px", p:"16px 20px", mb:3,
            background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
            border:`1px solid rgba(34,211,238,0.12)`,
            display:"flex", gap:2, flexWrap:"wrap", alignItems:"center",
          }}>
            {/* Search */}
            <Box sx={{ flex:2, minWidth:200, position:"relative" }}>
              <SearchIcon sx={{ position:"absolute", left:12, top:"50%",
                transform:"translateY(-50%)", color:primary, fontSize:"1rem", pointerEvents:"none" }} />
              <Box component="input" value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search questions..."
                sx={{ width:"100%", pl:"36px", pr:2, py:"10px",
                  borderRadius:"10px", border:`1px solid rgba(34,211,238,0.18)`,
                  background:paper, color:textPri, fontSize:"0.85rem",
                  fontFamily:"'Exo 2', sans-serif", outline:"none", transition:"all 0.25s",
                  "&:focus":{ border:`1px solid ${primary}70`, boxShadow:`0 0 0 3px ${primary}15` },
                  "&::placeholder":{ color:textSec, opacity:0.5 },
                }} />
            </Box>

            {/* Divider */}
            <Box sx={{ display:"flex", alignItems:"center", gap:0.8 }}>
              <FilterListIcon sx={{ color:textSec, fontSize:"0.9rem" }} />
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.5rem", color:textSec, letterSpacing:"0.12em" }}>
                FILTER:
              </Typography>
            </Box>

            {/* Category */}
            <FormControl sx={{ minWidth:160 }}>
              <Select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}
                sx={selectSx} MenuProps={menuProps}>
                {["ALL","MCQ","Theory","Coding","Scenario Based"].map(c=>(
                  <MenuItem key={c} value={c}>{c==="ALL" ? "All Categories" : c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Skill */}
            <FormControl sx={{ minWidth:150 }}>
              <Select value={skillFilter} onChange={e=>setSkillFilter(e.target.value)}
                sx={selectSx} MenuProps={menuProps}>
                <MenuItem value="ALL">All Skills</MenuItem>
                {uniqueSkills.map(s=>(
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </motion.div>

        {/* ── LOADING ── */}
        {loading && (
          <Box sx={{ display:"flex", justifyContent:"center", py:8 }}>
            <CircularProgress sx={{ color:primary }} />
          </Box>
        )}

        {/* ── EMPTY ── */}
        {!loading && filteredMcqs.length === 0 && (
          <Box sx={{ textAlign:"center", py:8,
            border:`1px dashed rgba(34,211,238,0.18)`, borderRadius:"14px" }}>
            <QuizIcon sx={{ color:primary, fontSize:"2.5rem", opacity:0.4, mb:1 }} />
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif", color:textSec }}>
              No MCQs found for the current filters.
            </Typography>
          </Box>
        )}

        {/* ── MCQ LIST ── */}
        <AnimatePresence>
          {filteredMcqs.map((q, i) => (
            <motion.div key={q.questionId}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }}
              transition={{ delay: i < 15 ? i * 0.04 : 0, type:"spring", stiffness:180 }}>
              <Box sx={{
                borderRadius:"13px", p:"16px 20px", mb:2,
                background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                border:`1px solid rgba(34,211,238,0.1)`,
                boxShadow:`0 3px 18px rgba(0,0,0,0.3)`,
                display:"flex", alignItems:"center", gap:2,
                transition:"all 0.25s",
                "&:hover":{ borderColor:"rgba(34,211,238,0.28)",
                  boxShadow:`0 8px 28px rgba(34,211,238,0.08)` },
                position:"relative", overflow:"hidden",
                "&::before":{ content:'""', position:"absolute",
                  top:0, left:0, bottom:0, width:"3px",
                  background:`linear-gradient(180deg, ${primary}, ${secondary})`,
                  boxShadow:`0 0 8px ${primary}60` },
              }}>

                {/* Icon */}
                <Box sx={{ width:42, height:42, borderRadius:"10px", flexShrink:0,
                  background:`${primary}15`, border:`1px solid ${primary}30`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:primary, "& svg":{ fontSize:"1.2rem" } }}>
                  <QuizIcon />
                </Box>

                {/* Content */}
                <Box sx={{ flex:1, minWidth:0 }}>
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontWeight:600, fontSize:"0.9rem", color:textPri, mb:0.7,
                    overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {q.questionText}
                  </Typography>

                  <Box sx={{ display:"flex", gap:1, flexWrap:"wrap" }}>
                    {[
                      { label: q.difficulty || "—",            color: diffColor(q.difficulty) },
                      { label: q.category   || "—",            color: primary                 },
                      { label: q.skillName  || q.skill || "—", color: secondary               },
                    ].map(chip => (
                      <Box key={chip.label} sx={{ px:1.2, py:"3px", borderRadius:"6px",
                        background:`${chip.color}12`, border:`1px solid ${chip.color}30` }}>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.58rem", color:chip.color, letterSpacing:"0.06em" }}>
                          {chip.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ display:"flex", gap:1, flexShrink:0 }}>
                  <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }}>
                    <Box onClick={()=>navigate(`/admin/mcq/edit/${q.questionId}`)}
                      sx={{ display:"flex", alignItems:"center", gap:0.5,
                        px:1.6, py:"7px", borderRadius:"8px", cursor:"pointer",
                        background:`${primary}10`, border:`1px solid ${primary}30`,
                        transition:"all 0.22s",
                        "&:hover":{ background:`${primary}20`, border:`1px solid ${primary}55` },
                      }}>
                      <EditIcon sx={{ color:primary, fontSize:"0.85rem" }} />
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontSize:"0.75rem", color:primary, fontWeight:600 }}>Edit</Typography>
                    </Box>
                  </motion.div>

                  <motion.div whileHover={{ scale:1.06 }} whileTap={{ scale:0.95 }}>
                    <Box onClick={()=>remove(q.questionId)}
                      sx={{ display:"flex", alignItems:"center", gap:0.5,
                        px:1.6, py:"7px", borderRadius:"8px", cursor:"pointer",
                        background:"rgba(248,113,113,0.08)",
                        border:"1px solid rgba(248,113,113,0.25)",
                        transition:"all 0.22s",
                        "&:hover":{ background:"rgba(248,113,113,0.18)",
                          border:"1px solid rgba(248,113,113,0.5)" },
                      }}>
                      <DeleteOutlineIcon sx={{ color:errorC, fontSize:"0.85rem" }} />
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontSize:"0.75rem", color:errorC, fontWeight:600 }}>Delete</Typography>
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