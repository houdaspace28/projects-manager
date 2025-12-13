using System;
using Microsoft.EntityFrameworkCore;
using ProjectsManager.Api.Data;
using ProjectsManager.Api.DTOs;
using ProjectsManager.Api.Models;

namespace ProjectsManager.Api.Services;

public class ProjectService(AppDbContext context) : IProjectService
{
    public async Task<List<ProjectDto>> GetUserProjectsAsync(string userId)
    {
        var projects = await context.Projects
            .Where(p => p.UserId == userId)
            .Include(p => p.Tasks)
            .ToListAsync(); 
        return projects.Select(MapToDto).ToList();
    }
    
    public async Task<ProjectDto?> GetProjectByIdAsync(string projectId, string userId)
    {
        var project = await context.Projects
            .Where(p => p.Id == projectId && p.UserId == userId)
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync();
        if (project is null) return null;
        return MapToDto(project);
    }
    
    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto request, string userId)
    {
        var project = new Project
        {
            Title = request.Title,
            Description = request.Description,
            UserId = userId
        };
        
        context.Projects.Add(project);
        await context.SaveChangesAsync();
        return MapToDto(project);
    }
    
    public async Task<bool> DeleteProjectAsync(string projectId, string userId)
    {
        var project = await context.Projects.FirstOrDefaultAsync(p => p.Id == projectId && p.UserId == userId);
        
        if (project is null) return false;
        
        context.Projects.Remove(project);
        await context.SaveChangesAsync();
        return true;
    }
    
    private static ProjectDto MapToDto(Project project)
    {
        var totalTasks = project.Tasks.Count;
        var completedTasks = project.Tasks.Count(t => t.IsCompleted);
        var progressPercentage = totalTasks > 0 ? Math.Round((double)completedTasks / totalTasks * 100, 1) : 0;
        
        return new ProjectDto
        {
            Id = project.Id,
            Title = project.Title,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            Progress = new ProjectProgressDto
            {
                TotalTasks = totalTasks,
                CompletedTasks = completedTasks,
                ProgressPercentage = progressPercentage
            }
        };
    }
}
