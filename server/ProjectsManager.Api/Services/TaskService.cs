using Microsoft.EntityFrameworkCore;
using ProjectsManager.Api.Data;
using ProjectsManager.Api.DTOs;
using ProjectsManager.Api.Models;

namespace ProjectsManager.Api.Services;

public class TaskService(AppDbContext context) : ITaskService
{
    public async Task<List<TaskDto>> GetProjectTasksAsync(string projectId, string userId)
    {
        var project = await context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

        if (project is null) return [];

        var tasks = await context.Tasks.Where(t => t.ProjectId == projectId).ToListAsync();

        return tasks.Select(MapToDto).ToList();
    }

    public async Task<TaskDto?> CreateTaskAsync(string projectId, CreateTaskDto request, string userId)
    {
        var project = await context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);

        if (project is null) return null;

        var task = new TaskItem
        {
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            ProjectId = projectId
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();
        return MapToDto(task);
    }

    public async Task<TaskDto?> ToggleTaskCompleteAsync(string taskId, string userId)
    {
        var task = await context.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

        if (task is null) return null;

        task.IsCompleted = !task.IsCompleted;
        await context.SaveChangesAsync();
        return MapToDto(task);
    }

    public async Task<bool> DeleteTaskAsync(string taskId, string userId)
    {
        var task = await context.Tasks.Include(t => t.Project).FirstOrDefaultAsync(t => t.Id == taskId && t.Project.UserId == userId);

        if (task is null) return false;

        context.Tasks.Remove(task);
        await context.SaveChangesAsync();
        return true;
    }

    private static TaskDto MapToDto(TaskItem task)
    {
        return new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            IsCompleted = task.IsCompleted,
            CreatedAt = task.CreatedAt
        };
    }
}