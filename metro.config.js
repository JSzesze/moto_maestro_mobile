const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
    // Redirect Node.js 'ws' to React Native's built-in WebSocket
    if (moduleName === "ws") {
        return {
            type: "empty",
        };
    }

    // Use default resolution for everything else
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
