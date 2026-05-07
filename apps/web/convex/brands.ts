import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const getByUserId = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("brands")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.first();
	},
});

export const onboard = mutation({
	args: {
		userId: v.string(),
		company: v.string(),
		website: v.string(),
		role: v.string(),
		industry: v.string(),
		goal: v.string(),
		budget: v.string(),
	},
	handler: async (ctx, args) => {
		const handle = args.company
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
		return await ctx.db.insert("brands", {
			userId: args.userId,
			name: args.company,
			handle,
			logoColors: ["#1e1e24", "#f5f5f5"],
			bio: `${args.industry} brand focused on ${args.goal}`,
			followers: "0",
			rating: "—",
			totalPaidOut: "₹0",
			responseTime: "—",
			website: args.website || undefined,
			category: args.industry,
		});
	},
});

export const create = mutation({
	args: {
		userId: v.optional(v.string()),
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
		userId: v.optional(v.string()),
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
