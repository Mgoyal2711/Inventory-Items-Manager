using InventoryApi.DTOs;

namespace InventoryApi.Services;

public interface IItemService
{
    Task<PagedResultDto<ItemDto>> GetAllAsync(string? search, string? sortBy, string? sortDir, int page, int pageSize);
    Task<ItemDto?> GetByIdAsync(int id);
    Task<ItemDto> CreateAsync(CreateItemDto dto);
    Task<ItemDto?> UpdateAsync(int id, UpdateItemDto dto);
    Task<bool> DeleteAsync(int id);
    Task<InventoryStatsDto> GetStatsAsync();
}
