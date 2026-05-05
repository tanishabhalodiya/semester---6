import { TextField, Box } from "@mui/material";

export default function McqOptionInput({ options, setOptions }) {
  const handleChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
      {["A", "B", "C", "D"].map(k => (
        <TextField
          key={k}
          label={`Option ${k}`}
          value={options[k] || ""}
          onChange={e => handleChange(k, e.target.value)}
        />
      ))}
    </Box>
  );
}
