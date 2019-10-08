const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/js/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {
            images: path.resolve(__dirname, 'src/assets/img/'),
        },
    },
    module: {
        rules: [
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
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: 'index.html'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
};