// Learn more: https://docs.expo.dev/guides/monorepos/
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// Resolve modules from both the project and monorepo root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];

// Force expo-router to resolve from the project's own node_modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("expo-router")) {
    return context.resolveRequest(
      { ...context, nodeModulesPaths: [path.resolve(projectRoot, "node_modules")] },
      moduleName,
      platform
    );
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
