import { Box, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <TextField
        fullWidth
        placeholder="Ask interview question..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />
      <Button
        variant="contained"
        onClick={handleSend}
        sx={{ bgcolor: "#2563EB" }}
      >
        Send
      </Button>
    </Box>
  );
}
