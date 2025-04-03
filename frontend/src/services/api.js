// services/api.js
import axios from 'axios';
import { API_URL } from '../config';


export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/agent/upload/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const uploadYoutubeUrl = async (url) => {
  const response = await axios.post(`${API_URL}/agent/upload/`, {
    youtube_url: url,
  }, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const generateStudyContent = async (endpoint, text) => {
  const response = await axios.post(`${API_URL}/agent/${endpoint}/`, { text });
  return response.data;
};

export const sendChatMessage = async (message) => {
  const response = await axios.post(`${API_URL}/agent/chat/`, { message });
  return response.data;
};