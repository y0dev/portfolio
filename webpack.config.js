const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: {
		main: path.resolve(__dirname,'src/index.js'),
	},
	output: {
		path: path.resolve(__dirname,'dist'),
		filename: '[name].[contenthash].js',
		clean: true,
	},
	resolve: {
		modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
	},
	module: {
		rules: 
		[
			//===== Styling Rule ======
			{
				test: /\.css/,
				use: 
				[
					'style-loader',
					'css-loader'
				]
			},
			// ===== Node Rule =======
			{
				test: /\.(ts|tsx|js|jsx)$/,
				use: 
				[
					'babel-loader'
				]
			},
			// ===== JSON Rule =====
			{ test: /\.json$/, type: 'json' },
			// ====== Images Rule =======
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/,
				type: 'asset/resource',
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[hash].[ext]',
						outputPath: 'imgs'
					},
				}
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'Devontae Reid',
			filename: 'about-me.html',
			template: './src/templates/about-me-template.html',
			'meta': {
				'og:title': 'Devontae Reid',
				'twitter:title': 'Devontae Reid',

				'description': 'Backend & Frontend Developer, Engineer, & Theologian',
				'og:description': 'Backend & Frontend Developer, Engineer, & Theologian',
				'twitter:description': 'Backend & Frontend Developer, Engineer, & Theologian',

				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Projects | Devontae Reid',
			filename: 'projects.html',
			template: './src/templates/projects-template.html',
			'meta': {
				'og:title': 'Projects | Devontae Reid',
				'twitter:title': 'Projects | Devontae Reid',

				'description': 'List of Devontae\'s Projects',
				'og:description': 'List of Devontae\'s Projects',
				'twitter:description': 'List of Devontae\'s Projects',

				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com/projects',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Articles & Notes | Devontae Reid',
			filename: 'articles.html',
			template: './src/templates/articles-template.html',
			'meta': {
				'og:title': 'Articles & Notes | Devontae Reid',
				'twitter:title': 'Articles & Notes | Devontae Reid',

				'description': 'Articles & Notes from Devontae Reid',
				'og:description': 'Articles & Notes from Devontae Reid',
				'twitter:description': 'Articles & Notes from Devontae Reid',

				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com/articles',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		})
	]
}