import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("creators").collect();
	},
});

export const getById = query({
	args: { id: v.id("creators") },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	},
});

export const getByHandle = query({
	args: { handle: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("creators")
			.withIndex("by_handle", (q) => q.eq("handle", args.handle))
			.first();
	},
});

export const getByUserId = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("creators")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.first();
	},
});

export const create = mutation({
	args: {
		userId: v.optional(v.string()),
		name: v.string(),
		handle: v.string(),
		avatarColor: v.array(v.string()),
		location: v.string(),
		bio: v.string(),
		longBio: v.array(v.string()),
		primaryPlatform: v.string(),
		platforms: v.array(
			v.object({
				name: v.string(),
				handle: v.string(),
				followers: v.string(),
				growth: v.string(),
				primary: v.boolean(),
			})
		),
		followers: v.number(),
		monthlyViews: v.number(),
		engagement: v.number(),
		avgRate: v.number(),
		currency: v.string(),
		category: v.string(),
		tags: v.array(v.string()),
		completedDeals: v.number(),
		trending: v.boolean(),
		tier: v.string(),
		verified: v.boolean(),
		spark: v.array(v.number()),
		timezone: v.string(),
		responseTime: v.string(),
		rating: v.number(),
		ratingCount: v.number(),
		available: v.boolean(),
		exclusive: v.boolean(),
		color: v.string(),
		audience: v.object({
			genderF: v.number(),
			genderM: v.number(),
			ageBuckets: v.array(
				v.object({ label: v.string(), pct: v.number() })
			),
			topGeo: v.array(
				v.object({ city: v.string(), pct: v.number() })
			),
			interests: v.array(v.string()),
		}),
		rates: v.array(
			v.object({
				kind: v.string(),
				ig: v.string(),
				yt: v.string(),
				tt: v.string(),
			})
		),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("creators", args);
	},
});

export const update = mutation({
	args: {
		id: v.id("creators"),
		userId: v.optional(v.string()),
		name: v.optional(v.string()),
		handle: v.optional(v.string()),
		avatarColor: v.optional(v.array(v.string())),
		location: v.optional(v.string()),
		bio: v.optional(v.string()),
		longBio: v.optional(v.array(v.string())),
		primaryPlatform: v.optional(v.string()),
		platforms: v.optional(
			v.array(
				v.object({
					name: v.string(),
					handle: v.string(),
					followers: v.string(),
					growth: v.string(),
					primary: v.boolean(),
				})
			)
		),
		followers: v.optional(v.number()),
		monthlyViews: v.optional(v.number()),
		engagement: v.optional(v.number()),
		avgRate: v.optional(v.number()),
		currency: v.optional(v.string()),
		category: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		completedDeals: v.optional(v.number()),
		trending: v.optional(v.boolean()),
		tier: v.optional(v.string()),
		verified: v.optional(v.boolean()),
		spark: v.optional(v.array(v.number())),
		timezone: v.optional(v.string()),
		responseTime: v.optional(v.string()),
		rating: v.optional(v.number()),
		ratingCount: v.optional(v.number()),
		available: v.optional(v.boolean()),
		exclusive: v.optional(v.boolean()),
		color: v.optional(v.string()),
		audience: v.optional(
			v.object({
				genderF: v.number(),
				genderM: v.number(),
				ageBuckets: v.array(
					v.object({ label: v.string(), pct: v.number() })
				),
				topGeo: v.array(
					v.object({ city: v.string(), pct: v.number() })
				),
				interests: v.array(v.string()),
			})
		),
		rates: v.optional(
			v.array(
				v.object({
					kind: v.string(),
					ig: v.string(),
					yt: v.string(),
					tt: v.string(),
				})
			)
		),
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
