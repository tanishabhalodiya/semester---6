import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7138/api",
  timeout: 30000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {

    // 🔴 BACKEND DOWN / NO INTERNET
    if (!error.response) {
      window.location.href =
        "/error?code=0&msg=Server is not running or no internet connection";
      return Promise.reject(error);
    }

    const status = error.response.status;

    if (status === 401) {
      localStorage.clear();
      window.location.href =
        "/error?code=401&msg=Session expired. Please login again";
    }
    else if (status === 403) {
      window.location.href =
        "/error?code=403&msg=You are not allowed to access this resource";
    }
    else if (status === 404) {
      window.location.href =
        "/error?code=404&msg=Requested resource not found";
    }
    else if (status === 500) {
      window.location.href =
        "/error?code=500&msg=Internal server error";
    }
    else {
      window.location.href =
        `/error?code=${status}&msg=Unexpected error occurred`;
    }

    return Promise.reject(error);
  }
);

// ── Feedback API ──────────────────────────────────────────────
export const submitFeedback  = (data) => api.post("/Feedback", data);
export const updateFeedback  = (data) => api.put("/Feedback", data);
export const getAllFeedbacks  = ()     => api.get("/Feedback");
export const getFeedbackById = (id)   => api.get(`/Feedback/${id}`);
export const deleteFeedback  = (id)   => api.delete(`/Feedback/${id}`);

export default api;
