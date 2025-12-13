import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/useAuth";
import { useProjects, useCreateProject, useDeleteProject } from "../hooks/useProjects";

interface CreateProjectFormData {
  title: string;
  description?: string;
}

export default function ProjectsPage() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const { data: projects = [], isLoading, error } = useProjects();
  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();

  const {register, handleSubmit, formState: { errors }, reset,} = useForm<CreateProjectFormData>();

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      await createProject.mutateAsync({
        title: data.title,
        description: data.description || undefined,
      });
      closeModal();
    } catch {
      // handled by tanStack query
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project and all its tasks?")) return;

    try {
      await deleteProject.mutateAsync(id);
    } catch {
      // handled tanStack query
    }
  };

  const openModal = () => setShowModal(true);

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      
      <header className="bg-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Projects Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:underline">
              Logout
            </button>
          </div>
        </div>
      </header>

      
      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6">
            Failed to load projects
          </div>
        )}

        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Your Projects ({projects.length})
          </h2>
          <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            + New Project
          </button>
        </div>

        
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No projects yet. Create your first!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <Link to={`/projects/${project.id}`} className="block p-5">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}

                  
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {project.progress.completedTasks}/
                        {project.progress.totalTasks} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 transition-all" style={{width: `${project.progress.progressPercentage}%`}}/>
                    </div>
                  </div>
                </Link>

                <div className="px-5 pb-4">
                  <button onClick={() => handleDelete(project.id)} disabled={deleteProject.isPending} className="text-xs text-red-500 hover:underline disabled:opacity-50">
                    {deleteProject.isPending ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

     
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Create New Project
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {createProject.isError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  Failed to create project
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
                  placeholder="Project name"
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

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button type="submit" disabled={createProject.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                  {createProject.isPending ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}