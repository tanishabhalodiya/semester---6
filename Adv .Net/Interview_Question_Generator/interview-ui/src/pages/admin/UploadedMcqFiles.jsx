import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Box, Typography, Card, Button, Stack } from "@mui/material";

export default function UploadedMcqFiles() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    api.get("/admin/mcq/uploaded-files").then(res => setFiles(res.data));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3}>📁 Uploaded MCQ Files</Typography>

      {files.map(f => (
        <Card key={f.fileId} sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <div>
              <Typography fontWeight={600}>{f.fileName}</Typography>
              <Typography fontSize={13}>
                Uploaded At: {new Date(f.uploadedAt).toLocaleString()}
              </Typography>
            </div>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={() =>
                  window.open(`/api/admin/mcq/download/${f.fileId}`)
                }
              >
                Download
              </Button>
            </Stack>
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
