// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/agent';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const uploadYoutubeUrl = async (url) => {
  const response = await axios.post(`${API_BASE_URL}/upload/`, {
    youtube_url: url,
  }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const generateStudyContent = async (endpoint, text) => {
  const response = await axios.post(`${API_BASE_URL}/${endpoint}/`, { text });
  return response.data;
};

export const sendChatMessage = async (message) => {
  const response = await axios.post(`${API_BASE_URL}/chat/`, { message });
  return response.data;
};