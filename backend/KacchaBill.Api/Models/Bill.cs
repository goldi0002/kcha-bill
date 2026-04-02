namespace KacchaBill.Api.Models;

public class Bill
{
    public int Id { get; set; }
    public required string InvoiceNumber { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal FinalAmount { get; set; }

    public ICollection<BillItem> BillItems { get; set; } = new List<BillItem>();
}
