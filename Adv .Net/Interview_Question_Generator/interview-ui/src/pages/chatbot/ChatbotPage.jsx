import { useState, useRef, useEffect } from "react";
import { Box, Typography, TextField, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../../components/Sidebar";
import { sendChatMessage } from "../../api/chatApi";
import SendIcon      from "@mui/icons-material/Send";
import SmartToyIcon  from "@mui/icons-material/SmartToy";
import PersonIcon    from "@mui/icons-material/Person";
import HubIcon       from "@mui/icons-material/Hub";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm IQG AI. Ask me anything about interview prep 🚀" }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const theme     = useTheme();

  const primary   = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const paper     = theme.palette.background.paper;
  const bg        = theme.palette.background.default;
  const textPri   = theme.palette.text.primary;
  const textSec   = theme.palette.text.secondary;

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await sendChatMessage({ message: text, history: messages });
      setMessages(prev => [...prev, { role: "ai", text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev,
        { role: "ai", text: "⚠️ AI is unavailable right now. Please try again." }]);
    } finally { setLoading(false); }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", background: bg, position: "relative", overflow: "hidden" }}>

      {/* Ambient glows */}
      <Box sx={{ position: "fixed", top: "-8%", left: "50%",
        transform: "translateX(-50%)", width: 500, height: 500,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${primary}12 0%, transparent 65%)`,
        filter: "blur(65px)", zIndex: 0 }} />
      <Box sx={{ position: "fixed", bottom: "0%", right: "0%", width: 350, height: 350,
        borderRadius: "50%", pointerEvents: "none",
        background: `radial-gradient(circle, ${secondary}10 0%, transparent 65%)`,
        filter: "blur(55px)", zIndex: 0 }} />

      <Box sx={{ position: "relative", zIndex: 20 }}><Sidebar /></Box>

      {/* ── CHAT AREA ── */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column",
        position: "relative", zIndex: 2, overflow: "hidden" }}>

        {/* ── TOP BAR ── */}
        <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}>
          <Box sx={{
            px: { xs: 2, md: 3 }, py: 2,
            borderBottom: `1px solid rgba(34,211,238,0.1)`,
            background: `linear-gradient(180deg, ${bg} 0%, transparent 100%)`,
            display: "flex", alignItems: "center", gap: 1.5,
            backdropFilter: "blur(10px)",
          }}>
            {/* AI avatar */}
            <Box sx={{ position: "relative" }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "11px",
                background: `linear-gradient(135deg, ${primary}25, ${secondary}15)`,
                border: `1.5px solid ${primary}45`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 0 16px ${primary}25` }}>
                <SmartToyIcon sx={{ color: primary, fontSize: "1.3rem" }} />
              </Box>
              {/* Pulse ring */}
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ position: "absolute", inset: -3, borderRadius: "14px",
                  border: `1px solid ${primary}60`, pointerEvents: "none" }} />
            </Box>

            <Box>
              <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                fontWeight: 800, fontSize: "1rem", color: textPri, lineHeight: 1 }}>
                IQG AI
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                <motion.div animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: "50%",
                    background: theme.palette.success.main,
                    boxShadow: `0 0 5px ${theme.palette.success.main}` }} />
                <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                  fontSize: "0.52rem", color: theme.palette.success.main,
                  letterSpacing: "0.12em" }}>
                  ONLINE
                </Typography>
              </Box>
            </Box>

            {/* Right label */}
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.7 }}>
              <HubIcon sx={{ color: primary, fontSize: "0.8rem", opacity: 0.6 }} />
              <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.52rem", color: textSec, letterSpacing: "0.15em" }}>
                NEURAL_CHAT // v2.4
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* ── MESSAGES ── */}
        <Box sx={{ flex: 1, overflowY: "auto", px: { xs: 2, md: 3 }, py: 2.5,
          display: "flex", flexDirection: "column", gap: 2,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: `linear-gradient(180deg, ${primary}50, ${secondary}50)`,
            borderRadius: 99 },
        }}>
          <AnimatePresence initial={false}>
            {messages.map((m, i) => {
              const isAi = m.role === "ai";
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  style={{ display: "flex", justifyContent: isAi ? "flex-start" : "flex-end",
                    alignItems: "flex-end", gap: 10 }}>

                  {/* AI avatar on left */}
                  {isAi && (
                    <Box sx={{ width: 30, height: 30, borderRadius: "8px", flexShrink: 0,
                      background: `${primary}18`, border: `1px solid ${primary}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      mb: 0.3 }}>
                      <SmartToyIcon sx={{ color: primary, fontSize: "0.9rem" }} />
                    </Box>
                  )}

                  {/* Bubble */}
                  <Box sx={{
                    maxWidth: "72%", px: "16px", py: "11px",
                    borderRadius: isAi ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                    background: isAi
                      ? `linear-gradient(145deg, #0d1f3c, ${paper})`
                      : `linear-gradient(135deg, #0891b2, ${primary})`,
                    border: isAi
                      ? `1px solid rgba(34,211,238,0.15)`
                      : `1px solid ${primary}50`,
                    boxShadow: isAi
                      ? `0 4px 16px rgba(0,0,0,0.25)`
                      : `0 4px 16px ${primary}25`,
                    position: "relative",
                  }}>
                    <Typography sx={{
                      fontFamily: "'Exo 2', sans-serif", fontSize: "0.88rem",
                      color: isAi ? textPri : "#030712",
                      lineHeight: 1.65, fontWeight: isAi ? 400 : 500,
                      whiteSpace: "pre-wrap",
                    }}>
                      {m.text}
                    </Typography>
                  </Box>

                  {/* User avatar on right */}
                  {!isAi && (
                    <Box sx={{ width: 30, height: 30, borderRadius: "8px", flexShrink: 0,
                      background: `${secondary}18`, border: `1px solid ${secondary}35`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      mb: 0.3 }}>
                      <PersonIcon sx={{ color: secondary, fontSize: "0.9rem" }} />
                    </Box>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* AI typing indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
                <Box sx={{ width: 30, height: 30, borderRadius: "8px",
                  background: `${primary}18`, border: `1px solid ${primary}35`,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SmartToyIcon sx={{ color: primary, fontSize: "0.9rem" }} />
                </Box>
                <Box sx={{ px: "16px", py: "12px", borderRadius: "4px 14px 14px 14px",
                  background: `linear-gradient(145deg, #0d1f3c, ${paper})`,
                  border: `1px solid rgba(34,211,238,0.15)`,
                  display: "flex", alignItems: "center", gap: 1 }}>
                  {[0, 1, 2].map(i => (
                    <motion.div key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                      style={{ width: 6, height: 6, borderRadius: "50%",
                        background: primary,
                        boxShadow: `0 0 6px ${primary}` }} />
                  ))}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={bottomRef} />
        </Box>

        {/* ── INPUT BAR ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}>
          <Box sx={{
            px: { xs: 2, md: 3 }, py: 2,
            borderTop: `1px solid rgba(34,211,238,0.1)`,
            background: `linear-gradient(0deg, ${bg} 0%, transparent 100%)`,
            backdropFilter: "blur(10px)",
          }}>
            {/* Suggestion chips */}
            <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
              {["Tell me about React Hooks", "Top 5 system design questions",
                "Explain Big O notation"].map(suggestion => (
                <Box key={suggestion} onClick={() => setInput(suggestion)}
                  sx={{ px: 1.5, py: "5px", borderRadius: "20px", cursor: "pointer",
                    background: `${primary}08`, border: `1px solid ${primary}20`,
                    transition: "all 0.2s",
                    "&:hover": { background: `${primary}15`, border: `1px solid ${primary}40` } }}>
                  <Typography sx={{ fontFamily: "'Exo 2', sans-serif",
                    fontSize: "0.72rem", color: textSec }}>
                    {suggestion}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Input row */}
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-end" }}>
              <TextField fullWidth multiline maxRows={4}
                placeholder="Ask me anything about interviews..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                sx={{
                  "& .MuiInputBase-root": {
                    fontFamily: "'Exo 2', sans-serif", fontSize: "0.9rem", color: textPri,
                    background: paper,
                    border: `1px solid rgba(34,211,238,0.18)`,
                    borderRadius: "12px", transition: "all 0.25s",
                    "&:hover": { border: `1px solid ${primary}45` },
                    "&.Mui-focused": { border: `1px solid ${primary}65`,
                      boxShadow: `0 0 0 3px ${primary}12` },
                  },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  "& .MuiInputBase-input::placeholder": { color: textSec, opacity: 0.5,
                    fontFamily: "'Exo 2', sans-serif" },
                }}
              />

              {/* Send button */}
              <motion.div whileHover={{ scale: input.trim() ? 1.06 : 1 }}
                whileTap={{ scale: input.trim() ? 0.95 : 1 }}>
                <Box onClick={sendMessage} sx={{
                  width: 48, height: 48, borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: input.trim() && !loading ? "pointer" : "default",
                  background: input.trim() && !loading
                    ? `linear-gradient(135deg, #0891b2, ${primary})`
                    : "rgba(34,211,238,0.07)",
                  border: `1px solid ${input.trim() ? primary + "55" : "rgba(34,211,238,0.12)"}`,
                  boxShadow: input.trim() && !loading ? `0 4px 18px ${primary}40` : "none",
                  transition: "all 0.25s",
                  opacity: input.trim() && !loading ? 1 : 0.45,
                }}>
                  {loading
                    ? <CircularProgress size={18} sx={{ color: primary }} />
                    : <SendIcon sx={{ color: input.trim() ? "#030712" : textSec,
                        fontSize: "1.1rem" }} />}
                </Box>
              </motion.div>
            </Box>

            {/* Hint */}
            <Typography sx={{ fontFamily: "'Share Tech Mono', monospace",
              fontSize: "0.5rem", color: textSec, opacity: 0.45,
              letterSpacing: "0.1em", mt: 1, textAlign: "center" }}>
              ENTER to send · SHIFT+ENTER for new line
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}

// import { Box, Typography } from "@mui/material";
// import { useState } from "react";
// import Sidebar from "../../components/Sidebar";
// import ChatInput from "./ChatInput";
// import ChatMessage from "../../components/ChatMessage";
// import { sendChatMessage } from "../../api/chatApi";

// export default function ChatbotPage() {
//   const [messages, setMessages] = useState([
//     { role: "ai", text: "Hi! I am IQG AI. Ask me interview questions 🚀" }
//   ]);

//   const sendMessage = async (text) => {
//   const userMsg = { role: "user", text };

//   setMessages(prev => [...prev, userMsg]);

//   try {
//     const res = await sendChatMessage({
//       message: text,
//       history: messages
//     });

//     setMessages(prev => [
//       ...prev,
//       { role: "ai", text: res.data.reply }
//     ]);
//   } catch {
//     setMessages(prev => [
//       ...prev,
//       { role: "ai", text: "⚠️ AI is unavailable right now." }
//     ]);
//   }
// };

//   return (
//     <Box sx={{ display: "flex", height: "100vh", bgcolor: "#F4F8FC" }}>
//       <Sidebar />

//       <Box sx={{ flex: 1, display: "flex", flexDirection: "column", p: 3 }}>
//         <Typography variant="h5" fontWeight={700} mb={2}>
//           IQG AI Chatbot 🤖
//         </Typography>

//         <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
//           {messages.map((m, i) => (
//             <ChatMessage key={i} role={m.role} text={m.text} />
//           ))}
//         </Box>

//         <ChatInput onSend={sendMessage} />
//       </Box>
//     </Box>
//   );
// }
