using System;

namespace ProjectsManager.Api.Models;

public class Project
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }  //optional field
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    
    public string UserId { get; set; } = string.Empty;
    
    // Navigation property
    public User User { get; set; } = null!;
    
    // Navigation property
    public List<TaskItem> Tasks { get; set; } = [];
}
