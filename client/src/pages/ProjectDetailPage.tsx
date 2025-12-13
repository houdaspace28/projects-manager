import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useProject, useDeleteProject } from "../hooks/useProjects";
import { useTasks, useCreateTask, useCompleteTask, useDeleteTask } from "../hooks/useTasks";

interface CreateTaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const { data: project, isLoading: projectLoading, error: projectError } = useProject(id!);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(id!);
  const createTask = useCreateTask(id!);
  const completeTask = useCompleteTask(id!);
  const deleteTask = useDeleteTask(id!);
  const deleteProject = useDeleteProject();

  const {register,handleSubmit, formState: { errors }, reset} = useForm<CreateTaskFormData>();

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTask.mutateAsync({
        title: data.title,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
      });
      closeModal();
    } catch {
      //handled by tanstack query
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask.mutateAsync(taskId);
    } catch {
      //handled by tanstack query
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;

    try {
      await deleteTask.mutateAsync(taskId);
    } catch {
      //handled by tanstack query
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm("Delete this project and all its tasks?")) return;

    try {
      await deleteProject.mutateAsync(id!);
      navigate("/projects");
    } catch {
      //handled by tanstack query
    }
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const isLoading = projectLoading || tasksLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Project not found</p>
          <Link to="/projects" className="text-blue-600 hover:underline">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link to="/projects" className="text-sm text-blue-600 hover:underline">
            ← Back to projects
          </Link>
        </div>
      </header>

      
      <main className="max-w-5xl mx-auto px-4 py-8">
       
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-gray-600 mt-2">{project.description}</p>
              )}
            </div>
            <button onClick={handleDeleteProject} disabled={deleteProject.isPending} className="text-sm text-red-500 hover:underline disabled:opacity-50">
              {deleteProject.isPending ? "Deleting..." : "Delete Project"}
            </button>
          </div>

          
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress: {project.progress.progressPercentage}%</span>
              <span>
                {project.progress.completedTasks}/{project.progress.totalTasks}{" "}
                tasks completed
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all" style={{ width: `${project.progress.progressPercentage}%` }} />
            </div>
          </div>
        </div>

        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Tasks</h2>
          <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition" >
            + Add Task
          </button>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No tasks yet. Add your first task!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className={`bg-white rounded-lg shadow p-4 flex items-start gap-4 ${task.isCompleted ? "opacity-60" : ""}`}>
                <button
                  onClick={() =>
                    !task.isCompleted && handleCompleteTask(task.id)
                  }
                  disabled={task.isCompleted || completeTask.isPending}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                    task.isCompleted
                      ? "bg-green-500 border-green-500 text-white cursor-default"
                      : "border-gray-300 hover:border-green-500 cursor-pointer"
                  }`}
                >
                  {task.isCompleted && (
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>

                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      task.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <p className="text-xs text-gray-400 mt-2">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <button onClick={() => handleDeleteTask(task.id)} disabled={deleteTask.isPending} className="text-sm text-red-500 hover:underline disabled:opacity-50">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Add New Task
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {createTask.isError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  Failed to create task
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 2,
                      message: "Title must be at least 2 characters",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Task name"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button type="submit" disabled={createTask.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {createTask.isPending ? "Adding..." : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
