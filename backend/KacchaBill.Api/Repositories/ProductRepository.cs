using KacchaBill.Api.Data;
using KacchaBill.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KacchaBill.Api.Repositories;

public class ProductRepository(AppDbContext db) : IProductRepository
{
    public async Task<List<Product>> GetAllAsync() => await db.Products.Include(p => p.Category).OrderBy(p => p.Name).ToListAsync();

    public async Task<Product?> GetByIdAsync(int id) => await db.Products.Include(p => p.Category).FirstOrDefaultAsync(x => x.Id == id);

    public async Task<Product> AddAsync(Product product)
    {
        db.Products.Add(product);
        await db.SaveChangesAsync();
        return (await GetByIdAsync(product.Id))!;
    }

    public async Task<Product?> UpdateAsync(int id, Product input)
    {
        var current = await db.Products.FindAsync(id);
        if (current is null) return null;
        current.Name = input.Name;
        current.CategoryId = input.CategoryId;
        current.Price = input.Price;
        current.DefaultDiscount = input.DefaultDiscount;
        current.IsActive = input.IsActive;
        await db.SaveChangesAsync();
        return (await GetByIdAsync(id))!;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var product = await db.Products.FindAsync(id);
        if (product is null) return false;
        db.Products.Remove(product);
        await db.SaveChangesAsync();
        return true;
    }
}
