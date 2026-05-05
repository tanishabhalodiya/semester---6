import { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import QuizIcon              from "@mui/icons-material/Quiz";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AddCircleOutlineIcon  from "@mui/icons-material/AddCircleOutline";
import PeopleAltIcon         from "@mui/icons-material/PeopleAlt";
import AssignmentIcon        from "@mui/icons-material/Assignment";
import HubIcon               from "@mui/icons-material/Hub";
import TrendingUpIcon        from "@mui/icons-material/TrendingUp";
import UploadFileIcon        from "@mui/icons-material/UploadFile";

// ── Animated SVG circuit traces ──────────────────────────────────────────────
function CircuitBg({ primary, secondary }) {
  const nodes = [
    [60,30],[180,60],[90,110],[250,40],[310,100],
    [195,145],[135,185],[370,65],[410,155],[300,190],
  ].map(([x,y],i) => ({ x, y, id: i }));
  const edges = [[0,1],[1,2],[1,3],[3,4],[4,5],[2,5],[1,5],[4,7],[6,5],[7,8],[8,9],[5,9]];

  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.13 }}
      viewBox="0 0 480 230" preserveAspectRatio="xMidYMid slice">
      {edges.map(([a,b],i) => (
        <motion.line key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke={primary} strokeWidth="0.8"
          initial={{ pathLength:0, opacity:0 }}
          animate={{ pathLength:[0,1,1,0], opacity:[0,0.7,0.7,0] }}
          transition={{ duration:6, delay:i*0.35, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
      {nodes.map(n => (
        <motion.circle key={n.id} cx={n.x} cy={n.y} r="2.5" fill={primary}
          animate={{ opacity:[0.25,1,0.25], scale:[0.8,1.3,0.8] }}
          transition={{ duration:3+n.id*0.2, repeat:Infinity, delay:n.id*0.25, ease:"easeInOut" }}
        />
      ))}
    </svg>
  );
}

// ── Mini sparkline bar chart ─────────────────────────────────────────────────
function MiniChart({ color, data }) {
  const max = Math.max(...data);
  return (
    <Box sx={{ display:"flex", alignItems:"flex-end", gap:"3px", height:28 }}>
      {data.map((v,i) => (
        <motion.div key={i}
          initial={{ scaleY:0 }} animate={{ scaleY: v/max }}
          transition={{ delay:0.5+i*0.05, duration:0.6, ease:[0.34,1.56,0.64,1] }}
          style={{ width:4, height:"100%", background:`linear-gradient(180deg, ${color}, ${color}44)`,
            borderRadius:3, transformOrigin:"bottom", opacity:0.85 }}
        />
      ))}
    </Box>
  );
}

const STATS = [
  { title:"Total Questions", value:120, icon:<QuizIcon />,              color:"#22d3ee",  data:[40,55,48,70,62,80,78,92,85,120] },
  { title:"Admin Created",   value:40,  icon:<AdminPanelSettingsIcon />, color:"#d946ef",  data:[10,15,20,18,25,28,32,35,38,40]  },
  { title:"Active Sessions", value:8,   icon:<AssignmentIcon />,         color:"#818cf8",  data:[2,3,4,3,5,6,5,7,6,8]           },
];

const ACTIONS = [
  { label:"Add New MCQ",         desc:"Create and manage admin questions manually",       icon:<AddCircleOutlineIcon />, path:"/admin/mcq/add",    color:"#22d3ee" },
  { label:"Manage Test Sessions",desc:"Create, assign and control test sessions",         icon:<AssignmentIcon />,       path:"/admin/sessions",  color:"#d946ef" },
  { label:"User Management",     desc:"View, block or manage platform users",             icon:<PeopleAltIcon />,        path:"/admin/users",     color:"#818cf8" },
  { label:"Bulk Upload MCQ",     desc:"Upload multiple questions via file",               icon:<UploadFileIcon />,       path:"/admin/mcq/bulk",  color:"#fbbf24" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const theme    = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;

  return (
    <Box sx={{ display:"flex", minHeight:"100vh", background:bg, position:"relative" }}>

      {/* ── Ambient glows ── */}
      <Box sx={{ position:"fixed", top:"-8%", left:"45%", width:520, height:520,
        borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter:"blur(65px)", zIndex:0 }} />
      <Box sx={{ position:"fixed", bottom:"5%", right:"2%", width:360, height:360,
        borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter:"blur(55px)", zIndex:0 }} />

      <Box sx={{ position:"relative", zIndex:20 }}><AdminSidebar /></Box>

      <Box sx={{ flex:1, p:{ xs:2, md:"36px 32px" }, position:"relative", zIndex:2 }}>

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity:0, y:-18 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.55 }}>
          <Box sx={{ mb:4 }}>
            <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
              <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                ADMIN // CONTROL_PANEL
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily:"'Exo 2', sans-serif", fontWeight:900,
              fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
              background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              Admin Dashboard
            </Typography>
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
              color:textSec, fontSize:"0.85rem", mt:0.4 }}>
              Welcome back — manage your platform from one powerful hub
            </Typography>
          </Box>
        </motion.div>

        {/* ── HERO CARD ── */}
        <motion.div initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:0.1, duration:0.6 }}>
          <Box sx={{
            borderRadius:"18px", p:"28px 32px", mb:4, position:"relative", overflow:"hidden",
            background:`linear-gradient(135deg, #0c2340 0%, #0d1f3c 50%, ${paper} 100%)`,
            border:`1px solid rgba(34,211,238,0.18)`,
            boxShadow:`0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(34,211,238,0.08)`,
            "&::before":{ content:'""', position:"absolute", top:0, left:0, right:0, height:"2px",
              background:`linear-gradient(90deg, transparent, ${primary}80, ${secondary}60, transparent)` },
          }}>
            <CircuitBg primary={primary} secondary={secondary} />
            <Box sx={{ position:"relative", zIndex:2 }}>
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.7, mb:0.8 }}>
                // SYSTEM_STATUS :: ONLINE
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif", fontWeight:900,
                fontSize:{ xs:"1.5rem", md:"1.9rem" }, color:textPri, mb:0.5, lineHeight:1.1 }}>
                Welcome Back, Admin 👋
              </Typography>
              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                color:"rgba(148,163,184,0.85)", fontSize:"0.88rem", mb:3, maxWidth:480 }}>
                Manage questions, users and AI generation from one powerful dashboard
              </Typography>

              <Box sx={{ display:"flex", gap:1.5, flexWrap:"wrap" }}>
                {[
                  { label:"Add New MCQ",   icon:<AddCircleOutlineIcon />, path:"/admin/mcq/add",
                    bg:`linear-gradient(135deg, #0891b2, ${primary})`, dark:true },
                  { label:"Manage Users",  icon:<PeopleAltIcon />, path:"/admin/users",
                    bg:"transparent", border:true },
                ].map(btn => (
                  <motion.div key={btn.label} whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}>
                    <Box onClick={() => navigate(btn.path)} sx={{
                      display:"flex", alignItems:"center", gap:0.8,
                      px:2.5, py:"10px", borderRadius:"10px", cursor:"pointer",
                      background: btn.dark ? btn.bg : "rgba(34,211,238,0.06)",
                      border: btn.border ? `1px solid rgba(34,211,238,0.4)` : `1px solid ${primary}50`,
                      boxShadow: btn.dark ? `0 4px 18px ${primary}40` : "none",
                      transition:"all 0.25s",
                      "&:hover": btn.dark
                        ? { boxShadow:`0 8px 28px ${primary}55` }
                        : { background:"rgba(34,211,238,0.12)", border:`1px solid rgba(34,211,238,0.6)` },
                    }}>
                      <Box sx={{ color: btn.dark ? "#030712" : primary,
                        "& svg":{ fontSize:"1rem" } }}>{btn.icon}</Box>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontWeight:800, fontSize:"0.85rem",
                        color: btn.dark ? "#030712" : primary,
                        letterSpacing:"0.04em", textTransform:"uppercase" }}>
                        {btn.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* ── STAT CARDS ── */}
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.52rem", color:"rgba(71,85,105,0.85)",
          letterSpacing:"0.18em", mb:1.5 }}>
          // PLATFORM_METRICS
        </Typography>

        <Grid container spacing={2.5} sx={{ mb:4 }}>
          {STATS.map((s, i) => (
            <Grid item xs={12} sm={4} key={s.title}>
              <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.18+i*0.08, type:"spring", stiffness:180 }}
                whileHover={{ y:-5, transition:{ type:"spring", stiffness:380 } }}>
                <Box sx={{
                  borderRadius:"14px", p:"18px 20px",
                  background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                  border:`1px solid rgba(34,211,238,0.12)`,
                  boxShadow:`0 4px 24px rgba(0,0,0,0.35)`,
                  position:"relative", overflow:"hidden",
                  transition:"border-color 0.25s, box-shadow 0.25s",
                  "&:hover":{ borderColor:`${s.color}40`, boxShadow:`0 10px 36px ${s.color}18` },
                  "&::before":{ content:'""', position:"absolute",
                    top:0, left:0, right:0, height:"2px",
                    background:`linear-gradient(90deg, transparent, ${s.color}80, transparent)` },
                }}>
                  <Box sx={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", mb:1.5 }}>
                    <Box>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontSize:"0.68rem", color:textSec, letterSpacing:"0.08em",
                        textTransform:"uppercase", mb:0.4 }}>
                        {s.title}
                      </Typography>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontWeight:900, fontSize:"2rem", color:textPri, lineHeight:1,
                        textShadow:`0 0 20px ${s.color}50` }}>
                        {s.value}
                      </Typography>
                    </Box>
                    <Box sx={{ width:36, height:36, borderRadius:"10px",
                      background:`${s.color}18`, border:`1px solid ${s.color}35`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:s.color, "& svg":{ fontSize:"1.1rem" } }}>
                      {s.icon}
                    </Box>
                  </Box>
                  <MiniChart color={s.color} data={s.data} />
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* ── QUICK ACTIONS ── */}
        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.52rem", color:"rgba(71,85,105,0.85)",
          letterSpacing:"0.18em", mb:1.5 }}>
          // QUICK_ACTIONS
        </Typography>

        <Grid container spacing={2.5}>
          {ACTIONS.map((a, i) => (
            <Grid item xs={12} sm={6} md={3} key={a.label}>
              <motion.div initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.3+i*0.07, type:"spring", stiffness:160 }}
                whileHover={{ y:-6, transition:{ type:"spring", stiffness:350 } }}>
                <Box onClick={() => navigate(a.path)} sx={{
                  borderRadius:"14px", p:"20px 18px", cursor:"pointer",
                  background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                  border:`1px solid rgba(34,211,238,0.1)`,
                  boxShadow:`0 4px 20px rgba(0,0,0,0.3)`,
                  position:"relative", overflow:"hidden",
                  transition:"all 0.25s",
                  "&:hover":{ borderColor:`${a.color}40`,
                    boxShadow:`0 12px 36px ${a.color}18`,
                    "& .action-arrow":{ opacity:1, transform:"translateX(0)" } },
                  "&::before":{ content:'""', position:"absolute",
                    top:0, left:0, bottom:0, width:"3px",
                    background:`linear-gradient(180deg, ${a.color}, ${a.color}44)`,
                    boxShadow:`0 0 8px ${a.color}60` },
                }}>
                  <Box sx={{ width:40, height:40, borderRadius:"10px", mb:1.5,
                    background:`${a.color}15`, border:`1px solid ${a.color}30`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:a.color, "& svg":{ fontSize:"1.2rem" } }}>
                    {a.icon}
                  </Box>

                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontWeight:700, fontSize:"0.9rem", color:textPri, mb:0.5 }}>
                    {a.label}
                  </Typography>
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontSize:"0.75rem", color:textSec, lineHeight:1.5 }}>
                    {a.desc}
                  </Typography>

                  <Typography className="action-arrow"
                    sx={{ color:a.color, fontSize:"1rem", opacity:0,
                      transform:"translateX(-8px)",
                      transition:"all 0.25s", mt:1.5 }}>
                    →
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ height:40 }} />
      </Box>
    </Box>
  );
}

