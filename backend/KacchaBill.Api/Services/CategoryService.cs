using KacchaBill.Api.DTOs;
using KacchaBill.Api.Models;
using KacchaBill.Api.Repositories;

namespace KacchaBill.Api.Services;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    public async Task<List<CategoryDto>> GetAllAsync() => (await categoryRepository.GetAllAsync()).Select(x => new CategoryDto(x.Id, x.Name)).ToList();

    public async Task<CategoryDto> AddAsync(CreateCategoryDto dto)
    {
        var category = await categoryRepository.AddAsync(new Category { Name = dto.Name });
        return new CategoryDto(category.Id, category.Name);
    }
}
