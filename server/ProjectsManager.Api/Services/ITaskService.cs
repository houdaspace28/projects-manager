using ProjectsManager.Api.DTOs;

namespace ProjectsManager.Api.Services;

public interface ITaskService
{
    Task<List<TaskDto>> GetProjectTasksAsync(string projectId, string userId, string? status = null, string? search = null);
    Task<TaskDto?> CreateTaskAsync(string projectId, CreateTaskDto request, string userId);
    Task<TaskDto?> ToggleTaskCompleteAsync(string taskId, string userId);
    Task<bool> DeleteTaskAsync(string taskId, string userId);
}