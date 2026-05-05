import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar        from "../../components/AdminSidebar";
import HubIcon             from "@mui/icons-material/Hub";
import UploadFileIcon      from "@mui/icons-material/UploadFile";
import CheckCircleIcon     from "@mui/icons-material/CheckCircle";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CodeIcon            from "@mui/icons-material/Code";
import CloseIcon           from "@mui/icons-material/Close";

export default function BulkMcqUpload() {
  const [file,       setFile]       = useState(null);
  const [skills,     setSkills]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [skillId,    setSkillId]    = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [uploading,  setUploading]  = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [dragOver,   setDragOver]   = useState(false);
  const [errMsg,     setErrMsg]     = useState("");

  const adminId = 1;
  const theme   = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;
  const successC  = theme.palette.success.main;
  const warningC  = theme.palette.warning.main;
  const errorC    = theme.palette.error.main;

  useEffect(() => { loadDropdowns(); }, []);

  const loadDropdowns = async () => {
    try {
      const [sr, cr] = await Promise.all([api.get("/Skills"), api.get("/QuestionCategories")]);
      setSkills(sr.data);
      setCategories(cr.data);
    } catch { setErrMsg("Failed to load dropdowns"); }
  };

  const handleUpload = async () => {
    if (!file || !skillId || !categoryId || !difficulty) {
      setErrMsg("Please fill all fields and select a file"); return;
    }
    const formData = new FormData();
    formData.append("File",       file);
    formData.append("AdminId",    adminId);
    formData.append("SkillId",    skillId);
    formData.append("CategoryId", categoryId);
    formData.append("Difficulty", difficulty);
    try {
      setUploading(true); setErrMsg("");
      await api.post("/admin/mcq/bulk-upload", formData);
      setSuccess(true); setFile(null);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      setErrMsg(err.response?.data || "Upload failed. Please try again.");
    } finally { setUploading(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".txt") || f.name.endsWith(".xlsx"))) { setFile(f); setErrMsg(""); }
    else setErrMsg("Only .txt or .xlsx files are accepted");
  };

  const selectSx = {
    fontFamily:"'Exo 2', sans-serif", color:textPri, fontSize:"0.88rem",
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
    "& .MuiMenuItem-root":{ fontFamily:"'Exo 2', sans-serif", fontSize:"0.88rem",
      color:textSec, py:1,
      "&:hover":{ background:`${primary}15`, color:primary },
      "&.Mui-selected":{ background:`${primary}18`, color:primary },
    },
  }}};

  const diffColor = (d) => d === "Easy" ? successC : d === "Medium" ? warningC : errorC;
  const isReady   = !!(file && skillId && categoryId && difficulty);

  const Label = ({ children }) => (
    <Typography sx={{ fontFamily:"'Share Tech Mono', monospace", fontSize:"0.52rem",
      color:textSec, letterSpacing:"0.14em", textTransform:"uppercase", mb:0.8 }}>
      {children}
    </Typography>
  );

  return (
    <Box sx={{ display:"flex", minHeight:"100vh", background:bg, position:"relative" }}>
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

        {/* HEADER */}
        <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <Box sx={{ mb:4 }}>
            <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:0.6 }}>
              <HubIcon sx={{ color:primary, fontSize:"0.85rem" }} />
              <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                fontSize:"0.56rem", color:primary, letterSpacing:"0.2em", opacity:0.8 }}>
                ADMIN // BULK_UPLOAD
              </Typography>
            </Box>
            <Typography sx={{
              fontFamily:"'Exo 2', sans-serif", fontWeight:900,
              fontSize:{ xs:"1.7rem", md:"2.1rem" }, lineHeight:1.1,
              background:`linear-gradient(115deg, ${textPri} 0%, #67e8f9 50%, ${secondary} 100%)`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
            }}>
              Bulk MCQ Upload
            </Typography>
            <Typography sx={{ fontFamily:"'Exo 2', sans-serif", color:textSec, fontSize:"0.85rem", mt:0.4 }}>
              Upload multiple questions at once via a structured .txt or .xlsx file
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display:"flex", gap:3, flexWrap:"wrap", alignItems:"flex-start" }}>

          {/* ── FORM CARD ── */}
          <motion.div initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1, duration:0.55 }} style={{ flex:1, minWidth:320 }}>
            <Box sx={{
              borderRadius:"18px", p:"28px",
              background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
              border:`1px solid rgba(34,211,238,0.13)`,
              boxShadow:`0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.06)`,
              position:"relative", overflow:"hidden",
              "&::before":{ content:'""', position:"absolute", top:0, left:"8%", right:"8%", height:"1.5px",
                background:`linear-gradient(90deg, transparent, ${primary}70, ${secondary}50, transparent)` },
            }}>

              {/* DROP ZONE */}
              <Box
                onDragOver={e=>{ e.preventDefault(); setDragOver(true); }}
                onDragLeave={()=>setDragOver(false)}
                onDrop={handleDrop}
                onClick={()=>document.getElementById("bulk-file-input").click()}
                sx={{
                  borderRadius:"12px", p:"28px 20px", mb:3, textAlign:"center",
                  border:`2px dashed ${dragOver ? primary : "rgba(34,211,238,0.2)"}`,
                  background: dragOver ? `${primary}08` : "rgba(34,211,238,0.02)",
                  cursor:"pointer", transition:"all 0.3s",
                  "&:hover":{ borderColor:`${primary}55`, background:`${primary}05` },
                }}>
                <input id="bulk-file-input" hidden type="file" accept=".txt,.xlsx"
                  onChange={e=>{ setFile(e.target.files[0]); setErrMsg(""); }} />

                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div key="file" initial={{ opacity:0, scale:0.85 }}
                      animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.85 }}>
                      <Box sx={{ width:48, height:48, borderRadius:"12px", mx:"auto", mb:1.5,
                        background:`${successC}18`, border:`1px solid ${successC}40`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <InsertDriveFileIcon sx={{ color:successC, fontSize:"1.4rem" }} />
                      </Box>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontWeight:700, fontSize:"0.9rem", color:successC, mb:0.4 }}>
                        {file.name}
                      </Typography>
                      <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                        fontSize:"0.55rem", color:textSec, letterSpacing:"0.1em", mb:1.2 }}>
                        {(file.size/1024).toFixed(1)} KB · READY
                      </Typography>
                      <Box onClick={e=>{ e.stopPropagation(); setFile(null); }}
                        sx={{ display:"inline-flex", alignItems:"center", gap:0.5,
                          px:1.5, py:"4px", borderRadius:"20px", cursor:"pointer",
                          border:`1px solid rgba(248,113,113,0.3)`,
                          background:"rgba(248,113,113,0.08)",
                          "&:hover":{ background:"rgba(248,113,113,0.18)" }, transition:"all 0.2s" }}>
                        <CloseIcon sx={{ color:errorC, fontSize:"0.7rem" }} />
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.52rem", color:errorC, letterSpacing:"0.08em" }}>REMOVE</Typography>
                      </Box>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                      <Box sx={{ width:48, height:48, borderRadius:"12px", mx:"auto", mb:1.5,
                        background:`${primary}12`, border:`1px solid ${primary}25`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <UploadFileIcon sx={{ color:primary, fontSize:"1.5rem" }} />
                      </Box>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontWeight:600, fontSize:"0.88rem", color:textPri, mb:0.4 }}>
                        Drop file here or click to browse
                      </Typography>
                      <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                        fontSize:"0.55rem", color:textSec, letterSpacing:"0.08em" }}>
                        ACCEPTS .TXT · .XLSX
                      </Typography>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              {/* SKILL */}
              <Box sx={{ mb:2 }}>
                <Label>Skill</Label>
                <FormControl fullWidth>
                  <Select value={skillId} onChange={e=>setSkillId(e.target.value)}
                    displayEmpty sx={selectSx} MenuProps={menuProps}>
                    <MenuItem value="" disabled>
                      <Typography sx={{ color:textSec, fontSize:"0.88rem",
                        fontFamily:"'Exo 2', sans-serif", opacity:0.5 }}>Choose a skill...</Typography>
                    </MenuItem>
                    {skills.map(s=>(
                      <MenuItem key={s.skillId} value={s.skillId}>{s.skillName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* CATEGORY */}
              <Box sx={{ mb:2 }}>
                <Label>Category</Label>
                <FormControl fullWidth>
                  <Select value={categoryId} onChange={e=>setCategoryId(e.target.value)}
                    displayEmpty sx={selectSx} MenuProps={menuProps}>
                    <MenuItem value="" disabled>
                      <Typography sx={{ color:textSec, fontSize:"0.88rem",
                        fontFamily:"'Exo 2', sans-serif", opacity:0.5 }}>Choose a category...</Typography>
                    </MenuItem>
                    {categories.map(c=>(
                      <MenuItem key={c.categoryId} value={c.categoryId}>{c.categoryName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* DIFFICULTY PILLS */}
              <Box sx={{ mb:3 }}>
                <Label>Difficulty</Label>
                <Box sx={{ display:"flex", gap:1.5 }}>
                  {["Easy","Medium","Hard"].map(d=>(
                    <motion.div key={d} whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                      style={{ flex:1 }}>
                      <Box onClick={()=>setDifficulty(d)} sx={{
                        py:"10px", borderRadius:"10px", textAlign:"center", cursor:"pointer",
                        background: difficulty===d ? `${diffColor(d)}18` : "rgba(34,211,238,0.03)",
                        border:`1px solid ${difficulty===d ? diffColor(d)+"55" : "rgba(34,211,238,0.15)"}`,
                        boxShadow: difficulty===d ? `0 0 14px ${diffColor(d)}22` : "none",
                        transition:"all 0.25s",
                      }}>
                        <Box sx={{ width:8, height:8, borderRadius:"50%", mx:"auto", mb:0.6,
                          background:diffColor(d),
                          boxShadow: difficulty===d ? `0 0 8px ${diffColor(d)}` : "none",
                          transition:"box-shadow 0.25s" }} />
                        <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                          fontSize:"0.62rem", fontWeight:700,
                          color: difficulty===d ? diffColor(d) : textSec,
                          letterSpacing:"0.06em", textTransform:"uppercase" }}>
                          {d}
                        </Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              {/* ERROR */}
              <AnimatePresence>
                {errMsg && (
                  <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-6 }} transition={{ duration:0.25 }}>
                    <Box sx={{ mb:2, px:2, py:"10px", borderRadius:"9px",
                      background:"rgba(248,113,113,0.08)", border:"1px solid rgba(248,113,113,0.3)" }}>
                      <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                        fontSize:"0.82rem", color:errorC }}>{errMsg}</Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* UPLOAD BUTTON */}
              <motion.div whileHover={{ scale: isReady ? 1.02 : 1 }}
                whileTap={{ scale: isReady ? 0.98 : 1 }}>
                <Box onClick={handleUpload} sx={{
                  display:"flex", alignItems:"center", justifyContent:"center", gap:1.2,
                  py:"14px", borderRadius:"12px",
                  cursor: isReady && !uploading ? "pointer" : "default",
                  background: success
                    ? `linear-gradient(135deg, #065f46, ${successC}cc)`
                    : isReady
                    ? `linear-gradient(135deg, #0891b2, ${primary}, #06b6d4)`
                    : "rgba(34,211,238,0.06)",
                  border:`1px solid ${success ? successC+"55" : isReady ? primary+"55" : "rgba(34,211,238,0.12)"}`,
                  boxShadow: success ? `0 4px 20px ${successC}40` : isReady ? `0 4px 20px ${primary}40` : "none",
                  opacity: isReady || success ? 1 : 0.45,
                  transition:"all 0.3s",
                  "&:hover": isReady && !success && !uploading ? { boxShadow:`0 8px 32px ${primary}60` } : {},
                }}>
                  {uploading
                    ? <CircularProgress size={18} sx={{ color:"#030712" }} />
                    : success
                    ? <CheckCircleIcon sx={{ color:"#030712", fontSize:"1.1rem" }} />
                    : <UploadFileIcon sx={{ color: isReady ? "#030712" : textSec, fontSize:"1.1rem" }} />}
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif", fontWeight:800,
                    fontSize:"0.9rem", letterSpacing:"0.08em", textTransform:"uppercase",
                    color: isReady || success ? "#030712" : textSec }}>
                    {uploading ? "Uploading..." : success ? "Uploaded!" : "Upload MCQs"}
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* ── FORMAT GUIDE ── */}
          <motion.div initial={{ opacity:0, y:22 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2, duration:0.55 }} style={{ flex:1, minWidth:300 }}>
            <Box sx={{
              borderRadius:"18px", p:"24px 26px",
              background:`linear-gradient(145deg, #0d1f3c 0%, ${paper} 100%)`,
              border:`1px solid rgba(34,211,238,0.1)`,
              boxShadow:`0 4px 28px rgba(0,0,0,0.35)`,
              position:"relative", overflow:"hidden",
              "&::before":{ content:'""', position:"absolute", top:0, left:0, bottom:0, width:"3px",
                background:`linear-gradient(180deg, ${primary}, ${secondary})`,
                boxShadow:`0 0 10px ${primary}60` },
            }}>
              <Box sx={{ display:"flex", alignItems:"center", gap:1, mb:2 }}>
                <Box sx={{ width:32, height:32, borderRadius:"9px",
                  background:`${primary}15`, border:`1px solid ${primary}30`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <CodeIcon sx={{ color:primary, fontSize:"1rem" }} />
                </Box>
                <Box>
                  <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                    fontWeight:700, fontSize:"0.95rem", color:textPri, lineHeight:1 }}>
                    File Format Guide
                  </Typography>
                  <Typography sx={{ fontFamily:"'Share Tech Mono', monospace",
                    fontSize:"0.5rem", color:textSec, letterSpacing:"0.12em" }}>
                    // REQUIRED_STRUCTURE
                  </Typography>
                </Box>
              </Box>

              <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                fontSize:"0.8rem", color:textSec, mb:2, lineHeight:1.6 }}>
                Each block must follow this exact format, separated by{" "}
                <Box component="span" sx={{ fontFamily:"'Share Tech Mono', monospace",
                  color:primary, fontSize:"0.78rem" }}>---</Box>
              </Typography>

              {/* Syntax block */}
              <Box sx={{ borderRadius:"10px", p:"16px",
                background:"rgba(0,0,0,0.35)", border:`1px solid rgba(34,211,238,0.12)`,
                fontFamily:"'Share Tech Mono', monospace", fontSize:"0.72rem",
                lineHeight:1.85, overflowX:"auto" }}>
                {[
                  { p:"Q:",   t:"What is a pointer in C?",         c:primary   },
                  { p:"A)",   t:"A variable that stores address",  c:successC  },
                  { p:"B)",   t:"A function",                      c:textSec   },
                  { p:"C)",   t:"A loop",                          c:textSec   },
                  { p:"D)",   t:"A constant",                      c:textSec   },
                  { p:"ANS:", t:"A",                               c:"#fbbf24" },
                  { p:"---",  t:"",                                c:"rgba(34,211,238,0.3)" },
                  { p:"",     t:"",                                c:""        },
                  { p:"Q:",   t:"Which keyword defines a function?",c:primary  },
                  { p:"A)",   t:"func",                            c:textSec   },
                  { p:"B)",   t:"def",                             c:successC  },
                  { p:"C)",   t:"function",                        c:textSec   },
                  { p:"D)",   t:"define",                          c:textSec   },
                  { p:"ANS:", t:"B",                               c:"#fbbf24" },
                  { p:"---",  t:"",                                c:"rgba(34,211,238,0.3)" },
                ].map(({ p, t, c }, i) =>
                  p === "" ? <Box key={i} sx={{ height:8 }} /> : (
                    <Box key={i} sx={{ display:"flex", gap:"6px", mb:"1px" }}>
                      <Box component="span" sx={{ color:c, minWidth:36 }}>{p}</Box>
                      <Box component="span" sx={{ color: p==="---" ? c : textSec }}>{t}</Box>
                    </Box>
                  )
                )}
              </Box>

              {/* Tips */}
              <Box sx={{ mt:2.5, display:"flex", flexDirection:"column", gap:1 }}>
                {[
                  { tip:"Each question starts with Q:",         color:primary   },
                  { tip:"Options must be labeled A) B) C) D)",  color:secondary  },
                  { tip:"ANS: must be A, B, C, or D",           color:"#fbbf24" },
                  { tip:"Separate questions with ---",           color:successC  },
                  { tip:"Excel: one row per question",           color:theme.palette.info.main },
                ].map(({ tip, color }) => (
                  <Box key={tip} sx={{ display:"flex", alignItems:"center", gap:1 }}>
                    <Box sx={{ width:5, height:5, borderRadius:"50%", background:color,
                      flexShrink:0, boxShadow:`0 0 6px ${color}` }} />
                    <Typography sx={{ fontFamily:"'Exo 2', sans-serif",
                      fontSize:"0.78rem", color:textSec }}>{tip}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>
        <Box sx={{ height:40 }} />
      </Box>
    </Box>
  );
}