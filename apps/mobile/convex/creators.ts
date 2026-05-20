import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
		const creator = await ctx.db
			.query("creators")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.first();
		if (creator?.accountStatus === "disabled") return null;
		return creator;
	},
});

export const onboard = mutation({
	args: {
		userId: v.string(),
		name: v.string(),
		handle: v.string(),
		city: v.string(),
		tier: v.string(),
		niches: v.array(v.string()),
		connected: v.array(v.string()),
		upi: v.string(),
		pan: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const colors = ["#bef264", "#a3e635"];
		const primaryPlatform = args.connected[0] || "Instagram";
		const platforms = args.connected.map((name, i) => ({
			name,
			handle: `@${args.handle}`,
			followers: "0",
			growth: "+0%",
			primary: i === 0,
		}));

		return await ctx.db.insert("creators", {
			userId: args.userId,
			name: args.name,
			handle: args.handle,
			accountStatus: "active",
			avatarColor: colors,
			location: args.city,
			bio: `${args.niches.slice(0, 2).join(" & ")} creator`,
			longBio: [
				`${args.niches.join(", ")} content creator based in ${args.city}.`,
			],
			primaryPlatform,
			platforms:
				platforms.length > 0
					? platforms
					: [
							{
								name: "Instagram",
								handle: `@${args.handle}`,
								followers: "0",
								growth: "+0%",
								primary: true,
							},
						],
			followers: 0,
			monthlyViews: 0,
			engagement: 0,
			avgRate: 0,
			currency: "₹",
			category: args.niches[0] || "Lifestyle",
			tags: args.niches,
			completedDeals: 0,
			trending: false,
			tier: args.tier,
			verified: false,
			spark: [0, 0, 0, 0, 0, 0, 0],
			timezone: "IST",
			responseTime: "—",
			rating: 0,
			ratingCount: 0,
			available: true,
			exclusive: false,
			color: "lime",
			audience: {
				genderF: 50,
				genderM: 50,
				ageBuckets: [
					{ label: "18-24", pct: 40 },
					{ label: "25-34", pct: 35 },
					{ label: "35+", pct: 25 },
				],
				topGeo: [{ city: args.city || "India", pct: 60 }],
				interests: args.niches,
			},
			rates: [{ kind: "Reel", ig: "—", yt: "—", tt: "—" }],
		});
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
			}),
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
			ageBuckets: v.array(v.object({ label: v.string(), pct: v.number() })),
			topGeo: v.array(v.object({ city: v.string(), pct: v.number() })),
			interests: v.array(v.string()),
		}),
		rates: v.array(
			v.object({
				kind: v.string(),
				ig: v.string(),
				yt: v.string(),
				tt: v.string(),
			}),
		),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("creators", args);
	},
});

export const disableAccount = mutation({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		const creator = await ctx.db
			.query("creators")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.first();
		if (!creator) return null;
		await ctx.db.patch(creator._id, { accountStatus: "disabled" });
		return creator._id;
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
				}),
			),
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
				ageBuckets: v.array(v.object({ label: v.string(), pct: v.number() })),
				topGeo: v.array(v.object({ city: v.string(), pct: v.number() })),
				interests: v.array(v.string()),
			}),
		),
		rates: v.optional(
			v.array(
				v.object({
					kind: v.string(),
					ig: v.string(),
					yt: v.string(),
					tt: v.string(),
				}),
			),
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
