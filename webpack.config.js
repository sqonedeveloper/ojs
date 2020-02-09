const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

let entry_admin = {
	header: './src/default/Header.js',
	sidebar: './src/default/Sidebar.js',
}

let set_entry = {
	admin: entry_admin
}

let set_entry_output = {
	admin: 'public/js/bundle/admin'
}

module.exports = env => {
	return {
		mode: 'development',

		entry: set_entry[env],

		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, set_entry_output[env])
		},

		plugins: [
			new webpack.ProgressPlugin(),
			new HtmlWebpackPlugin(),
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify('production')
			})
		],

		module: {
			rules: [
				{
					test: /.(js|jsx)$/,
					include: [path.resolve(__dirname, 'src')],
					loader: 'babel-loader',

					options: {
						plugins: ['syntax-dynamic-import'],

						presets: [
							[
								'@babel/preset-env',
								{
									modules: false
								}
							]
						]
					}
				}
			]
		},

		optimization: {
			splitChunks: {
				chunks: 'all',
				automaticNameDelimiter: '.',
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendor'
					}
				}
			},
			minimizer: [
				new UglifyJsPlugin({
					uglifyOptions: {
						output: {
							comments: false
						}
					}
				})
			]
		},

		devServer: {
			open: true,
			disableHostCheck: true
		}
	}
};
