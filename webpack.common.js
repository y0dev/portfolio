// Node.js built-in module to handle file and directory paths
const path = require('path');

// Plugin to generate HTML files that include your bundled JS automatically
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Plugin to clean up the output directory before each build
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Export the Webpack configuration object
module.exports = {
	// Single entry point - all pages will use the same bundle with conditional rendering
	entry: {
		main: path.resolve(__dirname, 'src/index.js'),
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
				test: /\.(png|svg|jpg|jpeg|gif|webp)$/,
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
			title: 'Devontae Reid - Software Developer & Theology Student',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'index.html',
			template: './src/templates/index.html',
			chunks: ['main'],
			'meta': {
				'viewport': 'width=device-width, initial-scale=1.0',
				'author': 'Devontae Reid',
				'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
				'googlebot': 'index, follow',
				'format-detection': 'telephone=no',
				'theme-color': '#3b82f6',
				'msapplication-TileColor': '#3b82f6',
				'apple-mobile-web-app-capable': 'yes',
				'apple-mobile-web-app-status-bar-style': 'default',
				'apple-mobile-web-app-title': 'Devontae Reid',

				// Open Graph
				'og:title': 'Devontae Reid - Software Developer & Theology Student',
				'og:description': 'Professional software developer with expertise in web development, programming, and theology. View my portfolio, projects, and insights on technology and faith.',
				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'og:image:width': '1200',
				'og:image:height': '630',
				'og:image:alt': 'Devontae Reid - Software Developer',
				'og:url': 'https://www.devontaereid.com',
				'og:type': 'website',
				'og:site_name': 'Devontae Reid Portfolio',
				'og:locale': 'en_US',

				// Twitter Card
				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',
				'twitter:creator': '@_yodev_',
				'twitter:title': 'Devontae Reid - Software Developer & Theology Student',
				'twitter:description': 'Professional software developer with expertise in web development, programming, and theology. View my portfolio, projects, and insights.',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'twitter:image:alt': 'Devontae Reid - Software Developer',

				// Additional SEO
				'description': 'Professional software developer with expertise in web development, programming, and theology. View my portfolio, projects, and insights on technology and faith.',
				'keywords': 'software developer, web development, programming, React, JavaScript, theology, portfolio, projects, technology, faith',
				'canonical': 'https://www.devontaereid.com',
				'language': 'en',
				'charset': 'utf-8'
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Gospel of Christ - Devontae Reid',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'gospel/index.html',
			template: './src/templates/index.html',
			chunks: ['main'],
			'meta': {
				'viewport': 'width=device-width, initial-scale=1.0',
				'author': 'Devontae Reid',
				'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
				'theme-color': '#3b82f6',

				// Open Graph
				'og:title': 'Gospel of Christ - Devontae Reid',
				'og:description': 'Exploring the life, death, and resurrection of Christ through scripture and theological study.',
				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'og:image:width': '1200',
				'og:image:height': '630',
				'og:url': 'https://www.devontaereid.com/gospel',
				'og:type': 'website',
				'og:site_name': 'Devontae Reid Portfolio',

				// Twitter Card
				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',
				'twitter:creator': '@_yodev_',
				'twitter:title': 'Gospel of Christ - Devontae Reid',
				'twitter:description': 'Exploring the life, death, and resurrection of Christ through scripture and theological study.',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				// Additional SEO
				'description': 'Exploring the life, death, and resurrection of Christ through scripture and theological study.',
				'keywords': 'gospel, Christ, theology, scripture, faith, Christianity, resurrection, salvation',
				'canonical': 'https://www.devontaereid.com/gospel'
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Projects - Devontae Reid | Software Developer',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'projects/index.html',
			template: './src/templates/index.html',
			chunks: ['main'],
			'meta': {
				'viewport': 'width=device-width, initial-scale=1.0',
				'author': 'Devontae Reid',
				'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
				'theme-color': '#3b82f6',

				// Open Graph
				'og:title': 'Projects - Devontae Reid | Software Developer',
				'og:description': 'Explore my software development projects showcasing web applications, programming solutions, and technical expertise.',
				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'og:image:width': '1200',
				'og:image:height': '630',
				'og:url': 'https://www.devontaereid.com/projects',
				'og:type': 'website',
				'og:site_name': 'Devontae Reid Portfolio',

				// Twitter Card
				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',
				'twitter:creator': '@_yodev_',
				'twitter:title': 'Projects - Devontae Reid | Software Developer',
				'twitter:description': 'Explore my software development projects showcasing web applications, programming solutions, and technical expertise.',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				// Additional SEO
				'description': 'Explore my software development projects showcasing web applications, programming solutions, and technical expertise.',
				'keywords': 'software projects, web development, programming, React, JavaScript, portfolio, applications, code',
				'canonical': 'https://www.devontaereid.com/projects'
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Developer & Theology Resources - Devontae Reid',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'resources/index.html',
			template: './src/templates/index.html',
			chunks: ['main'],
			meta: {
				'viewport': 'width=device-width, initial-scale=1.0',
				'author': 'Devontae Reid',
				'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
				'theme-color': '#3b82f6',

				// Open Graph
				'og:title': 'Developer & Theology Resources - Devontae Reid',
				'og:description': 'Curated collection of developer tools, theology resources, podcasts, and recommended books for software developers and theology students.',
				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'og:image:width': '1200',
				'og:image:height': '630',
				'og:url': 'https://www.devontaereid.com/resources',
				'og:type': 'website',
				'og:site_name': 'Devontae Reid Portfolio',

				// Twitter Card
				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',
				'twitter:creator': '@_yodev_',
				'twitter:title': 'Developer & Theology Resources - Devontae Reid',
				'twitter:description': 'Curated collection of developer tools, theology resources, podcasts, and recommended books.',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				// Additional SEO
				'description': 'Curated collection of developer tools, theology resources, podcasts, and recommended books for software developers and theology students.',
				'keywords': 'developer resources, theology resources, programming tools, books, podcasts, learning materials, software development, theology',
				'canonical': 'https://www.devontaereid.com/resources'
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Books - Devontae Reid | Reading List',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'resources/books/index.html',
			template: './src/templates/index.html',
			chunks: ['main'],
			meta: {
				'viewport': 'width=device-width, initial-scale=1.0',
				'author': 'Devontae Reid',
				'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
				'theme-color': '#3b82f6',

				// Open Graph
				'og:title': 'Books - Devontae Reid | Reading List',
				'og:description': 'A collection of books that have influenced my thinking, from programming and technology to theology and faith.',
				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'og:image:width': '1200',
				'og:image:height': '630',
				'og:url': 'https://www.devontaereid.com/resources/books',
				'og:type': 'website',
				'og:site_name': 'Devontae Reid Portfolio',

				// Twitter Card
				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',
				'twitter:creator': '@_yodev_',
				'twitter:title': 'Books - Devontae Reid | Reading List',
				'twitter:description': 'A collection of books that have influenced my thinking, from programming and technology to theology and faith.',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				// Additional SEO
				'description': 'A collection of books that have influenced my thinking, from programming and technology to theology and faith.',
				'keywords': 'books, reading list, programming books, theology books, recommended reading, software development, faith, learning',
				'canonical': 'https://www.devontaereid.com/resources/books'
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Articles & Notes - Devontae Reid | Blog',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'articles/index.html',
			template: './src/templates/index.html',
			chunks: ['main'],
			'meta': {
				'viewport': 'width=device-width, initial-scale=1.0',
				'author': 'Devontae Reid',
				'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
				'theme-color': '#3b82f6',

				// Open Graph
				'og:title': 'Articles & Notes - Devontae Reid | Blog',
				'og:description': 'Articles and notes on software development, programming, technology, and thoughts on building better software.',
				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'og:image:width': '1200',
				'og:image:height': '630',
				'og:url': 'https://www.devontaereid.com/articles',
				'og:type': 'website',
				'og:site_name': 'Devontae Reid Portfolio',

				// Twitter Card
				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',
				'twitter:creator': '@_yodev_',
				'twitter:title': 'Articles & Notes - Devontae Reid | Blog',
				'twitter:description': 'Articles and notes on software development, programming, technology, and thoughts on building better software.',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				// Additional SEO
				'description': 'Articles and notes on software development, programming, technology, and thoughts on building better software.',
				'keywords': 'articles, blog, software development, programming, technology, web development, coding, tutorials, thoughts',
				'canonical': 'https://www.devontaereid.com/articles'
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Article - Devontae Reid | Blog',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'article/[slug].html',
			template: './src/templates/index.html',
			chunks: ['main'],
			'meta': {
				'viewport': 'width=device-width, initial-scale=1.0',
				'author': 'Devontae Reid',
				'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
				'theme-color': '#3b82f6',

				// Open Graph
				'og:title': 'Article - Devontae Reid | Blog',
				'og:description': 'Articles and notes on software development, programming, technology, and thoughts on building better software.',
				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'og:image:width': '1200',
				'og:image:height': '630',
				'og:url': 'https://www.devontaereid.com/article/[slug]',
				'og:type': 'website',
				'og:site_name': 'Devontae Reid Portfolio',

				// Twitter Card
				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',
				'twitter:creator': '@_yodev_',
				'twitter:title': 'Article - Devontae Reid | Blog',
				'twitter:description': 'Articles and notes on software development, programming, technology, and thoughts on building better software.',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				// Additional SEO
				'description': 'Article on software development, programming, technology, and thoughts on building better software.',
				'keywords': 'article, blog, software development, programming, technology, web development, coding, tutorials, thoughts',
				'canonical': 'https://www.devontaereid.com/article/[slug]'
			}
		}),
		new HtmlWebpackPlugin({
			title: 'Note - Devontae Reid | Blog',
			favicon: './src/assets/images/logos/logo192.png',
			filename: 'note/[slug].html',
			template: './src/templates/index.html',
			chunks: ['main'],
			'meta': {
				'viewport': 'width=device-width, initial-scale=1.0',
				'author': 'Devontae Reid',
				'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
				'theme-color': '#3b82f6',

				// Open Graph
				'og:title': 'Note - Devontae Reid | Blog',
				'og:description': 'Notes on software development, programming, technology, and thoughts on building better software.',
				'og:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',
				'og:image:width': '1200',
				'og:image:height': '630',
				'og:url': 'https://www.devontaereid.com/note/[slug]',
				'og:type': 'website',
				'og:site_name': 'Devontae Reid Portfolio',

				// Twitter Card
				'twitter:card': 'summary_large_image',
				'twitter:site': '@_yodev_',
				'twitter:creator': '@_yodev_',
				'twitter:title': 'Note - Devontae Reid | Blog',
				'twitter:description': 'Notes on software development, programming, technology, and thoughts on building better software.',
				'twitter:image': 'https://i.ibb.co/HY4dx9s/headshot.jpg',

				// Additional SEO
				'description': 'Note on software development, programming, technology, and thoughts on building better software.',
				'keywords': 'note, blog, software development, programming, technology, web development, coding, tutorials, thoughts',
				'canonical': 'https://www.devontaereid.com/note/[slug]'
			}	
		})	
	]
}