namespace InventoryApi.DTOs;

public class InventoryStatsDto
{
    public int Total { get; set; }
    public int InStock { get; set; }
    public int LowStock { get; set; }
    public int OutOfStock { get; set; }
}
