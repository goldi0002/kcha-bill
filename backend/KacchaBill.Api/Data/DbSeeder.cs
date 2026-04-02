using KacchaBill.Api.Models;

namespace KacchaBill.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        if (db.Categories.Any()) return;

        var categories = new List<Category>
        {
            new() { Name = "Grocery" },
            new() { Name = "Biscuits" },
            new() { Name = "Electronics" }
        };
        db.Categories.AddRange(categories);
        db.SaveChanges();

        var products = new List<Product>
        {
            new() { Name = "Basmati Rice", CategoryId = categories[0].Id, Price = 120 },
            new() { Name = "Atta", CategoryId = categories[0].Id, Price = 55 },
            new() { Name = "Mustard Oil", CategoryId = categories[0].Id, Price = 180 },
            new() { Name = "Sugar", CategoryId = categories[0].Id, Price = 45 },
            new() { Name = "Parle-G", CategoryId = categories[1].Id, Price = 10 },
            new() { Name = "Oreo", CategoryId = categories[1].Id, Price = 40 },
            new() { Name = "Bourbon", CategoryId = categories[1].Id, Price = 25 },
            new() { Name = "Monaco", CategoryId = categories[1].Id, Price = 20 },
            new() { Name = "USB Cable", CategoryId = categories[2].Id, Price = 149 },
            new() { Name = "LED Bulb", CategoryId = categories[2].Id, Price = 75 },
            new() { Name = "Extension Board", CategoryId = categories[2].Id, Price = 349 },
            new() { Name = "Phone Stand", CategoryId = categories[2].Id, Price = 199 }
        };

        db.Products.AddRange(products);
        db.SaveChanges();
    }
}
