import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const create = mutation({
	args: {
		userId: v.string(),
		platform: v.string(),
		handle: v.string(),
	},
	handler: async (ctx, args) => {
		// Remove any existing pending verification for this user+platform
		const existing = await ctx.db
			.query("verifications")
			.withIndex("by_userId_platform", (q) =>
				q.eq("userId", args.userId).eq("platform", args.platform),
			)
			.first();

		if (existing) {
			await ctx.db.delete(existing._id);
		}

		// Generate a 6-digit code
		const code = String(Math.floor(100000 + Math.random() * 900000));

		await ctx.db.insert("verifications", {
			userId: args.userId,
			platform: args.platform,
			handle: args.handle,
			code,
			status: "pending",
			createdAt: new Date().toISOString(),
		});

		return code;
	},
});

export const getByUserId = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("verifications")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.collect();
	},
});

export const listPending = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db
			.query("verifications")
			.filter((q) => q.eq(q.field("status"), "pending"))
			.collect();
	},
});

export const listAll = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("verifications").collect();
	},
});

export const getByUserIdAndPlatform = query({
	args: { userId: v.string(), platform: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("verifications")
			.withIndex("by_userId_platform", (q) =>
				q.eq("userId", args.userId).eq("platform", args.platform),
			)
			.first();
	},
});

export const verify = mutation({
	args: { code: v.string() },
	handler: async (ctx, args) => {
		const record = await ctx.db
			.query("verifications")
			.withIndex("by_code", (q) => q.eq("code", args.code))
			.first();

		if (!record) return null;

		await ctx.db.patch(record._id, { status: "verified" });
		return record;
	},
});

export const reject = mutation({
	args: { code: v.string() },
	handler: async (ctx, args) => {
		const record = await ctx.db
			.query("verifications")
			.withIndex("by_code", (q) => q.eq("code", args.code))
			.first();

		if (!record) return null;

		await ctx.db.delete(record._id);
		return record;
	},
});
