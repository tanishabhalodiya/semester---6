import {
  Box, FormControl, Select, MenuItem,
  InputLabel, Button, CircularProgress, Typography
} from "@mui/material";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function GenerateForm({ onGenerate, loading }) {
  const [skill,      setSkill]      = useState("");
  const [category,   setCategory]   = useState("");
  const [difficulty, setDifficulty] = useState("");

  const theme    = useTheme();
  const primary  = theme.palette.primary.main;
  const secondary= theme.palette.secondary.main;
  const paper    = theme.palette.background.paper;
  const textPri  = theme.palette.text.primary;
  const textSec  = theme.palette.text.secondary;
  const success  = theme.palette.success.main;
  const warning  = theme.palette.warning.main;
  const error    = theme.palette.error.main;

  const submit = (e) => {
    e.preventDefault();
    if (!skill || !category || !difficulty) { alert("Please select all filters"); return; }
    onGenerate({ skill, category, difficulty });
  };

  const selectSx = {
    fontFamily: "'Exo 2', sans-serif",
    color: textPri, fontSize: "0.9rem",
    background: paper,
    border: `1px solid rgba(34,211,238,0.18)`,
    borderRadius: "10px",
    transition: "all 0.25s",
    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
    "& .MuiSvgIcon-root": { color: primary },
    "&:hover": { border: `1px solid ${primary}50`, boxShadow: `0 0 12px ${primary}15` },
    "&.Mui-focused": { border: `1px solid ${primary}70`, boxShadow: `0 0 0 3px ${primary}15` },
  };

  const labelSx = {
    color: textSec, fontFamily: "'Exo 2', sans-serif", fontSize: "0.85rem",
    "&.Mui-focused": { color: primary },
    "&.MuiFormLabel-filled": { color: primary },
  };

  const menuProps = {
    PaperProps: {
      sx: {
        background: "#0d1f3c",
        border: `1px solid rgba(34,211,238,0.18)`,
        borderRadius: "10px", mt: 0.5,
        "& .MuiMenuItem-root": {
          fontFamily: "'Exo 2', sans-serif", fontSize: "0.88rem",
          color: textSec, py: 1, transition: "all 0.18s",
          "&:hover": { background: `${primary}15`, color: primary },
          "&.Mui-selected": {
            background: `${primary}18`, color: primary,
            "&:hover": { background: `${primary}25` },
          },
        },
      },
    },
  };

  const isReady = skill && category && difficulty;

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}>
      <Box component="form" onSubmit={submit} sx={{
        p: "26px 24px", mb: 4,
        borderRadius: "16px",
        background: `linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
        border: `1px solid rgba(34,211,238,0.13)`,
        boxShadow: `0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.06)`,
        position: "relative", overflow: "hidden",
        "&::before": {
          content: '""', position: "absolute",
          top: 0, left: "10%", right: "10%", height: "1.5px",
          background: `linear-gradient(90deg, transparent, ${primary}70, ${secondary}50, transparent)`,
        },
      }}>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 3 }}>
          <Box sx={{
            width: 32, height: 32, borderRadius: "8px",
            background: `${primary}18`, border: `1px solid ${primary}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AutoAwesomeIcon sx={{ color: primary, fontSize: "1rem" }} />
          </Box>
          <Box>
            <Typography sx={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700,
              fontSize: "1rem", color: textPri, lineHeight: 1 }}>
              Select Filters
            </Typography>
            <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.5rem", color: primary, letterSpacing: "0.15em", opacity: 0.75 }}>
              CONFIGURE_GENERATION
            </Typography>
          </Box>
        </Box>

        {/* Fields */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>

          <FormControl fullWidth>
            <InputLabel sx={labelSx}>Skill</InputLabel>
            <Select value={skill} label="Skill"
              onChange={e => setSkill(e.target.value)}
              sx={selectSx} MenuProps={menuProps}>
              <MenuItem value={1}>C</MenuItem>
              <MenuItem value={2}>Java</MenuItem>
              <MenuItem value={3}>Python</MenuItem>
              <MenuItem value={4}>.NET</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={labelSx}>Category</InputLabel>
            <Select value={category} label="Category"
              onChange={e => setCategory(e.target.value)}
              sx={selectSx} MenuProps={menuProps}>
              <MenuItem value={1}>Theory</MenuItem>
              <MenuItem value={2}>Coding</MenuItem>
              <MenuItem value={3}>MCQ</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={labelSx}>Difficulty</InputLabel>
            <Select value={difficulty} label="Difficulty"
              onChange={e => setDifficulty(e.target.value)}
              sx={selectSx} MenuProps={menuProps}>
              {[
                { val: "Easy",   color: success },
                { val: "Medium", color: warning },
                { val: "Hard",   color: error   },
              ].map(({ val, color }) => (
                <MenuItem key={val} value={val}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 7, height: 7, borderRadius: "50%",
                      background: color, boxShadow: `0 0 5px ${color}` }} />
                    {val}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Generate button */}
          <motion.div whileHover={{ scale: isReady ? 1.015 : 1 }}
            whileTap={{ scale: isReady ? 0.97 : 1 }}
            style={{ width: "100%" }}>
            <Button type="submit" fullWidth
              disabled={!isReady || loading}
              sx={{
                height: 52, borderRadius: "10px",
                fontFamily: "'Exo 2', sans-serif",
                fontWeight: 700, fontSize: "0.9rem",
                letterSpacing: "0.06em", textTransform: "uppercase",
                background: isReady && !loading
                  ? `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`
                  : "rgba(34,211,238,0.07)",
                color: isReady && !loading ? "#030712" : textSec,
                border: `1px solid ${isReady ? primary + "60" : "rgba(34,211,238,0.12)"}`,
                boxShadow: isReady && !loading ? `0 4px 20px ${primary}40` : "none",
                transition: "all 0.28s",
                "&:hover": isReady && !loading ? {
                  background: `linear-gradient(135deg, ${primary}, #67e8f9)`,
                  boxShadow: `0 8px 32px ${primary}60`,
                } : {},
                "&.Mui-disabled": {
                  background: "rgba(34,211,238,0.05)",
                  color: "rgba(125,211,252,0.3)",
                  border: "1px solid rgba(34,211,238,0.08)",
                },
              }}>
              {loading
                ? <CircularProgress size={20} sx={{ color: primary }} />
                : <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AutoAwesomeIcon sx={{ fontSize: "1rem" }} />
                    Generate
                  </Box>}
            </Button>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
}
// import {
//   Paper,
//   Box,
//   FormControl,
//   Select,
//   MenuItem,
//   InputLabel,
//   Button,
//   CircularProgress,
//   Typography
// } from "@mui/material";
// import { useState } from "react";

