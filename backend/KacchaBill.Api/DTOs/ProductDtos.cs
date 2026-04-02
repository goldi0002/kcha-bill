using System.ComponentModel.DataAnnotations;

namespace KacchaBill.Api.DTOs;

public record ProductDto(int Id, string Name, int CategoryId, string CategoryName, decimal Price, decimal? DefaultDiscount, bool IsActive, DateTime CreatedAt);

public class UpsertProductDto
{
    [Required] public string Name { get; set; } = string.Empty;
    [Required] public int CategoryId { get; set; }
    [Range(0, 100000)] public decimal Price { get; set; }
    public decimal? DefaultDiscount { get; set; }
    public bool IsActive { get; set; } = true;
}
