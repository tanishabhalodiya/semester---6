import { Box, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import HubIcon              from "@mui/icons-material/Hub";
import DashboardIcon        from "@mui/icons-material/Dashboard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import QuizIcon             from "@mui/icons-material/Quiz";
import UploadFileIcon       from "@mui/icons-material/UploadFile";
import PeopleAltIcon        from "@mui/icons-material/PeopleAlt";
import AssignmentIcon       from "@mui/icons-material/Assignment";
import LogoutIcon           from "@mui/icons-material/Logout";
import StarIcon             from "@mui/icons-material/Star";

const menu = [
  { label: "Dashboard",   path: "/admin/dashboard",  icon: <DashboardIcon /> },
  { label: "Add MCQ",     path: "/admin/mcq/add",    icon: <AddCircleOutlineIcon /> },
  { label: "MCQ List",    path: "/admin/mcq",         icon: <QuizIcon /> },
  { label: "Bulk Upload", path: "/admin/mcq/bulk",    icon: <UploadFileIcon /> },
  { label: "Users",       path: "/admin/users",       icon: <PeopleAltIcon /> },
  { label: "Sessions",    path: "/admin/sessions",    icon: <AssignmentIcon /> },
  { label: "Feedbacks",   path: "/admin/feedbacks",   icon: <StarIcon /> },
];

function CircuitDeco({ primary }) {
  return (
    <svg style={{ position:"absolute", bottom:0, left:0, width:"100%",
      height:180, opacity:0.07, pointerEvents:"none" }}
      viewBox="0 0 240 180" preserveAspectRatio="xMidYMax slice">
      {[30,70,120,160].map((y,i) => (
        <motion.line key={i} x1="0" y1={y} x2="240" y2={y}
          stroke={primary} strokeWidth="0.8"
          initial={{ pathLength:0 }} animate={{ pathLength:[0,1,1,0] }}
          transition={{ duration:5, delay:i*0.7, repeat:Infinity, ease:"easeInOut" }} />
      ))}
      {[40,80,130,180,220].map((x,i) => (
        <motion.line key={`v${i}`} x1={x} y1="0" x2={x} y2="180"
          stroke={primary} strokeWidth="0.6"
          initial={{ pathLength:0 }} animate={{ pathLength:[0,1,1,0] }}
          transition={{ duration:4, delay:i*0.5+1, repeat:Infinity, ease:"easeInOut" }} />
      ))}
      {[[40,30],[80,70],[130,120],[180,160],[40,160],[220,70]].map(([cx,cy],i) => (
        <motion.circle key={`n${i}`} cx={cx} cy={cy} r="3" fill={primary}
          animate={{ opacity:[0.2,1,0.2] }}
          transition={{ duration:2.5+i*0.3, repeat:Infinity, delay:i*0.4 }} />
      ))}
    </svg>
  );
}

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const navigate     = useNavigate();
  const theme        = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const errorC    = theme.palette.error.main;

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login"); // 🔴 change to your actual login route if different
  };

  return (
    <Box sx={{
      width:232, minHeight:"100vh", flexShrink:0,
      background:`linear-gradient(180deg, #050f1f 0%, #080e1c 60%, #030712 100%)`,
      borderRight:`1px solid rgba(34,211,238,0.1)`,
      boxShadow:`4px 0 32px rgba(0,0,0,0.5)`,
      display:"flex", flexDirection:"column",
      position:"relative", overflow:"hidden",
    }}>

      {/* Top glow */}
      <Box sx={{
        position:"absolute", top:"-60px", left:"50%", transform:"translateX(-50%)",
        width:200, height:200, borderRadius:"50%", pointerEvents:"none",
        background:`radial-gradient(circle, ${primary}18 0%, transparent 70%)`,
        filter:"blur(30px)",
      }} />

      <CircuitDeco primary={primary} />

      {/* ── BRAND ── */}
      <Box sx={{
        px:2.5, pt:3, pb:2.5,
        borderBottom:`1px solid rgba(34,211,238,0.08)`,
        position:"relative", zIndex:2,
      }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:1.2, mb:0.5 }}>
          <Box sx={{ position:"relative" }}>
            <Box sx={{
              width:34, height:34, borderRadius:"9px",
              background:`linear-gradient(135deg, ${primary}30, ${secondary}15)`,
              border:`1.5px solid ${primary}50`,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 0 16px ${primary}30`,
            }}>
              <HubIcon sx={{ color:primary, fontSize:"1.1rem" }} />
            </Box>
            <motion.div
              animate={{ scale:[1,1.45,1], opacity:[0.6,0,0.6] }}
              transition={{ duration:2.8, repeat:Infinity }}
              style={{
                position:"absolute", inset:-4, borderRadius:13,
                border:`1px solid ${primary}55`, pointerEvents:"none",
              }} />
          </Box>
          <Box>
            <Typography sx={{
              fontFamily:"'Exo 2', sans-serif", fontWeight:900,
              fontSize:"1rem", lineHeight:1,
              background:`linear-gradient(115deg, ${textPri}, ${primary})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              IQG Admin
            </Typography>
            <Typography sx={{
              fontFamily:"'Share Tech Mono', monospace",
              fontSize:"0.46rem", color:primary, letterSpacing:"0.18em", opacity:0.75,
            }}>
              NEURAL_PANEL
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── NAV LABEL ── */}
      <Box sx={{ px:2.5, pt:2.5, pb:1, position:"relative", zIndex:2 }}>
        <Typography sx={{
          fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.48rem", color:"rgba(71,85,105,0.7)",
          letterSpacing:"0.2em", textTransform:"uppercase",
        }}>
          // NAVIGATION
        </Typography>
      </Box>

      {/* ── MENU ITEMS ── */}
      <Box sx={{ flex:1, px:1.5, pb:2, position:"relative", zIndex:2 }}>
        {menu.map((m, i) => {
          const isActive = pathname === m.path ||
            (m.path !== "/admin/dashboard" && pathname.startsWith(m.path));
          return (
            <motion.div key={m.path}
              initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:i * 0.06, type:"spring", stiffness:180 }}>
              <Box component={Link} to={m.path}
                sx={{ textDecoration:"none", display:"block", mb:0.5 }}>
                <Box sx={{
                  display:"flex", alignItems:"center", gap:1.2,
                  px:1.6, py:"10px", borderRadius:"10px",
                  position:"relative", overflow:"hidden",
                  cursor:"pointer", transition:"all 0.22s",
                  background: isActive
                    ? `linear-gradient(135deg, ${primary}18, ${primary}08)`
                    : "transparent",
                  border: isActive
                    ? `1px solid ${primary}35`
                    : "1px solid transparent",
                  boxShadow: isActive ? `0 4px 16px ${primary}15` : "none",
                  "&:hover": !isActive ? {
                    background:`rgba(34,211,238,0.06)`,
                    border:`1px solid rgba(34,211,238,0.15)`,
                  } : {},
                }}>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ scaleY:0 }} animate={{ scaleY:1 }} exit={{ scaleY:0 }}
                        transition={{ duration:0.25 }}
                        style={{
                          position:"absolute", left:0, top:"15%", bottom:"15%",
                          width:3, borderRadius:99,
                          background:`linear-gradient(180deg, ${primary}, ${secondary})`,
                          boxShadow:`0 0 8px ${primary}80`,
                          transformOrigin:"center",
                        }} />
                    )}
                  </AnimatePresence>

                  <Box sx={{
                    width:28, height:28, borderRadius:"7px", flexShrink:0,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background: isActive ? `${primary}20` : "rgba(34,211,238,0.05)",
                    border:`1px solid ${isActive ? primary + "40" : "rgba(34,211,238,0.1)"}`,
                    color: isActive ? primary : textSec,
                    transition:"all 0.22s",
                    "& svg":{ fontSize:"0.95rem" },
                  }}>
                    {m.icon}
                  </Box>

                  <Typography sx={{
                    fontFamily:"'Exo 2', sans-serif",
                    fontWeight: isActive ? 700 : 500,
                    fontSize:"0.88rem",
                    color: isActive ? primary : textSec,
                    transition:"color 0.22s",
                    letterSpacing: isActive ? "0.03em" : "0.01em",
                  }}>
                    {m.label}
                  </Typography>

                  {isActive && (
                    <Box sx={{ ml:"auto", flexShrink:0 }}>
                      <motion.div
                        animate={{ opacity:[0.4,1,0.4], scale:[0.8,1.1,0.8] }}
                        transition={{ duration:2, repeat:Infinity }}>
                        <Box sx={{
                          width:6, height:6, borderRadius:"50%",
                          background:primary, boxShadow:`0 0 8px ${primary}`,
                        }} />
                      </motion.div>
                    </Box>
                  )}
                </Box>
              </Box>
            </motion.div>
          );
        })}
      </Box>

      {/* ── LOGOUT BUTTON ── */}
      <Box sx={{ px:1.5, pb:1.5, position:"relative", zIndex:2 }}>
        {/* Divider */}
        <Box sx={{ height:"1px", background:"rgba(248,113,113,0.15)", mb:1.5, mx:0.5 }} />

        <motion.div
          initial={{ opacity:0, x:-18 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:menu.length * 0.06 + 0.06, type:"spring", stiffness:180 }}
          whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}>
          <Box onClick={handleLogout} sx={{
            display:"flex", alignItems:"center", gap:1.2,
            px:1.6, py:"10px", borderRadius:"10px",
            cursor:"pointer", transition:"all 0.25s",
            background:"rgba(248,113,113,0.06)",
            border:"1px solid rgba(248,113,113,0.2)",
            "&:hover":{
              background:"rgba(248,113,113,0.14)",
              border:"1px solid rgba(248,113,113,0.5)",
              boxShadow:`0 4px 18px rgba(248,113,113,0.18)`,
            },
          }}>
            {/* Icon */}
            <Box sx={{
              width:28, height:28, borderRadius:"7px", flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              background:"rgba(248,113,113,0.1)",
              border:"1px solid rgba(248,113,113,0.28)",
              transition:"all 0.22s",
              "& svg":{ fontSize:"0.95rem" },
            }}>
              <LogoutIcon sx={{ color:errorC }} />
            </Box>

            {/* Label */}
            <Typography sx={{
              fontFamily:"'Exo 2', sans-serif",
              fontWeight:600, fontSize:"0.88rem",
              color:errorC, letterSpacing:"0.02em",
            }}>
              Logout
            </Typography>

            {/* Arrow */}
            <Typography sx={{
              ml:"auto", fontFamily:"'Share Tech Mono', monospace",
              fontSize:"0.7rem", color:errorC, opacity:0.55,
            }}>
              →
            </Typography>
          </Box>
        </motion.div>
      </Box>

      {/* ── BOTTOM STATUS BAR ── */}
      <Box sx={{
        mx:1.5, mb:2, px:1.8, py:1.4, borderRadius:"10px",
        background:"rgba(34,211,238,0.04)",
        border:`1px solid rgba(34,211,238,0.1)`,
        position:"relative", zIndex:2,
      }}>
        <Box sx={{ display:"flex", alignItems:"center", gap:0.8, mb:0.5 }}>
          <motion.div animate={{ opacity:[1,0.3,1] }}
            transition={{ duration:2, repeat:Infinity }}>
            <Box sx={{
              width:6, height:6, borderRadius:"50%",
              background:theme.palette.success.main,
              boxShadow:`0 0 6px ${theme.palette.success.main}`,
            }} />
          </motion.div>
          <Typography sx={{
            fontFamily:"'Share Tech Mono', monospace",
            fontSize:"0.52rem", color:theme.palette.success.main,
            letterSpacing:"0.14em",
          }}>
            SYSTEM_ONLINE
          </Typography>
        </Box>
        <Typography sx={{
          fontFamily:"'Share Tech Mono', monospace",
          fontSize:"0.46rem", color:"rgba(71,85,105,0.6)",
          letterSpacing:"0.1em",
        }}>
          IQG_AI · v2.4.0
        </Typography>
      </Box>
    </Box>
  );
}