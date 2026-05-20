import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
	args: {
		userId: v.string(),
		userName: v.string(),
		userEmail: v.string(),
		userImage: v.optional(v.string()),
		campaignId: v.id("campaigns"),
		campaignTitle: v.string(),
		campaignBrand: v.string(),
		campaignCategory: v.optional(v.string()),
		campaignRate: v.optional(v.number()),
		campaignCurrency: v.optional(v.string()),
		campaignPerViews: v.optional(v.string()),
		campaignDeadline: v.optional(v.string()),
		campaignColor: v.optional(v.string()),
		platform: v.string(),
		platformHandle: v.string(),
		platformFollowers: v.string(),
		pitch: v.string(),
		exampleUrl: v.optional(v.string()),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("applications", args);
	},
});

export const listByUser = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("applications")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.collect();
	},
});

export const listByCampaign = query({
	args: { campaignId: v.id("campaigns") },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("applications")
			.withIndex("by_campaignId", (q) => q.eq("campaignId", args.campaignId))
			.collect();
	},
});

export const updateStatus = mutation({
	args: {
		id: v.id("applications"),
		status: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, { status: args.status });
	},
});
