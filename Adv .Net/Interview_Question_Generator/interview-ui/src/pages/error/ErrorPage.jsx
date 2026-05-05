import { Box, Typography, Button } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LockIcon from "@mui/icons-material/Lock";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import BugReportIcon from "@mui/icons-material/BugReport";

function ErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ READ FROM URL (NOT STATE)
  const params = new URLSearchParams(location.search);
  const code = Number(params.get("code")) || 404;
  const message = params.get("msg") || "Something went wrong";

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const getIcon = () => {
    if (code === 0) return <WifiOffIcon sx={{ fontSize: 90, color: "#0284C7" }} />;
    if (code === 401 || code === 403) return <LockIcon sx={{ fontSize: 90, color: "#F59E0B" }} />;
    if (code >= 500) return <BugReportIcon sx={{ fontSize: 90, color: "#DC2626" }} />;
    return <ErrorOutlineIcon sx={{ fontSize: 90, color: "#6B7280" }} />;
  };

  const goDashboard = () => {
    if (!token) return;
    role === "Admin"
      ? navigate("/admin/dashboard")
      : navigate("/user/dashboard");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#F9FAFB",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }}
    >
      {getIcon()}

      <Typography variant="h2" fontWeight={700} mt={2}>
        {code}
      </Typography>

      <Typography variant="h6" color="text.secondary" mt={1}>
        {message}
      </Typography>

      <Box mt={4} display="flex" gap={2}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>

        {token && (
          <Button variant="contained" onClick={goDashboard}>
            Go to Dashboard
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ErrorPage;
