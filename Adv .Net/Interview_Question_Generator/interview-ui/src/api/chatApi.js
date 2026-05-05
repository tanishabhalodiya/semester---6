import api from "./axios";

export const sendChatMessage = (data) => {
  return api.post("/chat", data);
};