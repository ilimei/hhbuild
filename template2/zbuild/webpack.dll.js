/**
 * Created by Administrator on 2017/4/27.
 */
const path=require("path");
const webpack = require("webpack");

exports.getDLLConfig = function () {
    const resolveApp = program.resolveApp;
    return {
        entry: {
            react: ['react', 'react-dom'],
        },
        output: {
            path: path.resolve("./zbuild/template/dll"),
            filename: '[name].min.js',
            library: '[name]',
            libraryTarget: 'umd'
        },

        plugins: [
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify("production")
                }
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    screw_ie8: true, // React doesn't support IE8
                    warnings: false
                },
                mangle: {
                    screw_ie8: true
                },
                output: {
                    comments: false,
                    screw_ie8: true
                }
            }),
            new webpack.DllPlugin({
                context: path.resolve('.'),
                name: '[name]',
                path: 'zbuild/dll/[name]-manifest.json',
            }),
            new webpack.ProgressPlugin({

            })
        ]
    }
}