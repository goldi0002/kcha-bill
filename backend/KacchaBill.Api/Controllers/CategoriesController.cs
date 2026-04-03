using KacchaBill.Api.DTOs;
using KacchaBill.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KacchaBill.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/categories")]
public class CategoriesController(ICategoryService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> Get() => Ok(await service.GetAllAsync());

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Post([FromBody] CreateCategoryDto dto) => Ok(await service.AddAsync(dto));
}
