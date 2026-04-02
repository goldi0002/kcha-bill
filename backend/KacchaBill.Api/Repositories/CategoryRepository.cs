using KacchaBill.Api.Data;
using KacchaBill.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KacchaBill.Api.Repositories;

public class CategoryRepository(AppDbContext db) : ICategoryRepository
{
    public async Task<List<Category>> GetAllAsync() => await db.Categories.OrderBy(c => c.Name).ToListAsync();

    public async Task<Category> AddAsync(Category category)
    {
        db.Categories.Add(category);
        await db.SaveChangesAsync();
        return category;
    }
}
