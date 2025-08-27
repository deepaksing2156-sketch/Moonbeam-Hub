import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getProducts = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.category !== undefined) {
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .paginate(args.paginationOpts);
    } else if (args.featured !== undefined) {
      return await ctx.db
        .query("products")
        .withIndex("by_featured", (q) => q.eq("featured", args.featured))
        .order("desc")
        .paginate(args.paginationOpts);
    } else {
      return await ctx.db
        .query("products")
        .order("desc")
        .paginate(args.paginationOpts);
    }
  },
});

export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .take(8);
  },
});

export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  },
});

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const sampleProducts = [
      {
        name: "Elegant Evening Dress",
        description: "Stunning black evening dress perfect for special occasions. Made with premium fabric and elegant design.",
        price: 129.99,
        originalPrice: 159.99,
        category: "Dresses",
        subcategory: "Evening",
        imageUrl: "https://images.unsplash.com/photo-1566479179817-c5c7133dce39?w=500",
        inStock: true,
        stockCount: 25,
        featured: true,
        tags: ["elegant", "evening", "formal"],
        rating: 4.8,
        reviewCount: 42,
      },
      {
        name: "Casual Summer Top",
        description: "Light and breezy summer top in beautiful floral pattern. Perfect for casual outings.",
        price: 39.99,
        category: "Tops",
        subcategory: "Casual",
        imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
        inStock: true,
        stockCount: 50,
        featured: true,
        tags: ["summer", "casual", "floral"],
        rating: 4.5,
        reviewCount: 28,
      },
      {
        name: "Designer Handbag",
        description: "Luxurious leather handbag with gold accents. Spacious and stylish for everyday use.",
        price: 89.99,
        originalPrice: 119.99,
        category: "Accessories",
        subcategory: "Bags",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
        inStock: true,
        stockCount: 15,
        featured: true,
        tags: ["luxury", "leather", "designer"],
        rating: 4.9,
        reviewCount: 67,
      },
      {
        name: "Comfortable Skinny Jeans",
        description: "High-quality denim jeans with stretch fabric for ultimate comfort. Available in multiple sizes.",
        price: 69.99,
        category: "Bottoms",
        subcategory: "Jeans",
        imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
        inStock: true,
        stockCount: 40,
        featured: false,
        tags: ["denim", "comfortable", "stretchy"],
        rating: 4.6,
        reviewCount: 35,
      },
      {
        name: "Silk Scarf Collection",
        description: "Premium silk scarves in various patterns and colors. Perfect accessory for any outfit.",
        price: 24.99,
        category: "Accessories",
        subcategory: "Scarves",
        imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500",
        inStock: true,
        stockCount: 30,
        featured: true,
        tags: ["silk", "elegant", "versatile"],
        rating: 4.7,
        reviewCount: 19,
      },
      {
        name: "Yoga Workout Set",
        description: "Comfortable and breathable yoga set including leggings and sports bra. Perfect for fitness activities.",
        price: 54.99,
        category: "Activewear",
        subcategory: "Sets",
        imageUrl: "https://images.unsplash.com/photo-1506629905607-bb5bdc3ba86b?w=500",
        inStock: true,
        stockCount: 35,
        featured: true,
        tags: ["fitness", "comfortable", "breathable"],
        rating: 4.8,
        reviewCount: 52,
      },
    ];

    for (const product of sampleProducts) {
      await ctx.db.insert("products", product);
    }

    return "Products seeded successfully";
  },
});