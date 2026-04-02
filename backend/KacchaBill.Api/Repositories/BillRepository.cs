using KacchaBill.Api.Data;
using KacchaBill.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KacchaBill.Api.Repositories;

public class BillRepository(AppDbContext db) : IBillRepository
{
    public async Task<Bill> AddAsync(Bill bill)
    {
        db.Bills.Add(bill);
        await db.SaveChangesAsync();
        return (await GetByIdAsync(bill.Id))!;
    }

    public async Task<List<Bill>> GetAllAsync() => await db.Bills
        .Include(b => b.BillItems)
        .ThenInclude(i => i.Product)
        .OrderByDescending(b => b.CreatedAt)
        .ToListAsync();

    public async Task<Bill?> GetByIdAsync(int id) => await db.Bills
        .Include(b => b.BillItems)
        .ThenInclude(i => i.Product)
        .FirstOrDefaultAsync(b => b.Id == id);
}
