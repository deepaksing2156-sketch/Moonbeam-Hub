import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addToCart = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Check if item already in cart
    const existingItem = await ctx.db
      .query("cart")
      .withIndex("by_user_and_product", (q) => 
        q.eq("userId", identity.subject).eq("productId", args.productId)
      )
      .unique();

    if (existingItem) {
      // Update quantity
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + args.quantity,
      });
      return existingItem._id;
    } else {
      // Add new item
      return await ctx.db.insert("cart", {
        userId: identity.subject,
        productId: args.productId,
        quantity: args.quantity,
      });
    }
  },
});

export const getCartItems = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .collect();

    // Get product details for each cart item
    const itemsWithProducts = await Promise.all(
      cartItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        return {
          ...item,
          product,
        };
      })
    );

    return itemsWithProducts;
  },
});

export const updateCartItemQuantity = mutation({
  args: {
    cartItemId: v.id("cart"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.cartItemId);
    } else {
      await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
    }
    
    return args.cartItemId;
  },
});

export const removeFromCart = mutation({
  args: {
    cartItemId: v.id("cart"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    await ctx.db.delete(args.cartItemId);
    return args.cartItemId;
  },
});

export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return "Cart cleared";
  },
});