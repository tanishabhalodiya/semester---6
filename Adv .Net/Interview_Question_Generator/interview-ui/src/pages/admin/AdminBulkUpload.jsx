import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import AdminSidebar from "../../components/AdminSidebar";

export default function BulkMcqUpload() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);

  const [skillId, setSkillId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const adminId = 1; // 🔴 replace with logged-in admin id

  useEffect(() => {
    loadDropdowns();
  }, []);

  const loadDropdowns = async () => {
    const skillsRes = await api.get("/Skills");
    const categoriesRes = await api.get("/QuestionCategories");

    setSkills(skillsRes.data);
    setCategories(categoriesRes.data);
  };

  const handleUpload = async () => {
    if (!file || !skillId || !categoryId || !difficulty) {
      alert("Please fill all fields and select file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("adminId", adminId);
    formData.append("skillId", skillId);
    formData.append("categoryId", categoryId);
    formData.append("difficulty", difficulty);

    await api.post("/admin/mcq/bulk-upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    alert("✅ MCQs uploaded successfully");
    setFile(null);
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "#F5F7FB", minHeight: "100vh" }}>
      <AdminSidebar />

      <Box sx={{ flex: 1, p: 4 }}>
        <Typography variant="h4" fontWeight={700} mb={3}>
          📤 Bulk MCQ Upload
        </Typography>

        <Card sx={{ p: 4, borderRadius: 4, maxWidth: 700 }}>
          <Stack spacing={3}>
            {/* FILE UPLOAD */}
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
            >
              Select MCQ Text File (.txt)
              <input
                hidden
                type="file"
                accept=".txt"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Button>

            {file && (
              <Chip
                label={file.name}
                color="success"
                sx={{ alignSelf: "flex-start" }}
              />
            )}

            {/* SKILL */}
            <FormControl fullWidth>
              <InputLabel>Skill</InputLabel>
              <Select
                value={skillId}
                label="Skill"
                onChange={(e) => setSkillId(e.target.value)}
              >
                {skills.map(s => (
                  <MenuItem key={s.skillId} value={s.skillId}>
                    {s.skillName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* CATEGORY */}
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryId}
                label="Category"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map(c => (
                  <MenuItem key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* DIFFICULTY */}
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>

            {/* SUBMIT */}
            <Button
              variant="contained"
              size="large"
              sx={{ py: 1.3, fontWeight: 700 }}
              onClick={handleUpload}
            >
              Upload MCQs
            </Button>
          </Stack>
        </Card>

        {/* FORMAT HELP */}
        <Card sx={{ p: 3, mt: 4, borderRadius: 3, bgcolor: "#EEF2FF" }}>
          <Typography fontWeight={700} mb={1}>
            📄 File Format (IMPORTANT)
          </Typography>

          <pre style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
{`Q: What is a pointer in C?
A) A variable that stores address
B) A function
C) A loop
D) A constant
ANS: A
---

Q: Which keyword is used to define a function in Python?
A) func
B) def
C) function
D) define
ANS: B
---`}
          </pre>
        </Card>
      </Box>
    </Box>
  );
}
