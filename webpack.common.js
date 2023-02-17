const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin }= require('clean-webpack-plugin');

module.exports = {
	entry: {
		about_me: [
			path.resolve(__dirname,'src/about-me.js'),
		],
		articles:[
			path.resolve(__dirname,'src/articles.js'),
		],
		projects:[
			path.resolve(__dirname,'src/projects.js'),
		],
		gospel:[
			path.resolve(__dirname,'src/gospel.js'),
		]
	},
	resolve: {
		modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
		alias: {
			react: path.resolve('./node_modules/react')
		}
	},
	module: {
		rules: 
		[
			// ====== HTML Rule =======
			// {
			// 	test: /\.html$/,
			// 	use: ['html-loader']
			// },
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
				type: 'asset',
				use: {
					loader: 'file-loader',
					// options: {
					// 	name: '[name].[ext]',
					// 	outputPath: 'images',
					// 	limit: 8192,
					// 	mimetype: "image/png",
					// 	encoding: true,
					// },
				}
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: 'Devontae Reid',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'index.html',
			template: './src/templates/index.html',
			chunks: ['about_me'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Devontae Reid',
				'twitter:title': 'Devontae Reid',

				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				'description': 'This portfolio website showcases the best of my work as a professional in the field of software development. It includes a comprehensive overview of my skills and experience, as well as examples of projects I have completed. Visitors can easily navigate the website and find information about my background, including education, certifications, and past employment. Along with my experience I also study theology from scripture as it teaches about the life, death, and resurrection of Christ. The website also includes a detailed portfolio of projects I have worked on, showcasing the breadth of my experience and accomplishments. With this website, visitors can get a better understanding of my capabilities and contact me for further information.',
				'og:description': 'This portfolio website showcases the best of my work as a professional in the field of software development. It includes a comprehensive overview of my skills and experience, as well as examples of projects I have completed. Visitors can easily navigate the website and find information about my background, including education, certifications, and past employment. Along with my experience I also study theology from scripture as it teaches about the life, death, and resurrection of Christ. The website also includes a detailed portfolio of projects I have worked on, showcasing the breadth of my experience and accomplishments. With this website, visitors can get a better understanding of my capabilities and contact me for further information.',
				'twitter:description': 'This portfolio website showcases the best of my work as a professional in the field of software development. It includes a comprehensive overview of my skills and experience, as well as examples of projects I have completed. Visitors can easily navigate the website and find information about my background, including education, certifications, and past employment. Along with my experience I also study theology from scripture as it teaches about the life, death, and resurrection of Christ. The website also includes a detailed portfolio of projects I have worked on, showcasing the breadth of my experience and accomplishments. With this website, visitors can get a better understanding of my capabilities and contact me for further information.',

				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com',
				'og:type': 'website'
				// 'theme-color': '#4285f4'
				// Will generate: <meta name="theme-color" content="#4285f4">
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Gospel of Christ',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'gospel/index.html',
			template: './src/templates/index.html',
			chunks: ['gospel'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Gospel of Christ',
				'twitter:title': 'Gospel of Christ',

				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				'description': 'The Gospel of Christ',
				'og:description': 'The Gospel of Christ',
				'twitter:description': 'The Gospel of Christ',

				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',

				'og:url': 'https://www.devontaereid.com',
				'og:type': 'website'
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Projects | Devontae Reid',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'projects/index.html',
			template: './src/templates/index.html',
			chunks: ['projects'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Projects | Devontae Reid',
				'twitter:title': 'Projects | Devontae Reid',

				'og:image': '../images/idea.png',
				'twitter:image': '../images/idea.png',

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
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'articles/index.html',
			template: './src/templates/index.html',
			chunks: ['articles'],
			'meta': {
				'author': 'Devontae Reid',
				'og:title': 'Articles & Notes | Devontae Reid',
				'twitter:title': 'Articles & Notes | Devontae Reid',

				'og:image': '../images/notepad.png',
				'twitter:image': '../images/notepad.png',

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
		}),
		// new HtmlWebpackPlugin({
		// 	title: 'Article | Devontae Reid',
		// 	favicon: './src/assets/images/logos/logo192.png',
		// 	filename: 'article/index.html',
		// 	template: './src/templates/index.html',
		// 	chunks: ['view_article'],
		// 	'meta': {
		// 		'author': 'Devontae Reid',
		// 		'og:title': 'Article | Devontae Reid',
		// 		'twitter:title': 'Article | Devontae Reid',

		// 		'og:image': '../images/notepad.png',
		// 		'twitter:image': '../images/notepad.png',

		// 		'description': 'Article from Devontae Reid',
		// 		'og:description': 'Article from Devontae Reid',
		// 		'twitter:description': 'Article from Devontae Reid',

		// 		'twitter:card': 'summary_large_image',
		// 		'twitter:site': '@_yodev_',

		// 		'og:url': 'https://www.devontaereid.com/articles',
		// 		'og:type': 'article'
		// 		// 'theme-color': '#4285f4'
		// 		// Will generate: <meta name="theme-color" content="#4285f4">
		// 	}
		// }),
		// new HtmlWebpackPlugin({
		// 	title: 'Note | Devontae Reid',
		// 	favicon: './src/assets/images/logos/logo192.png',
		// 	filename: 'note/index.html',
		// 	template: './src/templates/index.html',
		// 	chunks: ['view_article'],
		// 	'meta': {
		// 		'author': 'Devontae Reid',
		// 		'og:title': 'Note | Devontae Reid',
		// 		'twitter:title': 'Note | Devontae Reid',

		// 		'og:image': '../images/notepad.png',
		// 		'twitter:image': '../images/notepad.png',

		// 		'description': 'Note from Devontae Reid',
		// 		'og:description': 'Note from Devontae Reid',
		// 		'twitter:description': 'Note from Devontae Reid',

		// 		'twitter:card': 'summary_large_image',
		// 		'twitter:site': '@_yodev_',

		// 		'og:url': 'https://www.devontaereid.com/articles',
		// 		'og:type': 'article'
		// 		// 'theme-color': '#4285f4'
		// 		// Will generate: <meta name="theme-color" content="#4285f4">
		// 	}
		// })
	]
}