// export default function GenerateForm({ onGenerate, loading }) {
//   const [skill, setSkill] = useState("");
//   const [category, setCategory] = useState("");
//   const [difficulty, setDifficulty] = useState("");

//   const submit = (e) => {
//     e.preventDefault(); 

//     console.log("Form values =>", { skill, category, difficulty });
 
//     if (!skill || !category || !difficulty) 
//     {
//       alert("Please select all filters");
//       return;
//     }

//     onGenerate({ skill, category, difficulty });
//   };

//   return (
//     <Paper
//       component="form"     // 🔥 IMPORTANT
//       onSubmit={submit}    // 🔥 IMPORTANT
//       sx={{
//         p: 4,
//         mb: 4,
//         borderRadius: 4,
//         bgcolor: "#F8FAFF",
//         boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
//       }}
//     >
//       <Typography variant="h6" mb={2}>
//         Select Filters
//       </Typography>

//       <Box display="flex" gap={2} flexWrap="wrap">
//         <FormControl fullWidth>
//           <InputLabel>Skill</InputLabel>
//           <Select
//             value={skill}
//             label="Skill"
//             onChange={e => setSkill(e.target.value)}
//           >
//             <MenuItem value={1}>C</MenuItem>
//             <MenuItem value={2}>Java</MenuItem>
//             <MenuItem value={3}>Python</MenuItem>
//             <MenuItem value={4}>.NET</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl fullWidth>
//           <InputLabel>Category</InputLabel>
//           <Select
//             value={category}
//             label="Category"
//             onChange={e => setCategory(e.target.value)}
//           >
//             <MenuItem value={1}>Theory</MenuItem>
//             <MenuItem value={2}>Coding</MenuItem>
//             <MenuItem value={3}>MCQ</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl fullWidth>
//           <InputLabel>Difficulty</InputLabel>
//           <Select
//             value={difficulty}
//             label="Difficulty"
//             onChange={e => setDifficulty(e.target.value)}
//           >
//             <MenuItem value="Easy">Easy</MenuItem>
//             <MenuItem value="Medium">Medium</MenuItem>
//             <MenuItem value="Hard">Hard</MenuItem>
//           </Select>
//         </FormControl>

//         <Button
//           type="submit"     // 🔥 IMPORTANT
//           variant="contained"
//           sx={{ bgcolor: "#2563EB", height: 56, px: 5 }}
//           disabled={!skill || !category || !difficulty || loading}
//         >
//           {loading ? <CircularProgress size={22} /> : "Generate"}
//         </Button>
//       </Box>
//     </Paper>
//   );
// }
