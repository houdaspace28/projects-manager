using System;
using ProjectsManager.Api.DTOs;

namespace ProjectsManager.Api.Services;

public interface IAuthService
{
   Task<AuthResponseDto?> RegisterAsync(RegisterRequestDto request);
   Task<AuthResponseDto?> LoginAsync(LoginRequestDto request);
}
