import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("brands").collect();
	},
});

export const getById = query({
	args: { id: v.id("brands") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const getByHandle = query({
	args: { handle: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("brands")
			.withIndex("by_handle", (q) => q.eq("handle", args.handle))
			.first();
	},
});

export const create = mutation({
	args: {
		name: v.string(),
		handle: v.string(),
		logoColors: v.array(v.string()),
		bio: v.string(),
		followers: v.string(),
		rating: v.string(),
		totalPaidOut: v.string(),
		responseTime: v.string(),
		website: v.optional(v.string()),
		category: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("brands", args);
	},
});

export const update = mutation({
	args: {
		id: v.id("brands"),
		name: v.optional(v.string()),
		handle: v.optional(v.string()),
		logoColors: v.optional(v.array(v.string())),
		bio: v.optional(v.string()),
		followers: v.optional(v.string()),
		rating: v.optional(v.string()),
		totalPaidOut: v.optional(v.string()),
		responseTime: v.optional(v.string()),
		website: v.optional(v.string()),
		category: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const { id, ...fields } = args;
		const updates: Record<string, unknown> = {};
		for (const [k, val] of Object.entries(fields)) {
			if (val !== undefined) updates[k] = val;
		}
		await ctx.db.patch(id, updates);
	},
});
