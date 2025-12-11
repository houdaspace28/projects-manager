using System;

namespace ProjectsManager.Api.DTOs;

public class CreateProjectDto
{
  public required string Title { get; set; }
  public required string? Description { get; set; }
}


public class ProjectDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public ProjectProgressDto Progress { get; set; } = null!;
}


public class ProjectProgressDto
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public double ProgressPercentage { get; set; }
}


