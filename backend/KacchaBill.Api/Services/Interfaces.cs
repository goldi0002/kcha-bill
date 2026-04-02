using KacchaBill.Api.DTOs;

namespace KacchaBill.Api.Services;

public interface IProductService
{
    Task<List<ProductDto>> GetAllAsync();
    Task<ProductDto> AddAsync(UpsertProductDto dto);
    Task<ProductDto?> UpdateAsync(int id, UpsertProductDto dto);
    Task<bool> DeleteAsync(int id);
}

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
    Task<CategoryDto> AddAsync(CreateCategoryDto dto);
}

public interface IBillService
{
    Task<BillDto> CreateAsync(CreateBillDto dto);
    Task<List<BillDto>> GetAllAsync();
    Task<BillDto?> GetByIdAsync(int id);
}

public interface IAnalyticsService
{
    Task<List<InsightDto>> TopProductsAsync();
    Task<List<InsightDto>> TopCategoriesAsync();
}
