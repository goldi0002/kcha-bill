using KacchaBill.Api.Data;
using KacchaBill.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace KacchaBill.Api.Repositories;

public class AnalyticsRepository(AppDbContext db) : IAnalyticsRepository
{
    public async Task<List<InsightDto>> GetTopProductsAsync(int top = 5)
        => await db.BillItems
            .GroupBy(i => new { i.ProductId, i.Product!.Name })
            .Select(g => new InsightDto(g.Key.ProductId, g.Key.Name, g.Sum(i => i.Quantity)))
            .OrderByDescending(x => x.Value)
            .Take(top)
            .ToListAsync();

    public async Task<List<InsightDto>> GetTopCategoriesAsync(int top = 5)
        => await db.BillItems
            .GroupBy(i => new { i.Product!.CategoryId, i.Product!.Category!.Name })
            .Select(g => new InsightDto(g.Key.CategoryId, g.Key.Name, g.Sum(i => i.Total)))
            .OrderByDescending(x => x.Value)
            .Take(top)
            .ToListAsync();
}
