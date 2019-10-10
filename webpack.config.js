const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs')

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false,
        })
    })
}

const htmlPlugins = generateHtmlPlugins('./src/html');

module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devtool: "source-map",
    resolve: {
        alias: {
            images$: path.resolve(__dirname, 'src/assets/img/'),
        },
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [{
                    loader: 'style-loader', // inject CSS to page
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'postcss-loader', // Run post css actions
                    options: {
                        plugins: function () { // post css plugins, can be exported to postcss.config.js
                            return [
                                require('precss'),
                                require('autoprefixer')
                            ];
                        }
                    }
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
            {
        test: /\.(gif|png|jpg|jpeg|svg)?$/,
        loader: 'file-loader',
        options: {
            name: 'assets/img/[name].[ext]',
        }
            },
                   {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader?name=/fonts/[name].[ext]'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, 'src/html/includes'),
                use: ['raw-loader']
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/html/index.html',
            filename: 'index.html'
        })
    ].concat(htmlPlugins),
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
};