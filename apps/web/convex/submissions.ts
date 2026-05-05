import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const create = mutation({
	args: {
		userId: v.string(),
		userName: v.string(),
		userImage: v.optional(v.string()),
		campaignId: v.id("campaigns"),
		applicationId: v.id("applications"),
		platform: v.string(),
		contentUrl: v.string(),
		contentType: v.string(),
		views: v.optional(v.number()),
		likes: v.optional(v.number()),
		comments: v.optional(v.number()),
		shares: v.optional(v.number()),
		status: v.string(),
		submittedAt: v.string(),
		earnings: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("submissions", args);
	},
});

export const listByCampaign = query({
	args: { campaignId: v.id("campaigns") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("submissions")
			.withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
			.collect();
	},
});

export const listByUser = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("submissions")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.collect();
	},
});

export const updateStats = mutation({
	args: {
		id: v.id("submissions"),
		views: v.optional(v.number()),
		likes: v.optional(v.number()),
		comments: v.optional(v.number()),
		shares: v.optional(v.number()),
		earnings: v.optional(v.number()),
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
