import { Box, Typography } from "@mui/material";

export default function ChatMessage({ role, text }) {
  const isUser = role === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 1
      }}
    >
      <Box
        sx={{
          maxWidth: "70%",
          p: 2,
          borderRadius: 3,
          bgcolor: isUser ? "#1E293B" : "#EAF2FB",
          color: isUser ? "white" : "#0F172A"
        }}
      >
        <Typography>{text}</Typography>
      </Box>
    </Box>
  );
}
