using Microsoft.AspNetCore.Mvc;
using ProjectsManager.Api.DTOs;
using ProjectsManager.Api.Services;

namespace ProjectsManager.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        var result = await authService.RegisterAsync(request);
        if (result is null) return BadRequest(new { message = "Email already exists" });
        return Ok(result);
    }
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var result = await authService.LoginAsync(request);
        if (result is null) return Unauthorized(new { message = "Invalid email or password" });  
        return Ok(result);
    }
}