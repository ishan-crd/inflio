import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("campaigns").collect();
	},
});

export const getById = query({
	args: { id: v.id("campaigns") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const listByBrand = query({
	args: { brandId: v.id("brands") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("campaigns")
			.withIndex("by_brand", (q) => q.eq("brandId", args.brandId))
			.collect();
	},
});

export const listActive = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("campaigns")
			.withIndex("by_status", (q) => q.eq("status", "active"))
			.collect();
	},
});

export const create = mutation({
	args: {
		brandId: v.id("brands"),
		title: v.string(),
		brief: v.string(),
		longBrief: v.array(v.string()),
		platform: v.string(),
		category: v.string(),
		rate: v.number(),
		currency: v.string(),
		perViews: v.string(),
		minViews: v.string(),
		budget: v.string(),
		deadline: v.string(),
		daysLeft: v.number(),
		spotsLeft: v.number(),
		totalSpots: v.number(),
		trending: v.boolean(),
		color: v.string(),
		tags: v.array(v.string()),
		creatorsJoined: v.number(),
		bonus: v.object({
			threshold: v.string(),
			amount: v.string(),
		}),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("campaigns", args);
	},
});

export const update = mutation({
	args: {
		id: v.id("campaigns"),
		title: v.optional(v.string()),
		brief: v.optional(v.string()),
		longBrief: v.optional(v.array(v.string())),
		platform: v.optional(v.string()),
		category: v.optional(v.string()),
		rate: v.optional(v.number()),
		currency: v.optional(v.string()),
		perViews: v.optional(v.string()),
		minViews: v.optional(v.string()),
		budget: v.optional(v.string()),
		deadline: v.optional(v.string()),
		daysLeft: v.optional(v.number()),
		spotsLeft: v.optional(v.number()),
		totalSpots: v.optional(v.number()),
		trending: v.optional(v.boolean()),
		color: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		creatorsJoined: v.optional(v.number()),
		bonus: v.optional(v.object({ threshold: v.string(), amount: v.string() })),
		status: v.optional(v.string()),
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
