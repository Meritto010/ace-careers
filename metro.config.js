const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add this line to fix the bundling hang/crash:
config.resolver.unstable_enablePackageExports = false;

module.exports = config;