using System.ComponentModel.DataAnnotations;

namespace ProjectsManager.Api.DTOs;

public class CreateProjectDto
{
    [Required(ErrorMessage = "Title is required")]
    [MinLength(2, ErrorMessage = "Title must be at least 2 characters")]
    [MaxLength(40, ErrorMessage = "Title cannot exceed 40 characters")]
    public required string Title { get; set; }

    [MaxLength(100, ErrorMessage = "Description cannot exceed 100 characters")]
    public string? Description { get; set; }
}

public class ProjectDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public ProjectProgressDto Progress { get; set; } = null!;
}

public class ProjectProgressDto
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public double ProgressPercentage { get; set; }
}