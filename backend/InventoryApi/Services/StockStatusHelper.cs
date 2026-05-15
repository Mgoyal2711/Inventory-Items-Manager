namespace InventoryApi.Services;

public static class StockStatusHelper
{
    public static string GetStatus(int quantity) => quantity switch
    {
        0 => "Out of Stock",
        < 10 => "Low Stock",
        _ => "In Stock"
    };
}
