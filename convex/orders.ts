import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrder = mutation({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
    })),
    shippingAddress: v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      zipCode: v.string(),
      phone: v.string(),
    }),
    paymentMethod: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Calculate order details
    let subtotal = 0;
    const orderItems = [];

    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product || !product.inStock) {
        throw new Error(`Product ${item.productId} is not available`);
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        productId: item.productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        imageUrl: product.imageUrl,
      });
    }

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const orderId = await ctx.db.insert("orders", {
      userId: identity.subject,
      orderNumber,
      status: "pending",
      items: orderItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: args.shippingAddress,
      paymentMethod: args.paymentMethod,
    });

    // Clear user's cart
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .collect();

    for (const cartItem of cartItems) {
      await ctx.db.delete(cartItem._id);
    }

    return { orderId, orderNumber };
  },
});

export const getUserOrders = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { page: [], isDone: true, continueCursor: null };
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const getOrder = query({
  args: { orderNumber: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("orders")
      .withIndex("by_order_number", (q) => q.eq("orderNumber", args.orderNumber))
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .unique();
  },
});

export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.union(v.literal("pending"), v.literal("processing"), v.literal("shipped"), v.literal("delivered"), v.literal("cancelled")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, { status: args.status });
    return args.orderId;
  },
});