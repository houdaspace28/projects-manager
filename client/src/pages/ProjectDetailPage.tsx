import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useProject, useDeleteProject } from "../hooks/useProjects";
import { useTasks, useCreateTask, useToggleTask, useDeleteTask } from "../hooks/useTasks";
import ConfirmModal from "../components/ConfirmModal";
import type { TaskFilters } from "../api";

interface CreateTaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
}

type DeleteTarget = 
  | { type: "project" }
  | { type: "task"; taskId: string }
  | null;

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({
    status: "all",
    search: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: project, isLoading: projectLoading, error: projectError } = useProject(id!);
  const { data: tasks = [], isLoading: tasksLoading } = useTasks(id!, filters);
  const createTask = useCreateTask(id!);
  const toggleTask = useToggleTask(id!);
  const deleteTask = useDeleteTask(id!);
  const deleteProject = useDeleteProject();

  const {register,handleSubmit,formState: { errors },reset,} = useForm<CreateTaskFormData>();

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTask.mutateAsync({
        title: data.title,
        description: data.description || undefined,
        dueDate: data.dueDate || undefined,
      });
      closeModal();
    } catch {
      //error handled by tanstack query
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await toggleTask.mutateAsync(taskId);
    } catch {
      //error handled by tanstack query
    }
  };

  const handleDeleteTaskClick = (taskId: string) => {
    setDeleteTarget({ type: "task", taskId });
  };

  const handleDeleteProjectClick = () => {
    setDeleteTarget({ type: "project" });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "project") {
        await deleteProject.mutateAsync(id!);
        navigate("/projects");
      } else {
        await deleteTask.mutateAsync(deleteTarget.taskId);
        setDeleteTarget(null);
      }
    } catch {
      //error handled by tanstack query
    }
  };

  const handleDeleteCancel = () => { setDeleteTarget(null);};

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  const isLoading = projectLoading || tasksLoading;
  const isDeleting = deleteProject.isPending || deleteTask.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 border-4 border-slate-200 rounded-full" />
            <div className="absolute top-0 left-0 w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm text-slate-500 font-medium">Loading project...</p>
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mb-4">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-slate-900">Project not found</h3>
          <p className="text-slate-500 mt-1 mb-6">The project you're looking for doesn't exist.</p>
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to projects
            </Link>
          </div>
        </div>
      </header>

      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{project.title}</h1>
                {project.description && (
                  <p className="text-slate-500 mt-1">{project.description}</p>
                )}
              </div>
            </div>
            <button onClick={handleDeleteProjectClick} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-600 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>

        
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-700">Overall Progress</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                project.progress.progressPercentage === 100
                  ? "bg-green-100 text-green-700"
                  : project.progress.progressPercentage > 0
                  ? "bg-amber-100 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}>
                {project.progress.completedTasks}/{project.progress.totalTasks} completed
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  project.progress.progressPercentage === 100
                    ? "bg-green-500"
                    : "bg-slate-900"
                }`}
                style={{ width: `${project.progress.progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {project.progress.progressPercentage}% complete
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
          <button
            onClick={openModal}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Task
          </button>
        </div>

        
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
      
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

           
            <div className="flex gap-2">
              {(["all", "pending", "completed"] as const).map((status) => (
                <button key={status} onClick={() => setFilters(prev => ({ ...prev, status }))} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors 
                  ${
                    filters.status === status
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 border-dashed p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">
              {filters.search || filters.status !== "all" ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="text-slate-500 mt-1 mb-6">
              {filters.search || filters.status !== "all" 
                ? "Try adjusting your filters" 
                : "Add your first task to get started."}
            </p>
            {!filters.search && filters.status === "all" && (
              <button onClick={openModal} className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add a task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4 transition-all hover:shadow-sm ${
                  task.isCompleted ? "bg-slate-50/50" : ""
                }`}
              >
                <button
                  onClick={() => handleToggleTask(task.id)}
                  disabled={toggleTask.isPending}
                  className={`mt-0.5 w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed ${
                    task.isCompleted
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "border-slate-300 hover:border-slate-900"
                  }`}
                >
                  {task.isCompleted && (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium ${task.isCompleted ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mt-1 ${task.isCompleted ? "text-slate-400" : "text-slate-500"}`}>
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <div className={`inline-flex items-center gap-1.5 mt-2 text-xs ${task.isCompleted ? "text-slate-400" : "text-slate-500"}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <button onClick={() => handleDeleteTaskClick(task.id)} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>


      {showModal && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}/>
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-900">Add New Task</h2>
                <p className="text-sm text-slate-500 mt-1">Create a task for this project.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                {createTask.isError && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Failed to create task
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Task Title <span className="text-red-500">*</span>
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
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                    placeholder="Enter task title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Description <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    {...register("description")}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow resize-none"
                    placeholder="Describe the task"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700">
                    Due Date <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="date"
                    {...register("dueDate")}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-shadow"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button type="button" onClick={closeModal} className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createTask.isPending}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {createTask.isPending ? (
                      <>
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Adding...
                      </>
                    ) : (
                      "Add Task"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      
      <ConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.type === "project" ? "Delete Project" : "Delete Task"}
        message={
          deleteTarget?.type === "project"
            ? "Are you sure you want to delete this project? All tasks will be permanently removed. This action cannot be undone."
            : "Are you sure you want to delete this task? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}