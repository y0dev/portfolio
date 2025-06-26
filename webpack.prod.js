const path = require('path');
const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const WebpackAssetsManifest = require('webpack-assets-manifest');

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.resolve(__dirname,'dist'),
		filename: '[name].[contenthash].js',
		clean: true,
		assetModuleFilename: 'images/[name][ext]'
	},
	module: {
		rules: 
		[
			// ====== Images Rule =======
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				type: 'asset/resource',
			}
		]
	},
	plugins: [
		new WebpackAssetsManifest({
			output: path.resolve(__dirname,'dist/asset-manifest.json'),
			// customize(entry,orig,manifest,asset) {
			// 	return {
			// 		key: `${entry.key.replace}`
			// 	}
			// },
			transform(assets, manifest) {
				return {
					files: assets
				}
			}
		}),
	]
})