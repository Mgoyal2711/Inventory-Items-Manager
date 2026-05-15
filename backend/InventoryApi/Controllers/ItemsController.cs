using InventoryApi.DTOs;
using InventoryApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;
    private readonly ILogger<ItemsController> _logger;

    public ItemsController(IItemService itemService, ILogger<ItemsController> logger)
    {
        _itemService = itemService;
        _logger = logger;
    }

    /// <summary>Get inventory summary statistics.</summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(InventoryStatsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<InventoryStatsDto>> GetStats()
    {
        return Ok(await _itemService.GetStatsAsync());
    }

    /// <summary>Get all inventory items with optional search, sort, and pagination.</summary>
    [HttpGet]
    [ProducesResponseType(typeof(PagedResultDto<ItemDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResultDto<ItemDto>>> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? sortBy = "quantity",
        [FromQuery] string? sortDir = "asc",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _itemService.GetAllAsync(search, sortBy, sortDir, page, pageSize);
        return Ok(result);
    }

    /// <summary>Get a single inventory item by ID.</summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(ItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ItemDto>> GetById(int id)
    {
        var item = await _itemService.GetByIdAsync(id);
        if (item is null) return NotFound(new { message = $"Item with id {id} not found." });
        return Ok(item);
    }

    /// <summary>Add a new inventory item.</summary>
    [HttpPost]
    [ProducesResponseType(typeof(ItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ItemDto>> Create([FromBody] CreateItemDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var item = await _itemService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Duplicate SKU on create");
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>Update an existing inventory item.</summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(ItemDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ItemDto>> Update(int id, [FromBody] UpdateItemDto dto)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var item = await _itemService.UpdateAsync(id, dto);
            if (item is null) return NotFound(new { message = $"Item with id {id} not found." });
            return Ok(item);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Duplicate SKU on update");
            return Conflict(new { message = ex.Message });
        }
    }

    /// <summary>Delete an inventory item.</summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _itemService.DeleteAsync(id);
        if (!deleted) return NotFound(new { message = $"Item with id {id} not found." });
        return NoContent();
    }
}
