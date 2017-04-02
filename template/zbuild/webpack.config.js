/**
 * Created by 51422 on 2017/4/1.
 */
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
var url = require('url');
var getClientEnvironment = require('../env');
const path=require("path");

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';


exports.getDevConfig = function () {
    process.env.NODE_ENV = 'development';
    // Get environment variables to inject into our app.
    const env = getClientEnvironment(publicUrl);
    const resolveApp=program.resolveApp;

    return {
        // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
        // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
        devtool: 'cheap-module-source-map',
        // These are the "entry points" to our application.
        // This means they will be the "root" imports that are included in JS bundle.
        // The first two entry points enable "hot" CSS and auto-refreshes for JS.
        entry: [
            // Include an alternative client for WebpackDevServer. A client's job is to
            // connect to WebpackDevServer by a socket and get notified about changes.
            // When you save a file, the client will either apply hot updates (in case
            // of CSS changes), or refresh the page (in case of JS changes). When you
            // make a syntax error, this client will display a syntax error overlay.
            // Note: instead of the default WebpackDevServer client, we use a custom one
            // to bring better experience for Create React App users. You can replace
            // the line below with these two lines if you prefer the stock client:
            // require.resolve('webpack-dev-server/client') + '?/',
            // require.resolve('webpack/hot/dev-server'),
            require.resolve('react-dev-utils/webpackHotDevClient'),
            // We ship a few polyfills.js by default:
            require.resolve('./polyfills.js'),
            // Finally, this is your app's code:
            resolveApp(program.file)
            // We include the app code last so that if there is a runtime error during
            // initialization, it doesn't blow up the WebpackDevServer client, and
            // changing JS code would still trigger a refresh.
        ],
        output: {
            // Next line is not used in dev but WebpackDevServer crashes without it:
            path: program.outPath?resolveApp(program.outPath):resolveApp("build"),
            // Add /* filename */ comments to generated require()s in the output.
            pathinfo: true,
            // This does not produce a real file. It's just the virtual path that is
            // served by WebpackDevServer in development. This is the JS bundle
            // containing code from all our entry points, and the Webpack runtime.
            filename: program.outBundleName||'static/js/bundle.js',
            // This is the URL that app is served from. We use "/" in development.
            publicPath: publicPath
        },
        resolve: {
            // This allows you to set a fallback for where Webpack should look for modules.
            // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
            // We use `fallback` instead of `root` because we want `node_modules` to "win"
            // if there any conflicts. This matches Node resolution mechanism.
            // https://github.com/facebookincubator/create-react-app/issues/253
            fallback: program.nodePaths,
            // These are the reasonable defaults supported by the Node ecosystem.
            // We also include JSX as a common component filename extension to support
            // some tools, although we do not recommend using it, see:
            // https://github.com/facebookincubator/create-react-app/issues/290
            extensions: ['.js', '.json', '.jsx', ''],
            alias: {
                // Support React Native Web
                // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
                'react-native': 'react-native-web'
            }
        },

        module: {
            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            preLoaders: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'eslint',
                    include: program.srcFolder,
                }
            ],
            loaders: [
                // Default loader: load all assets that are not handled
                // by other loaders with the url loader.
                // Note: This list needs to be updated with every change of extensions
                // the other loaders match.
                // E.g., when adding a loader for a new supported file extension,
                // we need to add the supported extension to this loader too.
                // Add one new line in `exclude` for each loader.
                //
                // "file" loader makes sure those assets get served by WebpackDevServer.
                // When you `import` an asset, you get its (virtual) filename.
                // In production, they would get copied to the `build` folder.
                // "url" loader works like "file" loader except that it embeds assets
                // smaller than specified limit in bytes as data URLs to avoid requests.
                // A missing `test` is equivalent to a match.
                {
                    exclude: [
                        /\.html$/,
                        /\.(js|jsx)$/,
                        /\.less$/,
                        /\.css$/,
                        /\.json$/,
                        /\.svg$/
                    ],
                    loader: 'url',
                    query: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]'
                    }
                },
                // Process JS with Babel.
                {
                    test: /\.(js|jsx)$/,
                    include: program.srcFolder,
                    loader: 'babel',
                    query: {
                        plugins: [
                            ['import', [{libraryName: 'antd', style: true}]],
                        ],
                        // This is a feature of `babel-loader` for webpack (not Babel itself).
                        // It enables caching results in ./node_modules/.cache/babel-loader/
                        // directory for faster rebuilds.
                        cacheDirectory: true
                    }
                },
                // "postcss" loader applies autoprefixer to our CSS.
                // "css" loader resolves paths in CSS and adds assets as dependencies.
                // "style" loader turns CSS into JS modules that inject <style> tags.
                // In production, we use a plugin to extract that CSS to a file, but
                // in development "style" loader enables hot editing of CSS.
                {
                    test: /\.less$/,
                    loader: 'style!css!postcss!less?{modifyVars:{"@primary-color":"#1DA57A"}}'
                },
                {
                    test: /\.css$/,
                    loader: 'style!css?importLoaders=1!postcss'
                },
                // JSON is not enabled by default in Webpack but both Node and Browserify
                // allow it implicitly so we also enable it.
                {
                    test: /\.json$/,
                    loader: 'json'
                },
                // "file" loader for svg
                {
                    test: /\.svg$/,
                    loader: 'file',
                    query: {
                        name: 'static/media/[name].[hash:8].[ext]'
                    }
                }
            ]
        },
        eslint: {
            formatter: require('./eslint/formatter')
        },
        // We use PostCSS for autoprefixing only.
        postcss: function () {
            return [
                autoprefixer({
                    browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                    ]
                }),
            ];
        },
        plugins: [
            // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
            // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
            // In development, this will be an empty string.
            new InterpolateHtmlPlugin({
                PUBLIC_URL: publicUrl
            }),
            // Generates an `index.html` file with the <script> injected.
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(__dirname,"./template/index.html"),
            }),
            // Makes some environment variables available to the JS code, for example:
            // if (process.env.NODE_ENV === 'development') { ... }. See `./env.js`.
            new webpack.DefinePlugin(env),
            // This is necessary to emit hot updates (currently CSS only):
            new webpack.HotModuleReplacementPlugin(),
            // Watcher doesn't work well if you mistype casing in a path so we use
            // a plugin that prints an error when you attempt to do this.
            // See https://github.com/facebookincubator/create-react-app/issues/240
            new CaseSensitivePathsPlugin(),
            // If you require a missing module and then `npm install` it, you still have
            // to restart the development server for Webpack to discover it. This plugin
            // makes the discovery automatic so you don't have to restart.
            // See https://github.com/facebookincubator/create-react-app/issues/186
            new WatchMissingNodeModulesPlugin(resolveApp('node_modules'))
        ],
        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        node: {
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        }
    };
};

