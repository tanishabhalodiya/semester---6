import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Box, Typography, Grid, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import PersonIcon      from "@mui/icons-material/Person";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon  from "@mui/icons-material/Visibility";
import GroupIcon       from "@mui/icons-material/Group";
import HubIcon         from "@mui/icons-material/Hub";
import AdminSidebar    from "../../components/AdminSidebar";

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const error     = theme.palette.error.main;
  const violet    = theme.palette.info.main;

  const loadUsers = async () => {
    try {
      const res = await api.get("/Users");
      setUsers(res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/Users/${id}`);
      loadUsers();
    } catch { alert("Failed to delete user"); }
  };

  // Unique color per user avatar based on index
  const avatarColors = [primary, secondary, violet,
    theme.palette.success.main, theme.palette.warning.main];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: bg, position: "relative" }}>
      {/* Ambient glows */}
      <Box sx={{ position: "fixed", top: "-8%", left: "45%", width: 480, height: 480,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter: "blur(65px)", zIndex: 0 }} />
      <Box sx={{ position: "fixed", bottom: "5%", right: "2%", width: 340, height: 340,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter: "blur(55px)", zIndex: 0 }} />

      <Box sx={{ position: "relative", zIndex: 20 }}><AdminSidebar /></Box>

      <Box sx={{ flex: 1, p: { xs: 2, md: "36px 32px" }, position: "relative", zIndex: 2 }}>

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
                  ADMIN // USER_MANAGEMENT
                </Typography>
              </Box>
              <Typography sx={{
                fontFamily: "'Exo 2', sans-serif", fontWeight: 900,
                fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.1,
                background: `linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                User Management
              </Typography>
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                color: textSec, fontSize: "0.85rem", mt: 0.4 }}>
                {users.length} registered user{users.length !== 1 ? "s" : ""} in the system
              </Typography>
            </Box>

            {/* Total badge */}
            <Box sx={{ px: 2.5, py: 1.2, borderRadius: "12px",
              background: `${primary}12`, border: `1px solid ${primary}30`,
              display: "flex", alignItems: "center", gap: 1 }}>
              <GroupIcon sx={{ color: primary, fontSize: "1.1rem" }} />
              <Box>
                <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.5rem", color: primary, letterSpacing: "0.15em" }}>
                  TOTAL_USERS
                </Typography>
                <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                  fontWeight: 900, fontSize: "1.2rem", color: textPri, lineHeight: 1 }}>
                  {users.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </motion.div>

        {/* ── LOADING ── */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: primary }} />
          </Box>
        )}

        {/* ── USER GRID ── */}
        <Grid container spacing={2.5}>
          {users.map((u, i) => {
            const accentColor = avatarColors[i % avatarColors.length];
            return (
              <Grid item xs={12} sm={6} md={4} key={u.userId}>
                <motion.div
                  initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 160 }}
                  whileHover={{ y: -6, transition: { type: "spring", stiffness: 350 } }}>
                  <Box sx={{
                    borderRadius: "16px",
                    background: `linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                    border: `1px solid rgba(34,211,238,0.12)`,
                    boxShadow: `0 4px 24px rgba(0,0,0,0.3)`,
                    overflow: "hidden", position: "relative",
                    transition: "border-color 0.25s, box-shadow 0.25s",
                    "&:hover": {
                      borderColor: `${accentColor}40`,
                      boxShadow: `0 12px 36px ${accentColor}18`,
                    },
                    // Top color line per user
                    "&::before": { content: '""', position: "absolute",
                      top: 0, left: "15%", right: "15%", height: "2px",
                      background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)`,
                      boxShadow: `0 0 10px ${accentColor}50` },
                  }}>
                    {/* Card body */}
                    <Box sx={{ p: "24px 20px", textAlign: "center" }}>
                      {/* Avatar */}
                      <motion.div
                        whileHover={{ scale: 1.08 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        style={{ display: "inline-block", marginBottom: 12 }}>
                        <Box sx={{ position: "relative", display: "inline-block" }}>
                          <Box sx={{ width: 64, height: 64, borderRadius: "50%",
                            background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
                            border: `2px solid ${accentColor}50`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 0 20px ${accentColor}25` }}>
                            <PersonIcon sx={{ color: accentColor, fontSize: "1.8rem" }} />
                          </Box>
                          {/* Online dot */}
                          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            style={{ position: "absolute", bottom: 2, right: 2,
                              width: 11, height: 11, borderRadius: "50%",
                              background: theme.palette.success.main,
                              border: `2px solid ${paper}`,
                              boxShadow: `0 0 6px ${theme.palette.success.main}` }}
                          />
                        </Box>
                      </motion.div>

                      {/* Name */}
                      <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                        fontWeight: 700, fontSize: "0.95rem", color: textPri,
                        mb: 0.4, lineHeight: 1.2 }}>
                        {u.name}
                      </Typography>

                      {/* Email */}
                      <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                        fontSize: "0.62rem", color: textSec, letterSpacing: "0.04em",
                        mb: 0.6, opacity: 0.8 }}>
                        {u.email}
                      </Typography>

                      {/* User ID chip */}
                      <Box sx={{ display: "inline-flex", alignItems: "center",
                        px: 1.2, py: "3px", borderRadius: "6px", mb: 2,
                        background: `${accentColor}10`, border: `1px solid ${accentColor}25` }}>
                        <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.52rem", color: accentColor, letterSpacing: "0.12em" }}>
                          UID_{String(u.userId).padStart(4, "0")}
                        </Typography>
                      </Box>

                      {/* Divider */}
                      <Box sx={{ height: "1px", background: "rgba(34,211,238,0.08)", mb: 2 }} />

                      {/* Action buttons */}
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                          <Box onClick={() => handleDelete(u.userId)} sx={{
                            display: "flex", alignItems: "center", gap: 0.6,
                            px: 1.8, py: "7px", borderRadius: "8px", cursor: "pointer",
                            background: "rgba(248,113,113,0.08)",
                            border: "1px solid rgba(248,113,113,0.25)",
                            transition: "all 0.22s",
                            "&:hover": { background: "rgba(248,113,113,0.18)",
                              border: "1px solid rgba(248,113,113,0.5)" },
                          }}>
                            <DeleteOutlineIcon sx={{ color: error, fontSize: "0.9rem" }} />
                            <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                              fontSize: "0.75rem", color: error, fontWeight: 600 }}>
                              Block
                            </Typography>
                          </Box>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                          <Box sx={{
                            display: "flex", alignItems: "center", gap: 0.6,
                            px: 1.8, py: "7px", borderRadius: "8px", cursor: "pointer",
                            background: `${accentColor}10`,
                            border: `1px solid ${accentColor}30`,
                            transition: "all 0.22s",
                            "&:hover": { background: `${accentColor}20`,
                              border: `1px solid ${accentColor}55` },
                          }}>
                            <VisibilityIcon sx={{ color: accentColor, fontSize: "0.9rem" }} />
                            <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                              fontSize: "0.75rem", color: accentColor, fontWeight: 600 }}>
                              View
                            </Typography>
                          </Box>
                        </motion.div>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        <Box sx={{ height: 40 }} />
      </Box>
    </Box>
  );
}
// import { useEffect, useState } from "react";
// import api from "../../api/axios";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Avatar,
//   Grid,
//   Stack,
//   Button
// } from "@mui/material";
// import PersonIcon from "@mui/icons-material/Person";
// import AdminSidebar from "../../components/AdminSidebar";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);

//   const loadUsers = async () => {
//     const res = await api.get("/Users");
//     setUsers(res.data);
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const handleDelete = async (id) => {
//   if (!window.confirm("Are you sure you want to delete this user?"))
//     return;

//   try {
//     await api.delete(`/Users/${id}`);
//     loadUsers(); // 🔁 refresh list
//   } catch (err) {
//     alert("Failed to delete user");
//   }
//   };


//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F5F7FB" }}>
//       <AdminSidebar />

//       <Box sx={{ flex: 1, p: 4 }}>
//         <Typography variant="h4" fontWeight={700} mb={3}>
//           👥 User Management
//         </Typography>

//         <Grid container spacing={3}>
//           {users.map((u) => (
//             <Grid item xs={12} md={4} key={u.userId}>
//               <Card
//                 sx={{
//                   borderRadius: 4,
//                   boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
//                   transition: "0.3s",
//                   "&:hover": {
//                     transform: "translateY(-6px)",
//                     boxShadow: "0 12px 35px rgba(0,0,0,0.12)"
//                   }
//                 }}
//               >
//                 <CardContent>
//                   <Stack alignItems="center" spacing={2}>
//                     <Avatar
//                       sx={{
//                         bgcolor: "#2563EB",
//                         width: 64,
//                         height: 64
//                       }}
//                     >
//                       <PersonIcon fontSize="large" />
//                     </Avatar>

//                     <Typography fontWeight={700}>
//                       {u.name}
//                     </Typography>

//                     <Typography color="text.secondary" fontSize={14}>
//                       {u.email}
//                     </Typography>

//                     <Stack direction="row" spacing={1} mt={2}>
//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="error"
//                         onClick={() => handleDelete(u.userId)}>
//                         Block
//                       </Button>


//                       <Button
//                         size="small"
//                         variant="outlined"
//                         color="primary"
//                       >
//                         View
//                       </Button>
//                     </Stack>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// }
