import { Box, List, ListItem, Typography } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import DashboardIcon   from "@mui/icons-material/Dashboard";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import UploadFileIcon  from "@mui/icons-material/UploadFile";
import BookmarkIcon    from "@mui/icons-material/Bookmark";
import TrendingUpIcon  from "@mui/icons-material/TrendingUp";
import LogoutIcon      from "@mui/icons-material/Logout";
import HubIcon         from "@mui/icons-material/Hub";
import { useTheme }    from "@mui/material/styles";

const menuItems = [
  { text: "Dashboard",          path: "/user/dashboard",   icon: <DashboardIcon   sx={{ fontSize: "1.1rem" }} /> },
  { text: "Generate",           path: "/create",           icon: <AutoAwesomeIcon sx={{ fontSize: "1.1rem" }} /> },
  { text: "Generate from File", path: "/generate-file",    icon: <UploadFileIcon  sx={{ fontSize: "1.1rem" }} /> },
  { text: "Saved",              path: "/saved",            icon: <BookmarkIcon    sx={{ fontSize: "1.1rem" }} /> },
  { text: "Performance",        path: "/user/performance", icon: <TrendingUpIcon  sx={{ fontSize: "1.1rem" }} /> },
];

export default function Sidebar() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const { logout } = useAuth();
  const theme      = useTheme();

  // Pull directly from theme.js palette
  const primary   = theme.palette.primary.main;       // #22d3ee  (cyan)
  const secondary = theme.palette.secondary.main;     // #d946ef  (magenta)
  const bg        = theme.palette.background.default; // #030712
  const paper     = theme.palette.background.paper;   // #0a1628
  const textPri   = theme.palette.text.primary;       // #e0f2fe
  const textSec   = theme.palette.text.secondary;     // #7dd3fc
  const success   = theme.palette.success.main;       // #34d399
  const error     = theme.palette.error.main;         // #f87171

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <Box sx={{
      width: 230,
      minHeight: "100vh",
      background: bg,
      borderRight: `1px solid rgba(34,211,238,0.1)`,
      display: "flex",
      flexDirection: "column",
      p: "20px 14px",
      position: "relative",
      zIndex: 10,
    }}>

      {/* ── LOGO ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Box sx={{
          display: "flex", alignItems: "center", gap: 1.2,
          mb: 3, pb: 2.5,
          borderBottom: `1px solid rgba(34,211,238,0.08)`,
        }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: "9px",
            background: `linear-gradient(135deg, ${primary}25, ${secondary}15)`,
            border: `1px solid ${primary}40`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 14px ${primary}25`,
          }}>
            <HubIcon sx={{ color: primary, fontSize: "1.1rem" }} />
          </Box>

          <Box>
            <Typography sx={{
              fontFamily: "'Exo 2', sans-serif",
              fontWeight: 800, fontSize: "1rem",
              color: textPri, letterSpacing: "0.05em", lineHeight: 1,
            }}>
              IQG
            </Typography>
            <Typography sx={{
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.5rem", color: primary,
              letterSpacing: "0.18em", opacity: 0.75,
            }}>
              AI PLATFORM
            </Typography>
          </Box>

          {/* Live dot */}
          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: "50%",
                background: success, boxShadow: `0 0 6px ${success}` }}
            />
          </Box>
        </Box>
      </motion.div>

      {/* ── CREATE BUTTON ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Box onClick={() => navigate("/create")} sx={{
            mb: 3, cursor: "pointer",
            borderRadius: "10px", p: "10px 14px",
            background: `linear-gradient(135deg, ${primary}20, ${secondary}12)`,
            border: `1px solid ${primary}35`,
            display: "flex", alignItems: "center", gap: 1.2,
            transition: "all 0.22s",
            "&:hover": {
              background: `linear-gradient(135deg, ${primary}30, ${secondary}20)`,
              border: `1px solid ${primary}55`,
              boxShadow: `0 4px 20px ${primary}20`,
            },
          }}>
            <AutoAwesomeIcon sx={{ color: primary, fontSize: "1rem" }} />
            <Typography sx={{
              fontFamily: "'Exo 2', sans-serif", fontWeight: 700,
              fontSize: "0.85rem", color: textPri,
            }}>
              ✦ Create New
            </Typography>
          </Box>
        </motion.div>
      </motion.div>

      {/* ── NAV LABEL ── */}
      <Typography sx={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: "0.54rem", color: "rgba(71,85,105,0.9)",
        letterSpacing: "0.18em", mb: 1, pl: 0.5,
      }}>
        MENU
      </Typography>

      {/* ── NAV ITEMS ── */}
      <List sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
        {menuItems.map((item, i) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.div key={item.text}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.14 + i * 0.07, type: "spring", stiffness: 200 }}>
              <ListItem disablePadding>
                <Box component={Link} to={item.path}
                  sx={{ textDecoration: "none", width: "100%" }}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                    <Box sx={{
                      display: "flex", alignItems: "center", gap: 1.3,
                      px: "11px", py: "9px", borderRadius: "9px",
                      position: "relative", overflow: "hidden",
                      cursor: "pointer", transition: "all 0.22s",
                      background: isActive ? `${primary}14` : "transparent",
                      border: `1px solid ${isActive ? primary + "35" : "transparent"}`,
                      "&:hover": {
                        background: `${primary}0e`,
                        border: `1px solid ${primary}25`,
                      },
                    }}>

                      {/* Active left bar */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0 }}
                            style={{
                              position: "absolute", left: 0,
                              top: "18%", bottom: "18%", width: 3,
                              borderRadius: 99,
                              background: primary,
                              boxShadow: `0 0 8px ${primary}`,
                            }}
                          />
                        )}
                      </AnimatePresence>

                      {/* Icon */}
                      <Box sx={{
                        color: isActive ? primary : textSec,
                        transition: "color 0.22s",
                        display: "flex", alignItems: "center",
                        opacity: isActive ? 1 : 0.65,
                      }}>
                        {item.icon}
                      </Box>

                      {/* Label */}
                      <Typography sx={{
                        fontFamily: "'Exo 2', sans-serif",
                        fontWeight: isActive ? 600 : 400,
                        fontSize: "0.85rem",
                        color: isActive ? primary : textSec,
                        transition: "color 0.22s",
                        opacity: isActive ? 1 : 0.8,
                      }}>
                        {item.text}
                      </Typography>

                      {/* Active dot */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          style={{ marginLeft: "auto" }}>
                          <Box sx={{
                            width: 5, height: 5, borderRadius: "50%",
                            background: primary,
                            boxShadow: `0 0 6px ${primary}`,
                          }} />
                        </motion.div>
                      )}
                    </Box>
                  </motion.div>
                </Box>
              </ListItem>
            </motion.div>
          );
        })}
      </List>

      {/* ── LOGOUT ── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}>
        <Box sx={{
          pt: 2, mt: 1,
          borderTop: `1px solid rgba(34,211,238,0.08)`,
        }}>
          <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}>
            <Box onClick={handleLogout} sx={{
              display: "flex", alignItems: "center", gap: 1.3,
              px: "11px", py: "9px", borderRadius: "9px",
              cursor: "pointer", transition: "all 0.22s",
              border: "1px solid transparent",
              "&:hover": {
                background: `${error}0e`,
                border: `1px solid ${error}25`,
              },
            }}>
              <Box sx={{ color: error, opacity: 0.7, display: "flex",
                alignItems: "center", transition: "opacity 0.2s",
                ".MuiBox-root:hover &": { opacity: 1 } }}>
                <LogoutIcon sx={{ fontSize: "1.1rem" }} />
              </Box>
              <Typography sx={{
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 400, fontSize: "0.85rem",
                color: error, opacity: 0.7,
                transition: "opacity 0.22s",
                ".MuiBox-root:hover &": { opacity: 1 },
              }}>
                Logout
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
}
// import { Box, Button, List, ListItem, Typography } from "@mui/material";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Sidebar() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { logout } = useAuth();

//   const menuItems = [
//     { text: "Dashboard", path: "/user/dashboard" },
//     { text: "Generate", path: "/create" },
//     { text: "Generate from File", path: "/generate-file" }, // ✅ NEW
//     { text: "Saved", path: "/saved" },
//     { text: "Performance", path: "/user/performance" }
//   ];

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <Box sx={{ width: 240, height: "100vh", bgcolor: "#EAF2FB", p: 3 }}>
//       <Typography variant="h6" fontWeight={700} mb={3}>
//         IQG
//       </Typography>

//       <Button
//         fullWidth
//         onClick={() => navigate("/create")}
//         sx={{ bgcolor: "#2563EB", color: "white", mb: 3 }}
//       >
//         ✨ Create New
//       </Button>

//       <List>
//         {menuItems.map(item => (
//           <ListItem
//             key={item.text}
//             component={Link}
//             to={item.path}
//             sx={{
//               cursor: "pointer",
//               borderRadius: 2,
//               bgcolor: location.pathname === item.path ? "#DBEAFE" : "transparent"
//             }}
//           >
//             {item.text}
//           </ListItem>
//         ))}
//       </List>

//       <Button
//         variant="outlined"
//         color="error"
//         fullWidth
//         onClick={handleLogout}
//       >
//         Logout
//       </Button>
//     </Box>
//   );
// }