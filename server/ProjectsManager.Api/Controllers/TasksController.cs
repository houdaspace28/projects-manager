using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectsManager.Api.DTOs;
using ProjectsManager.Api.Services;

namespace ProjectsManager.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class TasksController(ITaskService taskService) : ControllerBase
{
    [HttpGet("projects/{projectId}/tasks")]
    public async Task<IActionResult> GetProjectTasks(string projectId, [FromQuery] string? status = null, [FromQuery] string? search = null)
    {
        var userId = GetUserId();
        var tasks = await taskService.GetProjectTasksAsync(projectId, userId, status, search);
        return Ok(tasks);
    }

    [HttpPost("projects/{projectId}/tasks")]
    public async Task<IActionResult> Create(string projectId, CreateTaskDto request)
    {
        var userId = GetUserId();
        var task = await taskService.CreateTaskAsync(projectId, request, userId);
        if (task is null) return NotFound(new { message = "Project not found" });
        return Created($"api/tasks/{task.Id}", task);
    }

    [HttpPatch("tasks/{id}/toggle")]
    public async Task<IActionResult> ToggleComplete(string id)
    {
        var userId = GetUserId();
        var task = await taskService.ToggleTaskCompleteAsync(id, userId);
        if (task is null) return NotFound(new { message = "Task not found" });
        return Ok(task);
    }

    [HttpDelete("tasks/{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = GetUserId();
        var deleted = await taskService.DeleteTaskAsync(id, userId);
        if (!deleted) return NotFound(new { message = "Task not found" });
        return NoContent();
    }

    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }
}