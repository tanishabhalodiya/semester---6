import { Routes, Route, Navigate } from "react-router-dom";

import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SavedQuestions from "./pages/dashboard/SavedQuestions";
import GeneratePage from "./pages/generate/GeneratePage";
import CreateNew from "./pages/generate/CreateNew";
import ChatbotPage from "./pages/chatbot/ChatbotPage";
import AdminMcqList from "./pages/admin/AdminMcqList";
import AdminMcqForm from "./pages/admin/AdminMcqForm";
import AdminUsers from "./pages/admin/AdminUsers";
import Leaderboard from "./pages/Leaderboard";
import AvailableTests from "./pages/AvailableTests";
import TakeTest from "./pages/TakeTest";
import TestResult from "./pages/TestResult";
import ManageSessions from "./pages/admin/ManageSessions";
import PerformanceDashboard from "./pages/PerformanceDashboard";
import AssignQuestions from "./pages/admin/AssignQuestions";
import BulkMcqUpload from "./pages/admin/BulkMcqUpload";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ErrorPage from "./pages/error/ErrorPage";
import ProtectedRoute from "./components/ProtectedRoute";
import McqPreview from "./pages/generate/McqPreview";
import GenerateFromFile from "./pages/generate/GenerateFromFile";
import Resources from "./pages/Resources";
import AdminFeedbacks from "./pages/admin/AdminFeedbacks";

function App() {
  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* USER */}
      <Route path="/user/dashboard" element={<ProtectedRoute role="User"><UserDashboard /></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute role="User"><SavedQuestions /></ProtectedRoute>} />
      <Route path="/user/tests" element={<ProtectedRoute role="User"><AvailableTests /></ProtectedRoute>} />
      <Route path="/user/test/:sessionId" element={<ProtectedRoute role="User"><TakeTest /></ProtectedRoute>} />
      <Route path="/user/result/:sessionId" element={<ProtectedRoute role="User"><TestResult /></ProtectedRoute>} />
      <Route path="/user/performance" element={<ProtectedRoute role="User"><PerformanceDashboard /></ProtectedRoute>} />
      <Route path="/user/leaderboard" element={<ProtectedRoute role="User"><Leaderboard /></ProtectedRoute>} />

      {/* ADMIN */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/mcq" element={<ProtectedRoute role="Admin"><AdminMcqList /></ProtectedRoute>} />
      <Route path="/admin/mcq/add" element={<ProtectedRoute role="Admin"><AdminMcqForm /></ProtectedRoute>} />
      <Route path="/admin/mcq/edit/:id" element={<ProtectedRoute role="Admin"><AdminMcqForm /></ProtectedRoute>} />
      <Route path="/admin/mcq/bulk" element={<ProtectedRoute role="Admin"><BulkMcqUpload /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="Admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/sessions" element={<ProtectedRoute role="Admin"><ManageSessions /></ProtectedRoute>} />
      <Route path="/admin/assign/:sessionId" element={<ProtectedRoute role="Admin"><AssignQuestions /></ProtectedRoute>} />
      <Route path="/admin/leaderboard" element={<ProtectedRoute role="Admin"><Leaderboard /></ProtectedRoute>} />
      <Route path="/admin/feedbacks" element={<ProtectedRoute role="Admin"><AdminFeedbacks /></ProtectedRoute>} />

      {/* COMMON (ANY LOGIN) */}
      <Route path="/generate" element={<ProtectedRoute><GeneratePage /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><CreateNew /></ProtectedRoute>} />
      <Route path="/generate-file" element={<ProtectedRoute role="User"><GenerateFromFile /></ProtectedRoute>}/>
      <Route path="/mcq-preview" element={<ProtectedRoute><McqPreview /></ProtectedRoute>}/>
      <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />
      <Route path="/user/resources" element={<Resources />} />

      {/* ERROR */}
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<Navigate to="/error?code=404&msg=Page not found" />} />

    </Routes>
  );
}

export default App;