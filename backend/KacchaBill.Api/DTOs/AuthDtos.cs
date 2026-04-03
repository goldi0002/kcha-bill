using System.ComponentModel.DataAnnotations;

namespace KacchaBill.Api.DTOs;

public class LoginRequestDto
{
    [Required] public string Username { get; set; } = string.Empty;
    [Required] public string Password { get; set; } = string.Empty;
}

public record AuthResponseDto(string Token, string Username, string Role, DateTime ExpiresAtUtc);
