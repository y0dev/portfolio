const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, 'dev'),
		filename: '[name].bundle.js',
		publicPath: '/',
		clean: true,
	},
	devServer: {
		historyApiFallback: true,
		static: {
			directory: path.join(__dirname, 'public'),
		},
		port: 3000,
		hot: true,
		open: true,
	},
});