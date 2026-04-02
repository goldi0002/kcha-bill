using KacchaBill.Api.DTOs;
using KacchaBill.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace KacchaBill.Api.Controllers;

[ApiController]
[Route("api/bills")]
public class BillsController(IBillService service) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<BillDto>> Post([FromBody] CreateBillDto dto) => Ok(await service.CreateAsync(dto));

    [HttpGet]
    public async Task<ActionResult<List<BillDto>>> Get() => Ok(await service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BillDto>> GetById(int id)
    {
        var bill = await service.GetByIdAsync(id);
        return bill is null ? NotFound() : Ok(bill);
    }
}
