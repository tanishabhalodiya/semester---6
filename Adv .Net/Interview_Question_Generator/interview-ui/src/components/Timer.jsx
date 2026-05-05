import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

export default function Timer({ duration, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Typography fontWeight={600} color="error">
      ⏰ Time Left: {minutes}:{seconds.toString().padStart(2, "0")}
    </Typography>
  );
}
