const webpack = require('webpack');

module.exports = function override(config, env) {
	//do stuff with the webpack config...
	config.resolve.fallback = {
		...config.resolve.fallback,
		url: require.resolve('url'),
		assert: require.resolve('assert'),
		crypto: require.resolve('crypto-browserify'),
		http: false,
		https: false,
		os: false,
		buffer: require.resolve('buffer'),
		stream: require.resolve("stream-browserify"),
		vm: false
	};
	config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
	config.plugins = [
		...config.plugins,
		new webpack.ProvidePlugin({
			Buffer: ["buffer", "Buffer"],
		}),
		new webpack.ProvidePlugin({
			process: "process/browser",
		}),
	]
	return config;
}