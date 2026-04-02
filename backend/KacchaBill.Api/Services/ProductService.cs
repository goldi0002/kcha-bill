using KacchaBill.Api.DTOs;
using KacchaBill.Api.Models;
using KacchaBill.Api.Repositories;

namespace KacchaBill.Api.Services;

public class ProductService(IProductRepository productRepository) : IProductService
{
    public async Task<List<ProductDto>> GetAllAsync() => (await productRepository.GetAllAsync()).Select(Map).ToList();

    public async Task<ProductDto> AddAsync(UpsertProductDto dto)
    {
        var product = await productRepository.AddAsync(new Product
        {
            Name = dto.Name,
            CategoryId = dto.CategoryId,
            Price = dto.Price,
            DefaultDiscount = dto.DefaultDiscount,
            IsActive = dto.IsActive
        });
        return Map(product);
    }

    public async Task<ProductDto?> UpdateAsync(int id, UpsertProductDto dto)
    {
        var updated = await productRepository.UpdateAsync(id, new Product
        {
            Name = dto.Name,
            CategoryId = dto.CategoryId,
            Price = dto.Price,
            DefaultDiscount = dto.DefaultDiscount,
            IsActive = dto.IsActive
        });
        return updated is null ? null : Map(updated);
    }

    public Task<bool> DeleteAsync(int id) => productRepository.DeleteAsync(id);

    private static ProductDto Map(Product p) => new(p.Id, p.Name, p.CategoryId, p.Category?.Name ?? string.Empty, p.Price, p.DefaultDiscount, p.IsActive, p.CreatedAt);
}
