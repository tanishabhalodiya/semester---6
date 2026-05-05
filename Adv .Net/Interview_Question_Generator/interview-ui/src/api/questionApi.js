import api from "./axios";

// ---------- AI GENERATE ----------
export const generateAiMcqs = (data) => {
  return api.post("/ai/generate", data);
};

// ---------- AI SAVE ----------
export const saveAiMcq = (mcq) => {
  return api.post("/ai/save", mcq);
};

export const saveAiMcqsBulk = (mcqs) => {
  return api.post("/ai/save-bulk", mcqs);
};

// ---------- SAVED MCQS ----------
export const getSavedQuestionsByUser = (userId) =>
  api.get(`/usersavedquestions/user`);

export const deleteSavedMcq = (questionId) => {
  return api.delete(`/usersavedquestions/${questionId}`);
};
