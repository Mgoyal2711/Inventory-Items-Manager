using InventoryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryApi.Data;

public class InventoryDbContext : DbContext
{
    public InventoryDbContext(DbContextOptions<InventoryDbContext> options)
        : base(options)
    {
    }

    public DbSet<Item> Items => Set<Item>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Sku).IsRequired().HasMaxLength(50);
            entity.HasIndex(e => e.Sku).IsUnique();
            entity.Property(e => e.Quantity).IsRequired();
        });

        // Seed sample data for demo
        var seedDate = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        modelBuilder.Entity<Item>().HasData(
            new Item { Id = 1, Name = "Wireless Mouse", Sku = "WM-001", Quantity = 25, CreatedAt = seedDate },
            new Item { Id = 2, Name = "Mechanical Keyboard", Sku = "KB-002", Quantity = 8, CreatedAt = seedDate },
            new Item { Id = 3, Name = "USB-C Hub", Sku = "HUB-003", Quantity = 0, CreatedAt = seedDate }
        );
    }
}
