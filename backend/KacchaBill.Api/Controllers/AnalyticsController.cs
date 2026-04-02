using KacchaBill.Api.DTOs;
using KacchaBill.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace KacchaBill.Api.Controllers;

[ApiController]
[Route("api/analytics")]
public class AnalyticsController(IAnalyticsService service) : ControllerBase
{
    [HttpGet("top-products")]
    public async Task<ActionResult<List<InsightDto>>> TopProducts() => Ok(await service.TopProductsAsync());

    [HttpGet("top-categories")]
    public async Task<ActionResult<List<InsightDto>>> TopCategories() => Ok(await service.TopCategoriesAsync());
}
