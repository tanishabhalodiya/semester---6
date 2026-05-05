import { useEffect, useState } from "react";
import api from "../api/axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import Sidebar         from "../components/Sidebar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HubIcon         from "@mui/icons-material/Hub";
import PersonIcon      from "@mui/icons-material/Person";
import CodeIcon        from "@mui/icons-material/Code";

const MEDAL = ["#FFD700", "#C0C0C0", "#CD7F32"]; // gold, silver, bronze

export default function Leaderboard() {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const theme   = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const success   = theme.palette.success.main;

  useEffect(() => {
    api.get("/TestSessions").then(res => {
      setData(res.data.filter(x => x.score !== null).sort((a, b) => b.score - a.score));
    }).finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: bg, position: "relative" }}>
      <Box sx={{ position: "fixed", top: "-8%", left: "45%", width: 480, height: 480,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter: "blur(65px)", zIndex: 0 }} />
      <Box sx={{ position: "fixed", bottom: "5%", right: "2%", width: 340, height: 340,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter: "blur(55px)", zIndex: 0 }} />

      <Box sx={{ position: "relative", zIndex: 20 }}><Sidebar /></Box>

      <Box sx={{ flex: 1, p: { xs: 2, md: "36px 32px" }, position: "relative", zIndex: 2 }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.6 }}>
              <HubIcon sx={{ color: primary, fontSize: "0.85rem" }} />
              <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.56rem", color: primary, letterSpacing: "0.2em", opacity: 0.8 }}>
                RANKINGS // GLOBAL_BOARD
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily: "'Exo 2', sans-serif", fontWeight: 900,
              fontSize: { xs: "1.7rem", md: "2.1rem" }, lineHeight: 1.1,
              background: `linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Leaderboard
            </Typography>
            <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
              color: textSec, fontSize: "0.85rem", mt: 0.4 }}>
              {data.length} participants ranked globally
            </Typography>
          </Box>
        </motion.div>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: primary }} />
          </Box>
        ) : (
          <>
            {/* Top 3 podium */}
            {data.length >= 3 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}>
                <Box sx={{ display: "flex", gap: 2, mb: 4,
                  alignItems: "flex-end", justifyContent: "center" }}>
                  {[1, 0, 2].map(rank => {
                    const u = data[rank];
                    if (!u) return null;
                    const isFirst = rank === 0;
                    const medal   = MEDAL[rank];
                    return (
                      <Box key={rank} sx={{
                        flex: 1, maxWidth: 200, textAlign: "center",
                        borderRadius: "14px", p: "20px 16px",
                        pb: isFirst ? "28px" : "20px",
                        background: `linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                        border: `1px solid ${medal}35`,
                        boxShadow: `0 4px 24px ${medal}18`,
                        order: rank === 1 ? 0 : rank === 0 ? 1 : 2,
                        transform: isFirst ? "none" : "translateY(12px)",
                      }}>
                        <Box sx={{ width: isFirst ? 52 : 42, height: isFirst ? 52 : 42,
                          borderRadius: "50%", mx: "auto", mb: 1,
                          background: `${medal}22`, border: `2px solid ${medal}55`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          boxShadow: `0 0 18px ${medal}30` }}>
                          {isFirst
                            ? <EmojiEventsIcon sx={{ color: medal, fontSize: "1.4rem" }} />
                            : <PersonIcon sx={{ color: medal, fontSize: "1.2rem" }} />}
                        </Box>
                        <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.55rem", color: medal, letterSpacing: "0.12em", mb: 0.3 }}>
                          RANK #{rank + 1}
                        </Typography>
                        <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                          fontWeight: 700, fontSize: "0.82rem", color: textPri, mb: 0.5 }}>
                          User {u.userId}
                        </Typography>
                        <Box sx={{ px: 1.5, py: "4px", borderRadius: "7px", display: "inline-block",
                          background: `${medal}18`, border: `1px solid ${medal}40` }}>
                          <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                            fontWeight: 900, fontSize: "1.1rem", color: medal }}>
                            {u.score}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </motion.div>
            )}

            {/* Full list */}
            {data.map((u, i) => {
              const medal   = i < 3 ? MEDAL[i] : null;
              const rowColor = medal || primary;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04, type: "spring", stiffness: 180 }}>
                  <Box sx={{
                    borderRadius: "12px", p: "14px 20px", mb: 1.5,
                    background: `linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
                    border: `1px solid ${medal ? medal + "25" : "rgba(34,211,238,0.1)"}`,
                    boxShadow: medal ? `0 4px 18px ${medal}12` : "none",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 2,
                    transition: "all 0.22s",
                    "&:hover": { borderColor: `${rowColor}35`,
                      boxShadow: `0 6px 22px ${rowColor}12` },
                    "&::before": i < 3 ? { content: '""', position: "absolute",
                      left: 0, top: "15%", bottom: "15%", width: "3px",
                      background: medal, borderRadius: 99 } : {},
                    position: "relative", overflow: "hidden",
                  }}>
                    {/* Rank */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.8 }}>
                      <Box sx={{ width: 34, height: 34, borderRadius: "9px", flexShrink: 0,
                        background: medal ? `${medal}18` : `${primary}10`,
                        border: `1px solid ${medal ? medal + "40" : primary + "25"}`,
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {medal
                          ? <EmojiEventsIcon sx={{ color: medal, fontSize: "1rem" }} />
                          : <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                              fontSize: "0.65rem", color: primary, fontWeight: 700 }}>
                              {i + 1}
                            </Typography>}
                      </Box>

                      <Box>
                        <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                          fontWeight: 700, fontSize: "0.9rem",
                          color: medal || textPri }}>
                          User {u.userId}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CodeIcon sx={{ color: textSec, fontSize: "0.7rem" }} />
                          <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                            fontSize: "0.55rem", color: textSec, letterSpacing: "0.08em" }}>
                            {u.skill?.skillName || "GENERAL"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Score */}
                    <Box sx={{ px: 2, py: "6px", borderRadius: "8px",
                      background: medal ? `${medal}15` : `${success}12`,
                      border: `1px solid ${medal ? medal + "35" : success + "30"}` }}>
                      <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                        fontWeight: 900, fontSize: "1rem",
                        color: medal || success }}>
                        {u.score}
                        <Box component="span" sx={{ fontFamily: "'Share Tech Mono', monospace",
                          fontSize: "0.55rem", color: textSec, ml: 0.5 }}>pts</Box>
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </>
        )}
      </Box>
    </Box>
  );
}
// import { useEffect, useState } from "react";
// import api from "../api/axios";
// import {
//   Box,
//   Typography,
//   Card,
//   Stack,
//   Avatar,
//   Chip
// } from "@mui/material";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// import Sidebar from "../components/Sidebar";

// export default function Leaderboard() {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     // TEMP: fetch all sessions, later make proper endpoint
//     api.get("/TestSessions").then(res => {
//       const sorted = res.data
//         .filter(x => x.score !== null)
//         .sort((a, b) => b.score - a.score);
//       setData(sorted);
//     });
//   }, []);

//   return (
//     <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F4F8FC" }}>
//       <Sidebar />

//       <Box sx={{ flex: 1, p: 4 }}>
//         <Typography variant="h4" fontWeight={700} mb={3}>
//           🏆 Leaderboard
//         </Typography>

//         {data.map((u, index) => (
//           <Card
//             key={index}
//             sx={{
//               p: 3,
//               mb: 2,
//               borderRadius: 4,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
//             }}
//           >
//             <Stack direction="row" alignItems="center" spacing={2}>
//               <Avatar
//                 sx={{
//                   bgcolor: index === 0 ? "#FACC15" : "#2563EB",
//                   color: "white"
//                 }}
//               >
//                 <EmojiEventsIcon />
//               </Avatar>

//               <Box>
//                 <Typography fontWeight={700}>
//                   Rank #{index + 1}
//                 </Typography>
//                 <Typography color="text.secondary">
//                   User ID: {u.userId}
//                 </Typography>
//               </Box>
//             </Stack>

//             <Stack direction="row" spacing={2}>
//               <Chip label={`Skill: ${u.skill?.skillName || "N/A"}`} />
//               <Chip
//                 label={`Score: ${u.score}`}
//                 color="success"
//                 sx={{ fontWeight: 700 }}
//               />
//             </Stack>
//           </Card>
//         ))}
//       </Box>
//     </Box>
//   );  
// }
