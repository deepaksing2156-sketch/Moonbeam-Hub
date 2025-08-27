import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contacts", {
      ...args,
      status: "new",
    });
  },
});

export const subscribeNewsletter = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("newsletters")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      if (!existing.active) {
        await ctx.db.patch(existing._id, {
          active: true,
          subscribedAt: Date.now(),
        });
      }
      return existing._id;
    } else {
      return await ctx.db.insert("newsletters", {
        email: args.email,
        subscribedAt: Date.now(),
        active: true,
      });
    }
  },
});

export const getContacts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contacts").order("desc").take(50);
  },
});