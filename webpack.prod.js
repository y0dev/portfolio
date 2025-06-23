const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash].bundle.js',
		publicPath: '/',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'postcss-loader'
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				type: 'asset/resource',
			}
		]
	},
	optimization: {
		minimizer: [
			new CssMinimizerPlugin(),
			new TerserPlugin(),
		],
		minimize: true,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css',
		}),
		new WebpackAssetsManifest({
			output: path.resolve(__dirname, 'dist/asset-manifest.json'),
			transform(assets, manifest) {
				return {
					files: assets
				}
			}
		}),
	]
});