exports.getConfig=function(){
    // Do this as the first thing so that any code reading it knows the right env.
    process.env.NODE_ENV = 'production';
    // Get environment variables to inject into our app.
    var env = getClientEnvironment(publicUrl);
    const resolveApp=program.resolveApp;
    return {
        // Don't attempt to continue if there are any errors.
        bail: true,
        // We generate sourcemaps in production. This is slow but gives good results.
        // You can exclude the *.map files from the build during deployment.
        // devtool: 'source-map',
        // In production, we only want to load the polyfills and the app code.
        entry: [
            require.resolve('./polyfills'),
            resolveApp(program.file)
        ],
        output: {
            // The build folder.
            path: program.outPath?resolveApp(program.outPath):resolveApp("build"),
            // Generated JS file names (with nested folders).
            // There will be one main bundle, and one file per asynchronous chunk.
            // We don't currently advertise code splitting but Webpack supports it.
            filename: 'static/js/[name].[chunkhash:8].js',
            chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
            // We inferred the "public path" (such as / or /my-project) from homepage.
            publicPath: publicPath
        },
        resolve: {
            // This allows you to set a fallback for where Webpack should look for modules.
            // We read `NODE_PATH` environment variable in `paths.js` and pass paths here.
            // We use `fallback` instead of `root` because we want `node_modules` to "win"
            // if there any conflicts. This matches Node resolution mechanism.
            // https://github.com/facebookincubator/create-react-app/issues/253
            fallback: program.nodePaths,
            // These are the reasonable defaults supported by the Node ecosystem.
            // We also include JSX as a common component filename extension to support
            // some tools, although we do not recommend using it, see:
            // https://github.com/facebookincubator/create-react-app/issues/290
            extensions: ['.js', '.json', '.jsx', ''],
            alias: {
                // Support React Native Web
                // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
                'react-native': 'react-native-web'
            }
        },

        module: {
            // First, run the linter.
            // It's important to do this before Babel processes the JS.
            preLoaders: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'eslint',
                    include: program.buildPath
                }
            ],
            loaders: [
                // Default loader: load all assets that are not handled
                // by other loaders with the url loader.
                // Note: This list needs to be updated with every change of extensions
                // the other loaders match.
                // E.g., when adding a loader for a new supported file extension,
                // we need to add the supported extension to this loader too.
                // Add one new line in `exclude` for each loader.
                //
                // "file" loader makes sure those assets end up in the `build` folder.
                // When you `import` an asset, you get its filename.
                // "url" loader works just like "file" loader but it also embeds
                // assets smaller than specified size as data URLs to avoid requests.
                {
                    exclude: [
                        /\.html$/,
                        /\.(js|jsx)$/,
                        /\.css$/,
                        /\.less$/,
                        /\.json$/,
                        /\.svg$/
                    ],
                    loader: 'url',
                    query: {
                        limit: 10000,
                        name: 'static/media/[name].[hash:8].[ext]'
                    }
                },
                // Process JS with Babel.
                {
                    test: /\.(js|jsx)$/,
                    include: program.srcFolder?resolveApp(program.srcFolder):resolveApp("src"),
                    loader: 'babel',
                    query: {
                        plugins: [
                            ['import', [{ libraryName: "antd", style: true }]],  // 加载 less 文件
                        ]
                    }
                },
                // The notation here is somewhat confusing.
                // "postcss" loader applies autoprefixer to our CSS.
                // "css" loader resolves paths in CSS and adds assets as dependencies.
                // "style" loader normally turns CSS into JS modules injecting <style>,
                // but unlike in development configuration, we do something different.
                // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
                // (second argument), then grabs the result CSS and puts it into a
                // separate file in our build process. This way we actually ship
                // a single CSS file in production instead of JS code injecting <style>
                // tags. If you use code splitting, however, any async bundles will still
                // use the "style" loader inside the async code so CSS from them won't be
                // in the main CSS file.
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss')
                    // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
                },
                {
                    test: /\.less$/,
                    loader: ExtractTextPlugin.extract(
                        'css?sourceMap&!' +
                        'postcss!' +
                        'less-loader?{"sourceMap":true,"modifyVars":{"@primary-color":"#1DA57A"}}'
                    ),
                },
                // JSON is not enabled by default in Webpack but both Node and Browserify
                // allow it implicitly so we also enable it.
                {
                    test: /\.json$/,
                    loader: 'json'
                },
                // "file" loader for svg
                {
                    test: /\.svg$/,
                    loader: 'file',
                    query: {
                        name: 'static/media/[name].[hash:8].[ext]'
                    }
                }
            ]
        },

        // We use PostCSS for autoprefixing only.
        postcss: function() {
            return [
                autoprefixer({
                    browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                    ]
                }),
            ];
        },
        plugins: [
            // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
            // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
            // In production, it will be an empty string unless you specify "homepage"
            // in `package.json`, in which case it will be the pathname of that URL.
            new InterpolateHtmlPlugin({
                PUBLIC_URL: publicUrl
            }),
            // Generates an `index.html` file with the <script> injected.
            new HtmlWebpackPlugin({
                inject: true,
                template: path.resolve(__dirname,"./template/index.html"),
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true
                }
            }),
            // Makes some environment variables available to the JS code, for example:
            // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
            // It is absolutely essential that NODE_ENV was set to production here.
            // Otherwise React will be compiled in the very slow development mode.
            new webpack.DefinePlugin(env),
            // This helps ensure the builds are consistent if source hasn't changed:
            new webpack.optimize.OccurrenceOrderPlugin(),
            // Try to dedupe duplicated modules, if any:
            new webpack.optimize.DedupePlugin(),
            // Minify the code.
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
            // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
            new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
            // Generate a manifest file which contains a mapping of all asset filenames
            // to their corresponding output file so that tools can pick it up without
            // having to parse `index.html`.
            new ManifestPlugin({
                fileName: 'asset-manifest.json'
            })
        ],
        // Some libraries import Node modules but don't use them in the browser.
        // Tell Webpack to provide empty mocks for them so importing them works.
        node: {
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        }
    };
}
