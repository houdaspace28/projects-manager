export interface User {
  userId: string;
  email: string;
  token: string;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  progress: ProjectProgress;
}

export interface ProjectProgress {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  isCompleted: boolean;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
}