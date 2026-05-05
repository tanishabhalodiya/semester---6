import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HubIcon          from "@mui/icons-material/Hub";
import DashboardIcon    from "@mui/icons-material/Dashboard";
import OpenInNewIcon    from "@mui/icons-material/OpenInNew";
import MenuBookIcon     from "@mui/icons-material/MenuBook";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import ArticleIcon      from "@mui/icons-material/Article";
import CodeIcon         from "@mui/icons-material/Code";
import SearchIcon       from "@mui/icons-material/Search";
import FilterListIcon   from "@mui/icons-material/FilterList";

// ── Resource Data ─────────────────────────────────────────────────────────────
const RESOURCES = [
  // ── DSA / Coding
  {
    id:1, category:"DSA & Coding",
    title:"Striver's DSA Sheet",
    desc:"Complete 450-question DSA roadmap covering arrays, trees, graphs, DP and more.",
    url:"https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2",
    type:"Article", tag:"Must Do", color:"#22d3ee",
  },
  {
    id:2, category:"DSA & Coding",
    title:"NeetCode 150",
    desc:"Curated 150 LeetCode problems with video solutions — ideal for FAANG prep.",
    url:"https://neetcode.io/practice",
    type:"Practice", tag:"Popular", color:"#22d3ee",
  },
  {
    id:3, category:"DSA & Coding",
    title:"GeeksForGeeks DSA",
    desc:"Articles, problems and tutorials on every DSA topic with C++/Java/Python examples.",
    url:"https://www.geeksforgeeks.org/data-structures/",
    type:"Article", tag:"Reference", color:"#22d3ee",
  },
  // ── Java
  {
    id:4, category:"Java",
    title:"Java Full Course — Telusko",
    desc:"Complete beginner to advanced Java course covering OOP, collections, streams and more.",
    url:"https://www.youtube.com/watch?v=BGTx91t8q50",
    type:"Video", tag:"Beginner", color:"#fb923c",
  },
  {
    id:5, category:"Java",
    title:"Java Interview Questions — GFG",
    desc:"Top 50 Java interview questions covering core concepts, multithreading, and collections.",
    url:"https://www.geeksforgeeks.org/java-interview-questions/",
    type:"Article", tag:"Interview", color:"#fb923c",
  },
  // ── Python
  {
    id:6, category:"Python",
    title:"Python for Beginners — freeCodeCamp",
    desc:"4-hour Python full course covering syntax, OOP, file handling and projects.",
    url:"https://www.youtube.com/watch?v=rfscVS0vtbw",
    type:"Video", tag:"Beginner", color:"#34d399",
  },
  {
    id:7, category:"Python",
    title:"Python Interview Questions",
    desc:"Comprehensive Python interview prep covering decorators, generators, and built-ins.",
    url:"https://www.interviewbit.com/python-interview-questions/",
    type:"Article", tag:"Interview", color:"#34d399",
  },
  // ── C
  {
    id:8, category:"C",
    title:"C Programming Full Course",
    desc:"Complete C programming from basics to pointers, memory management and file I/O.",
    url:"https://www.youtube.com/watch?v=KJgsSFOSQv0",
    type:"Video", tag:"Beginner", color:"#818cf8",
  },
  {
    id:9, category:"C",
    title:"C Interview Questions — GFG",
    desc:"Top C interview questions covering pointers, memory, struct and common tricky questions.",
    url:"https://www.geeksforgeeks.org/c-interview-questions/",
    type:"Article", tag:"Interview", color:"#818cf8",
  },
  // ── .NET
  {
    id:10, category:".NET",
    title:"ASP.NET Core Full Course",
    desc:"Complete ASP.NET Core Web API tutorial covering controllers, EF Core, JWT and deployment.",
    url:"https://www.youtube.com/watch?v=fmvcAzHpsk8",
    type:"Video", tag:"Intermediate", color:"#d946ef",
  },
  {
    id:11, category:".NET",
    title:".NET Interview Questions",
    desc:"Top .NET/C# interview questions covering CLR, LINQ, async/await and design patterns.",
    url:"https://www.interviewbit.com/dot-net-interview-questions/",
    type:"Article", tag:"Interview", color:"#d946ef",
  },
  // ── System Design
  {
    id:12, category:"System Design",
    title:"System Design Primer",
    desc:"The legendary GitHub repo — everything you need to design large-scale distributed systems.",
    url:"https://github.com/donnemartin/system-design-primer",
    type:"Article", tag:"Must Do", color:"#fbbf24",
  },
  {
    id:13, category:"System Design",
    title:"Gaurav Sen — System Design",
    desc:"Top-rated YouTube playlist on system design concepts with real-world examples.",
    url:"https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX",
    type:"Video", tag:"Popular", color:"#fbbf24",
  },
  // ── Cheat Sheets
  {
    id:14, category:"Cheat Sheets",
    title:"Big-O Complexity Cheat Sheet",
    desc:"Visual cheat sheet of time & space complexity for all major data structures and algorithms.",
    url:"https://www.bigocheatsheet.com/",
    type:"Article", tag:"Reference", color:"#f87171",
  },
  {
    id:15, category:"Cheat Sheets",
    title:"Git Cheat Sheet — Atlassian",
    desc:"Complete Git commands reference from clone to rebase, branching and merge strategies.",
    url:"https://www.atlassian.com/git/tutorials/atlassian-git-cheatsheet",
    type:"Article", tag:"Reference", color:"#f87171",
  },
];

