using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectsManager.Api.DTOs;
using ProjectsManager.Api.Services;

namespace ProjectsManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]  
public class ProjectsController(IProjectService projectService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = GetUserId();
        var projects = await projectService.GetUserProjectsAsync(userId);
        return Ok(projects);
    }
    
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var userId = GetUserId();
        var project = await projectService.GetProjectByIdAsync(id, userId);
        if (project is null) return NotFound(new { message = "Project not found" });
        return Ok(project);
    }
    
    [HttpPost]
    public async Task<IActionResult> Create(CreateProjectDto request)
    {
        var userId = GetUserId();
        var project = await projectService.CreateProjectAsync(request, userId);
        return CreatedAtAction(nameof(GetById), new { id = project.Id }, project);
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = GetUserId();
        var deleted = await projectService.DeleteProjectAsync(id, userId);
        if (!deleted) return NotFound(new { message = "Project not found" });
        return NoContent();
    }
    
    //method to extract userId from JWT token
    private string GetUserId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }
}