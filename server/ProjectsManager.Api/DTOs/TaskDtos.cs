using System;

namespace ProjectsManager.Api.DTOs;

public class CreateTaskDto
{
  public required string Title { get; set; }
  public required string? Description { get; set; }
  public DateTime? DueDate { get; set; }
}


public class TaskDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string? Description { get; set; }
    public DateTime? DueDate { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}
