// Learn more: https://docs.expo.dev/guides/monorepos/
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo (merge with defaults)
config.watchFolders = [...(config.watchFolders || []), monorepoRoot];

// Resolve modules from both the project and monorepo root node_modules
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, "node_modules"),
	path.resolve(monorepoRoot, "node_modules"),
];

// Resolve convex/_generated/* to the local ./convex/_generated directory
// (tsconfig paths don't work in Metro, so we handle it here)
config.resolver.resolveRequest = (context, moduleName, platform) => {
	if (moduleName.startsWith("convex/_generated")) {
		const file = moduleName.split("/").pop(); // "api" or "dataModel"
		const dir = path.resolve(projectRoot, "convex/_generated");
		const fs = require("node:fs");
		const jsPath = path.join(dir, file + ".js");
		return {
			filePath: fs.existsSync(jsPath) ? jsPath : path.join(dir, file + ".d.ts"),
			type: "sourceFile",
		};
	}
	if (moduleName.startsWith("expo-router")) {
		return context.resolveRequest(
			{
				...context,
				nodeModulesPaths: [path.resolve(projectRoot, "node_modules")],
			},
			moduleName,
			platform,
		);
	}
	return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