const CATEGORIES = ["All", ...new Set(RESOURCES.map(r => r.category))];
const TYPES      = ["All", "Article", "Video", "Practice"];

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeType,     setActiveType]     = useState("All");
  const [search,         setSearch]         = useState("");
  const navigate = useNavigate();
  const theme    = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;

  const typeIcon = (t) => {
    if (t === "Video")    return <VideoLibraryIcon sx={{ fontSize:"0.9rem" }} />;
    if (t === "Practice") return <CodeIcon sx={{ fontSize:"0.9rem" }} />;
    return <ArticleIcon sx={{ fontSize:"0.9rem" }} />;
  };

  const tagColor = (tag) => {
    if (tag === "Must Do")     return "#f87171";
    if (tag === "Popular")     return "#fbbf24";
    if (tag === "Interview")   return secondary;
    if (tag === "Beginner")    return successC;
    if (tag === "Intermediate") return "#fb923c";
    return primary;
  };

  const filtered = RESOURCES.filter(r => {
    const matchCat  = activeCategory === "All" || r.category === activeCategory;
    const matchType = activeType === "All" || r.type === activeType;
    const matchSearch = !search.trim() ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.desc.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

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

      <Box sx={{ position:"relative", zIndex:20 }}><Sidebar /></Box>

      <Box sx={{ flex:1, p:{ xs:2, md:"36px 32px" }, position:"relative", zIndex:2 }}>

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
                  LIBRARY // RESOURCES
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
                background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                Resources
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:textSec, fontSize:"0.85rem", mt:0.4 }}>
                Handpicked articles, videos and cheat sheets to ace every interview
              </Typography>
            </Box>

            <motion.div whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}>
              <Box onClick={() => navigate("/user/dashboard")} sx={{
                display:"flex", alignItems:"center", gap:1,
                px:2, py:"10px", borderRadius:"9px", cursor:"pointer",
                border:`1px solid rgba(34,211,238,0.18)`,
                background:"rgba(34,211,238,0.04)", transition:"all 0.22s",
                "&:hover":{ background:"rgba(34,211,238,0.1)", border:`1px solid ${primary}40` },
              }}>
                <DashboardIcon sx={{ color:primary, fontSize:"1rem" }} />
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontSize:"0.82rem", fontWeight:500, color:textSec }}>
                  Dashboard
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* ── SEARCH + FILTER BAR ── */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.5 }}>
          <Box sx={{
            borderRadius:"14px", p:"16px 20px", mb:3,
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
                placeholder="Search resources..."
                sx={{
                  width:"100%", pl:"36px", pr:2, py:"10px",
                  borderRadius:"10px", border:`1px solid rgba(34,211,238,0.18)`,
                  background:paper, color:textPri, fontSize:"0.88rem",
                  fontFamily:"'Exo 2', sans-serif", outline:"none", transition:"all 0.25s",
                  "&:focus":{ border:`1px solid ${primary}70`, boxShadow:`0 0 0 3px ${primary}15` },
                  "&::placeholder":{ color:textSec, opacity:0.5 },
                }} />
            </Box>

            {/* Type filter */}
            <Box sx={{ display:"flex", gap:1, flexWrap:"wrap" }}>
              {TYPES.map(t => (
                <Box key={t} onClick={() => setActiveType(t)} sx={{
                  px:1.5, py:"6px", borderRadius:"8px", cursor:"pointer",
                  background: activeType === t ? `${primary}18` : "rgba(34,211,238,0.04)",
                  border:`1px solid ${activeType === t ? primary + "45" : "rgba(34,211,238,0.14)"}`,
                  transition:"all 0.22s",
                  "&:hover":{ background:`${primary}12`, border:`1px solid ${primary}35` },
                }}>
                  <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                    fontSize:"0.6rem", color: activeType === t ? primary : textSec,
                    letterSpacing:"0.08em" }}>
                    {t}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </motion.div>

        {/* ── CATEGORY PILLS ── */}
        <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.15, duration:0.4 }}>
          <Box sx={{ display:"flex", gap:1, flexWrap:"wrap", mb:3 }}>
            {CATEGORIES.map(cat => (
              <Box key={cat} onClick={() => setActiveCategory(cat)} sx={{
                px:1.8, py:"7px", borderRadius:"9px", cursor:"pointer",
                background: activeCategory === cat ? `${primary}18` : "rgba(34,211,238,0.04)",
                border:`1px solid ${activeCategory === cat ? primary + "50" : "rgba(34,211,238,0.12)"}`,
                boxShadow: activeCategory === cat ? `0 4px 14px ${primary}18` : "none",
                transition:"all 0.22s",
                "&:hover":{ background:`${primary}10`, border:`1px solid ${primary}35` },
              }}>
                <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                  fontWeight: activeCategory === cat ? 700 : 400,
                  fontSize:"0.82rem",
                  color: activeCategory === cat ? primary : textSec }}>
                  {cat}
                </Typography>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* ── COUNT ── */}
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.52rem", color:"rgba(71,85,105,0.85)",
          letterSpacing:"0.18em", mb:2 }}>
          // SHOWING {filtered.length} OF {RESOURCES.length} RESOURCES
        </Typography>

        {/* ── RESOURCE GRID ── */}
        {filtered.length === 0 ? (
          <Box sx={{ textAlign:"center", py:8,
            border:`1px dashed rgba(34,211,238,0.18)`, borderRadius:"14px" }}>
            <MenuBookIcon sx={{ color:primary, fontSize:"2.5rem", opacity:0.35, mb:1 }} />
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif", color:textSec }}>
              No resources found for your filters.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display:"grid",
            gridTemplateColumns:{ xs:"1fr", sm:"1fr 1fr", lg:"1fr 1fr 1fr" },
            gap:2.5 }}>
            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.div key={r.id}
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, scale:0.95 }}
                  transition={{ delay:i*0.04, type:"spring", stiffness:180 }}
                  whileHover={{ y:-6, transition:{ type:"spring", stiffness:350 } }}>
                  <Box
                    onClick={() => window.open(r.url, "_blank", "noopener")}
                    sx={{
                      borderRadius:"14px", p:"20px 18px",
                      background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                      border:`1px solid rgba(34,211,238,0.1)`,
                      boxShadow:`0 4px 20px rgba(0,0,0,0.3)`,
                      cursor:"pointer", height:"100%",
                      display:"flex", flexDirection:"column", gap:1.2,
                      position:"relative", overflow:"hidden",
                      transition:"all 0.25s",
                      "&:hover":{ borderColor:`${r.color}40`,
                        boxShadow:`0 12px 36px ${r.color}15` },
                      "&::before":{ content:'""', position:"absolute",
                        top:0, left:0, bottom:0, width:"3px",
                        background:`linear-gradient(180deg, ${r.color}, ${r.color}44)`,
                        boxShadow:`0 0 8px ${r.color}60` },
                    }}>

                    {/* Type icon + tag */}
                    <Box sx={{ display:"flex", justifyContent:"space-between",
                      alignItems:"center" }}>
                      <Box sx={{ display:"flex", alignItems:"center", gap:0.7,
                        px:1.2, py:"4px", borderRadius:"7px",
                        background:`${r.color}15`, border:`1px solid ${r.color}30`,
                        color:r.color }}>
                        {typeIcon(r.type)}
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.55rem", color:r.color, letterSpacing:"0.08em" }}>
                          {r.type.toUpperCase()}
                        </Typography>
                      </Box>

                      <Box sx={{ px:1.2, py:"4px", borderRadius:"7px",
                        background:`${tagColor(r.tag)}12`,
                        border:`1px solid ${tagColor(r.tag)}30` }}>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.52rem", color:tagColor(r.tag),
                          letterSpacing:"0.08em" }}>
                          {r.tag}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Title */}
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontWeight:700, fontSize:"0.95rem", color:textPri,
                      lineHeight:1.3 }}>
                      {r.title}
                    </Typography>

                    {/* Description */}
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontSize:"0.8rem", color:textSec, lineHeight:1.6, flex:1 }}>
                      {r.desc}
                    </Typography>

                    {/* Category + open link */}
                    <Box sx={{ display:"flex", alignItems:"center",
                      justifyContent:"space-between", mt:"auto", pt:0.5 }}>
                      <Box sx={{ px:1, py:"2px", borderRadius:"5px",
                        background:`${r.color}10`, border:`1px solid ${r.color}25` }}>
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.5rem", color:r.color, letterSpacing:"0.08em" }}>
                          {r.category}
                        </Typography>
                      </Box>

                      <Box sx={{ display:"flex", alignItems:"center", gap:0.5,
                        color:r.color, opacity:0.6,
                        "& svg":{ fontSize:"0.85rem" } }}>
                        <OpenInNewIcon />
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.5rem", letterSpacing:"0.08em" }}>
                          OPEN
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        )}

        <Box sx={{ height:40 }} />
      </Box>
    </Box>
  );
}