import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { Box, TextField, Button, Typography, Card } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const role = await login(email, password);
    

    // ✅ ENSURE role exists
    if (!role) {
      navigate("/error?code=500&msg=Invalid login response");
      return;
    }

    if (role === "Admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }

  } catch (err) {

    // 🔴 Backend not running / network error
    if (!err.response) {
      navigate("/error?code=0&msg=Backend server not running");
      return;
    }

    const status = err.response.status;
    
    if (status === 401) {
      navigate("/error?code=401&msg=Invalid email or password");
    } 
    else if (status === 403) {
      navigate("/error?code=403&msg=Access denied");
    } 
    else {
      navigate(`/error?code=${status}&msg=Login failed`);
    }
  }
};



  return (
    <Box display="flex" justifyContent="center" mt={10}>
      <Card sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2}>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Typography mt={2} fontSize={14}>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </Typography>

      </Card>
    </Box>
  );
}
