import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = async (email: string, password: string) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};


// Task APIs
export const getTasks = async () => {
  const response = await api.get("/tasks");
  return response.data;
};

export const addTask = async (task: {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
}) => {
  const response = await api.post("/tasks/addTask", task);
  return response.data;
};

export const updateTask = async (id: string, updatedTask: object) => {
  const response = await api.put(`/tasks/${id}`, updatedTask);
  return response.data;
};

export const deleteTask = async (id: string) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

