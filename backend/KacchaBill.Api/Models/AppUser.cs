namespace KacchaBill.Api.Models;

public class AppUser
{
    public int Id { get; set; }
    public required string Username { get; set; }
    public required string PasswordHash { get; set; }
    public string Role { get; set; } = "Owner";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
