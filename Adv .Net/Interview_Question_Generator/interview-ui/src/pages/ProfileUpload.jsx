import { useState } from "react";
import api from "../../api/axios";
import {
  Box,
  Typography,
  Card,
  Button,
  TextField,
  Avatar,
  Stack
} from "@mui/material";

export default function ProfileUpload() {
  const userId = 2; // logged in user
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFile = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async () => {
    let finalUrl = imageUrl;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/users/upload-photo", formData);
      finalUrl = res.data.imageUrl;
    }

    await api.put(`/users/profile-photo/${userId}`, {
      profileImage: finalUrl
    });

    alert("Profile photo updated");
  };

  return (
    <Box maxWidth={500} mx="auto" mt={6}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        👤 Update Profile Photo
      </Typography>

      <Card sx={{ p: 4, borderRadius: 4 }}>
        <Stack spacing={3} alignItems="center">
          <Avatar
            src={preview || imageUrl}
            sx={{ width: 120, height: 120 }}
          />

          <Button variant="outlined" component="label">
            Upload from Computer
            <input hidden type="file" accept="image/*" onChange={handleFile} />
          </Button>

          <Typography>OR</Typography>

          <TextField
            fullWidth
            label="Image URL"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreview(e.target.value);
            }}
          />

          <Button variant="contained" size="large" onClick={save}>
            Save Profile
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
