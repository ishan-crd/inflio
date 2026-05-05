import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const listByUser = query({
	args: { userId: v.string() },
	handler: async (ctx, args) => {
		return await ctx.db
			.query("lists")
			.withIndex("by_userId", (q) => q.eq("userId", args.userId))
			.collect();
	},
});

export const create = mutation({
	args: {
		userId: v.string(),
		name: v.string(),
		description: v.optional(v.string()),
		color: v.string(),
		creatorIds: v.array(v.number()),
		createdAt: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("lists", args);
	},
});

export const addCreator = mutation({
	args: {
		id: v.id("lists"),
		creatorId: v.number(),
	},
	handler: async (ctx, args) => {
		const list = await ctx.db.get(args.id);
		if (!list) throw new Error("List not found");
		const ids = list.creatorIds.includes(args.creatorId)
			? list.creatorIds
			: [...list.creatorIds, args.creatorId];
		await ctx.db.patch(args.id, { creatorIds: ids });
	},
});

export const removeCreator = mutation({
	args: {
		id: v.id("lists"),
		creatorId: v.number(),
	},
	handler: async (ctx, args) => {
		const list = await ctx.db.get(args.id);
		if (!list) throw new Error("List not found");
		await ctx.db.patch(args.id, {
			creatorIds: list.creatorIds.filter((id) => id !== args.creatorId),
		});
	},
});

export const update = mutation({
	args: {
		id: v.id("lists"),
		name: v.optional(v.string()),
		description: v.optional(v.string()),
		color: v.optional(v.string()),
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

export const remove = mutation({
	args: { id: v.id("lists") },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	},
});
