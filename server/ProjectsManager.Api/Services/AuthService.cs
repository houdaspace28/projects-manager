using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ProjectsManager.Api.Data;
using ProjectsManager.Api.DTOs;
using ProjectsManager.Api.Models;

namespace ProjectsManager.Api.Services;

public class AuthService(AppDbContext context, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request)
    {
        
        var existingUser = await context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (existingUser is not null)
            return null; 
        
        
        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };
        
        context.Users.Add(user);
        await context.SaveChangesAsync();
        
        
        var token = GenerateJwtToken(user);
        
        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            UserId = user.Id
        };
    }
    
    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto request)
    {
        // Find user by email
        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user is null)
            return null; 
        
        
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null; 
        
        
        var token = GenerateJwtToken(user);
        
        return new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            UserId = user.Id
        };
    }
    
    private string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email)
        };
        
        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}