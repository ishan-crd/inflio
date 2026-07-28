import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

/**
 * Scheduled jobs for the Inflio demo.
 *
 * Nightly reset keeps the public demo clean: it wipes anything visitors
 * created (junk creator profiles, applications, submissions, duplicate
 * campaigns) and reseeds the curated demo brands, campaigns and creators.
 *
 * 20:30 UTC == 02:00 IST — runs in the quiet window for Indian traffic.
 */
const crons = cronJobs();

crons.daily(
	"nightly demo reset",
	{ hourUTC: 20, minuteUTC: 30 },
	internal.seed.resetAndSeed,
);

export default crons;
