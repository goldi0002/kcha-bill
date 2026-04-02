using KacchaBill.Api.DTOs;
using KacchaBill.Api.Models;

namespace KacchaBill.Api.Repositories;

public interface IProductRepository
{
    Task<List<Product>> GetAllAsync();
    Task<Product?> GetByIdAsync(int id);
    Task<Product> AddAsync(Product product);
    Task<Product?> UpdateAsync(int id, Product product);
    Task<bool> DeleteAsync(int id);
}

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();
    Task<Category> AddAsync(Category category);
}

public interface IBillRepository
{
    Task<Bill> AddAsync(Bill bill);
    Task<List<Bill>> GetAllAsync();
    Task<Bill?> GetByIdAsync(int id);
}

public interface IAnalyticsRepository
{
    Task<List<InsightDto>> GetTopProductsAsync(int top = 5);
    Task<List<InsightDto>> GetTopCategoriesAsync(int top = 5);
}
