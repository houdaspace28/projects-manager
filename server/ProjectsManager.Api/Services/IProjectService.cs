using System;
using ProjectsManager.Api.DTOs;

namespace ProjectsManager.Api.Services;

public interface IProjectService
{
    Task<List<ProjectDto>> GetUserProjectsAsync(string userId);
    Task<ProjectDto?> GetProjectByIdAsync(string projectId, string userId);
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto request, string userId);
    Task<bool> DeleteProjectAsync(string projectId, string userId);
}
