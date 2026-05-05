import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack
} from "@mui/material";

export default function GeneratedQuestionList({ questions, onSave }) {
  if (!questions || questions.length === 0) {
    return (
      <Typography align="center" color="text.secondary" mt={4}>
        No questions generated yet.
      </Typography>
    );
  }

  return (
    <Box mt={4}>
      {questions.map((q) => (
        <Card
          key={q.questionId}
          sx={{
            mb: 2,
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
          }}
        >
          <CardContent>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={600}>
                {q.questionText}
              </Typography>

              <Chip
                label={q.difficulty}
                color={
                  q.difficulty === "Easy"
                    ? "success"
                    : q.difficulty === "Medium"
                    ? "warning"
                    : "error"
                }
                size="small"
              />
            </Stack>

            <Button
              size="small"
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={() => onSave(q.questionId)}
            >
              Save Question
            </Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
