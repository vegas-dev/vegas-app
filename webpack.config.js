const nameModule = 'VGApp';
const outputPaths = ['./public/assets/build'];
const proxy_target = 'vgapp.dev.via';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = outputPaths.map(outputPath => {
	return (env, argv) => {
		let mode = argv.mode || 'development',
			NODE_ENV = argv.mode || 'development',
			name = nameModule.trim().toLowerCase();

		if (argv.mode === 'development') mode = 'dev';
		if ('WEBPACK_SERVE' in env && env.WEBPACK_SERVE) mode = 'serve';

		let args = {
			entry: './index.js',
			output: {
				path: path.resolve(__dirname, outputPath),
				filename: name + '.js',
				library: 'vg',
			},
			stats: {
				warnings: false
			},

			module: {
				rules: [
					{
						test: /\.js$/,
						use: 'babel-loader',
					},
					{
						test: /\.(scss|css)$/,
						use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
					}
				],
			},

			plugins: [
				new webpack.DefinePlugin({
					NODE_ENV: JSON.stringify(NODE_ENV),
					LANG: JSON.stringify('ru'),
				}),
				new MiniCssExtractPlugin({
					filename: name + '.css',
				}),
			],
		};

		if (mode === 'serve') {
			args.devtool = 'inline-cheap-module-source-map';
			args.cache = false;
			args.devServer = {
				host: 'vgapp.dev.via',
				compress: true,
				watchFiles: {
					paths: ['public/**/*.php', 'app/**/*'],
					options: {
						usePolling: false,
					},
				},
			}
		}

		if (mode === 'dev') {
			args.cache = false;
			args.devtool = 'inline-cheap-module-source-map';
			args.watch = true;
			args.watchOptions = {
				aggregateTimeout: 100
			}
		}

		if (mode === 'production') {
			args.devtool = 'source-map'
		}

		return args;
	}
});