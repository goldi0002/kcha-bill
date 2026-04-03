using KacchaBill.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KacchaBill.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Bill> Bills => Set<Bill>();
    public DbSet<BillItem> BillItems => Set<BillItem>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Bill>()
            .Property(p => p.FinalAmount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<BillItem>()
            .Property(p => p.Total)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<AppUser>()
            .HasIndex(u => u.Username)
            .IsUnique();
    }
}
