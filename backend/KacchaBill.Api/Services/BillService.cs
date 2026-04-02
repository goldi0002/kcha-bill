using KacchaBill.Api.DTOs;
using KacchaBill.Api.Models;
using KacchaBill.Api.Repositories;

namespace KacchaBill.Api.Services;

public class BillService(IBillRepository billRepository, IProductRepository productRepository) : IBillService
{
    public async Task<BillDto> CreateAsync(CreateBillDto dto)
    {
        var items = new List<BillItem>();
        decimal subTotal = 0;

        foreach (var item in dto.Items)
        {
            var product = await productRepository.GetByIdAsync(item.ProductId) ?? throw new InvalidOperationException($"Product {item.ProductId} not found");
            var lineTotal = product.Price * item.Quantity;
            subTotal += lineTotal;
            items.Add(new BillItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                Price = product.Price,
                Total = lineTotal
            });
        }

        var taxable = Math.Max(0, subTotal - dto.DiscountAmount);
        var tax = taxable * dto.GstPercent / 100;

        var bill = new Bill
        {
            InvoiceNumber = $"KB-{DateTime.UtcNow:yyyyMMddHHmmss}",
            TotalAmount = subTotal,
            DiscountAmount = dto.DiscountAmount,
            TaxAmount = tax,
            FinalAmount = taxable + tax,
            BillItems = items
        };

        return Map(await billRepository.AddAsync(bill));
    }

    public async Task<List<BillDto>> GetAllAsync() => (await billRepository.GetAllAsync()).Select(Map).ToList();

    public async Task<BillDto?> GetByIdAsync(int id)
    {
        var bill = await billRepository.GetByIdAsync(id);
        return bill is null ? null : Map(bill);
    }

    private static BillDto Map(Bill bill) => new(
        bill.Id,
        bill.InvoiceNumber,
        bill.CreatedAt,
        bill.TotalAmount,
        bill.DiscountAmount,
        bill.TaxAmount,
        bill.FinalAmount,
        bill.BillItems.Select(i => new BillItemDto(i.Id, i.ProductId, i.Product?.Name ?? string.Empty, i.Quantity, i.Price, i.Total))
    );
}
