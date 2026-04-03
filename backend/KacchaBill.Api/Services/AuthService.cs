using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using KacchaBill.Api.Data;
using KacchaBill.Api.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace KacchaBill.Api.Services;

public class AuthService(AppDbContext db, IConfiguration configuration) : IAuthService
{
    public async Task<AuthResponseDto?> LoginAsync(LoginRequestDto dto)
    {
        var username = dto.Username.Trim();
        var passwordHash = Hash(dto.Password);

        var user = await db.Users.FirstOrDefaultAsync(u => u.Username == username && u.PasswordHash == passwordHash);
        if (user is null) return null;

        var key = configuration["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key");
        var issuer = configuration["Jwt:Issuer"] ?? "KacchaBill";
        var audience = configuration["Jwt:Audience"] ?? "KacchaBill.Client";
        var expiresAt = DateTime.UtcNow.AddHours(8);

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256
        );

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var serialized = new JwtSecurityTokenHandler().WriteToken(token);
        return new AuthResponseDto(serialized, user.Username, user.Role, expiresAt);
    }

    public static string Hash(string value)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(value));
        return Convert.ToHexString(bytes);
    }
}
