using System.ComponentModel.DataAnnotations;

namespace KacchaBill.Api.DTOs;

public class CreateBillDto
{
    [Range(0, 100)] public decimal GstPercent { get; set; }
    [Range(0, 100000)] public decimal DiscountAmount { get; set; }
    [MinLength(1)] public required List<CreateBillItemDto> Items { get; set; }
}

public class CreateBillItemDto
{
    [Required] public int ProductId { get; set; }
    [Range(1, 1000)] public int Quantity { get; set; }
}

public record BillItemDto(int Id, int ProductId, string ProductName, int Quantity, decimal Price, decimal Total);

public record BillDto(int Id, string InvoiceNumber, DateTime CreatedAt, decimal TotalAmount, decimal DiscountAmount, decimal TaxAmount, decimal FinalAmount, IEnumerable<BillItemDto> Items);

public record InsightDto(int Id, string Name, decimal Value);
