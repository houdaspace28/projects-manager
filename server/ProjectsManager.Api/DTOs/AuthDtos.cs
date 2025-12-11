using System;

namespace ProjectsManager.Api.DTOs;

public class RegisterRequestDto
{
   public required string Email {get; set;}
   public required string Password { get; set; }
}


public class LoginRequestDto
{
   public required string Email {get; set;}
   public required string Password { get; set; }
}


public class AuthResponseDto
{
    public required string Token { get; set;}
    public required string UserId { get; set; }
    public required string Email { get; set; }
}
