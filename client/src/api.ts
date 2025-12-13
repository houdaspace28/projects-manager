import axios, { AxiosError } from "axios";
import type {
  User,
  Project,
  Task,
  LoginRequest,
  RegisterRequest,
  CreateProjectRequest,
  CreateTaskRequest,
} from "./types";

const API_URL = import.meta.env.API_URL || "http://localhost:5207/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// adding token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      window.location.href = "/login";
      return Promise.reject(new Error("Session expired. Please login again."));
    }

    const message =error.response?.data?.message || error.response?.statusText || error.message || "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// Auth
export const authService = {
  login: async (data: LoginRequest): Promise<User> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  }
};

// Projects
export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get("/projects");
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post("/projects", data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  }
};

// Tasks
export const taskService = {
  getByProject: async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data;
  },

  create: async (projectId: string, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  toggle: async (taskId: string): Promise<Task> => {
    const response = await api.patch(`/tasks/${taskId}/toggle`);
    return response.data;
  },

  delete: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  }
};