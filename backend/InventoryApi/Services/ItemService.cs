using InventoryApi.Data;
using InventoryApi.DTOs;
using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Services;

public class ItemService : IItemService
{
    private readonly InventoryDbContext _context;

    public ItemService(InventoryDbContext context)
    {
        _context = context;
    }

    public async Task<PagedResultDto<ItemDto>> GetAllAsync(
        string? search,
        string? sortBy,
        string? sortDir,
        int page,
        int pageSize)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _context.Items.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(i =>
                i.Name.ToLower().Contains(term) ||
                i.Sku.ToLower().Contains(term));
        }

        var descending = string.Equals(sortDir, "desc", StringComparison.OrdinalIgnoreCase);
        query = (sortBy?.ToLower()) switch
        {
            "name" => descending ? query.OrderByDescending(i => i.Name) : query.OrderBy(i => i.Name),
            "sku" => descending ? query.OrderByDescending(i => i.Sku) : query.OrderBy(i => i.Sku),
            "quantity" or _ => descending ? query.OrderByDescending(i => i.Quantity) : query.OrderBy(i => i.Quantity),
        };

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResultDto<ItemDto>
        {
            Items = items.Select(MapToDto),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
        };
    }

    public async Task<ItemDto?> GetByIdAsync(int id)
    {
        var item = await _context.Items.AsNoTracking().FirstOrDefaultAsync(i => i.Id == id);
        return item is null ? null : MapToDto(item);
    }

    public async Task<ItemDto> CreateAsync(CreateItemDto dto)
    {
        var sku = dto.Sku.Trim().ToUpperInvariant();

        if (await _context.Items.AnyAsync(i => i.Sku == sku))
            throw new InvalidOperationException($"SKU '{sku}' already exists.");

        var item = new Item
        {
            Name = dto.Name.Trim(),
            Sku = sku,
            Quantity = dto.Quantity,
            CreatedAt = DateTime.UtcNow
        };

        _context.Items.Add(item);
        await _context.SaveChangesAsync();

        return MapToDto(item);
    }

    public async Task<ItemDto?> UpdateAsync(int id, UpdateItemDto dto)
    {
        var item = await _context.Items.FindAsync(id);
        if (item is null) return null;

        var sku = dto.Sku.Trim().ToUpperInvariant();

        if (await _context.Items.AnyAsync(i => i.Sku == sku && i.Id != id))
            throw new InvalidOperationException($"SKU '{sku}' already exists.");

        item.Name = dto.Name.Trim();
        item.Sku = sku;
        item.Quantity = dto.Quantity;
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return MapToDto(item);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var item = await _context.Items.FindAsync(id);
        if (item is null) return false;

        _context.Items.Remove(item);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<InventoryStatsDto> GetStatsAsync()
    {
        var items = await _context.Items.AsNoTracking().Select(i => i.Quantity).ToListAsync();
        return new InventoryStatsDto
        {
            Total = items.Count,
            InStock = items.Count(q => q >= 10),
            LowStock = items.Count(q => q > 0 && q < 10),
            OutOfStock = items.Count(q => q == 0)
        };
    }

    private static ItemDto MapToDto(Item item) => new()
    {
        Id = item.Id,
        Name = item.Name,
        Sku = item.Sku,
        Quantity = item.Quantity,
        StockStatus = StockStatusHelper.GetStatus(item.Quantity)
    };
}
