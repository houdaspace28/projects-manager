using System;

namespace ProjectsManager.Api.Models;

public class TaskItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    public DateTime? DueDate { get; set; }  
    
    public bool IsCompleted { get; set; } = false;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    
    public string ProjectId { get; set; } = string.Empty;
    
    // Navigation property
    public Project Project { get; set; } = null!;
}