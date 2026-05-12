import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	brands: defineTable({
		userId: v.optional(v.string()), // linked auth user id
		name: v.string(),
		handle: v.string(),
		logoColors: v.array(v.string()), // [bg, text]
		bio: v.string(),
		followers: v.string(),
		rating: v.string(),
		totalPaidOut: v.string(),
		responseTime: v.string(),
		website: v.optional(v.string()),
		category: v.string(),
		accountStatus: v.optional(v.string()), // "active" | "disabled" — soft delete
	})
		.index("by_handle", ["handle"])
		.index("by_userId", ["userId"]),

	campaigns: defineTable({
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
		status: v.string(), // "active" | "paused" | "completed"
	})
		.index("by_brand", ["brandId"])
		.index("by_status", ["status"])
		.index("by_platform", ["platform"])
		.index("by_category", ["category"]),

	creators: defineTable({
		userId: v.optional(v.string()), // linked auth user id
		name: v.string(),
		handle: v.string(),
		avatarColor: v.array(v.string()), // [from, to]
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
		tier: v.string(), // "Micro" | "Mid" | "Macro"
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
		accountStatus: v.optional(v.string()), // "active" | "disabled" — soft delete
	})
		.index("by_handle", ["handle"])
		.index("by_userId", ["userId"])
		.index("by_category", ["category"])
		.index("by_platform", ["primaryPlatform"]),

	lists: defineTable({
		userId: v.string(), // brand's BetterAuth user id
		name: v.string(),
		description: v.optional(v.string()),
		color: v.string(),
		creatorIds: v.array(v.number()), // static creator IDs for now
		createdAt: v.string(),
	}).index("by_userId", ["userId"]),

	submissions: defineTable({
		userId: v.string(),
		userName: v.string(),
		userImage: v.optional(v.string()),
		campaignId: v.id("campaigns"),
		applicationId: v.id("applications"),
		platform: v.string(),
		contentUrl: v.string(),
		contentType: v.string(), // "reel" | "post" | "short" | "video"
		views: v.optional(v.number()),
		likes: v.optional(v.number()),
		comments: v.optional(v.number()),
		shares: v.optional(v.number()),
		status: v.string(), // "pending" | "approved" | "rejected"
		submittedAt: v.string(),
		earnings: v.optional(v.number()),
	})
		.index("by_userId", ["userId"])
		.index("by_campaignId", ["campaignId"])
		.index("by_status", ["status"]),

	verifications: defineTable({
		userId: v.string(),
		platform: v.string(), // "instagram" | "youtube" | "tiktok"
		handle: v.string(),
		code: v.string(),
		status: v.string(), // "pending" | "verified"
		createdAt: v.string(),
	})
		.index("by_userId", ["userId"])
		.index("by_code", ["code"])
		.index("by_userId_platform", ["userId", "platform"]),

	applications: defineTable({
		userId: v.string(), // BetterAuth user id
		userName: v.string(),
		userEmail: v.string(),
		userImage: v.optional(v.string()),
		campaignId: v.number(), // local campaign id (from static data for now)
		campaignTitle: v.string(),
		campaignBrand: v.string(),
		campaignCategory: v.optional(v.string()),
		campaignRate: v.optional(v.number()),
		campaignCurrency: v.optional(v.string()),
		campaignPerViews: v.optional(v.string()),
		campaignDeadline: v.optional(v.string()),
		campaignColor: v.optional(v.string()),
		platform: v.string(), // which platform they're applying with
		platformHandle: v.string(),
		platformFollowers: v.string(),
		pitch: v.string(),
		exampleUrl: v.optional(v.string()),
		status: v.string(), // "pending" | "approved" | "rejected"
	})
		.index("by_userId", ["userId"])
		.index("by_campaignId", ["campaignId"])
		.index("by_status", ["status"]),
});
