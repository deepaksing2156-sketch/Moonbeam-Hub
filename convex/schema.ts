import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), // Auth user ID
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    city: v.optional(v.string()),
    zipCode: v.optional(v.string()),
    preferences: v.optional(v.array(v.string())),
  }).index("by_user_id", ["userId"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    category: v.string(),
    subcategory: v.optional(v.string()),
    imageUrl: v.string(),
    images: v.optional(v.array(v.string())),
    inStock: v.boolean(),
    stockCount: v.number(),
    featured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
  }).index("by_category", ["category"])
    .index("by_featured", ["featured"]),

  orders: defineTable({
    userId: v.string(),
    orderNumber: v.string(),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("shipped"), v.literal("delivered"), v.literal("cancelled")),
    items: v.array(v.object({
      productId: v.id("products"),
      name: v.string(),
      price: v.number(),
      quantity: v.number(),
      imageUrl: v.string(),
    })),
    subtotal: v.number(),
    tax: v.number(),
    shipping: v.number(),
    total: v.number(),
    shippingAddress: v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      zipCode: v.string(),
      phone: v.string(),
    }),
    paymentMethod: v.string(),
  }).index("by_user_id", ["userId"])
    .index("by_order_number", ["orderNumber"]),

  cart: defineTable({
    userId: v.string(),
    productId: v.id("products"),
    quantity: v.number(),
  }).index("by_user_id", ["userId"])
    .index("by_user_and_product", ["userId", "productId"]),

  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    status: v.union(v.literal("new"), v.literal("responded"), v.literal("closed")),
  }),

  newsletters: defineTable({
    email: v.string(),
    subscribedAt: v.number(),
    active: v.boolean(),
  }).index("by_email", ["email"]),
});