using KacchaBill.Api.DTOs;
using KacchaBill.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace KacchaBill.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/products")]
public class ProductsController(IProductService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ProductDto>>> Get() => Ok(await service.GetAllAsync());

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Post([FromBody] UpsertProductDto dto) => Ok(await service.AddAsync(dto));

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ProductDto>> Put(int id, [FromBody] UpsertProductDto dto)
    {
        var item = await service.UpdateAsync(id, dto);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id) => await service.DeleteAsync(id) ? NoContent() : NotFound();
}
