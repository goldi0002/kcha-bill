using System.ComponentModel.DataAnnotations;

namespace KacchaBill.Api.DTOs;

public record CategoryDto(int Id, string Name);

public class CreateCategoryDto
{
    [Required] public string Name { get; set; } = string.Empty;
}
