/// <binding ProjectOpened="Watch - Development" />
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// Copy assets into wwwroot
const CopyWebpackPlugin = require("copy-webpack-plugin");
const postcssPresetEnv = require("postcss-preset-env");
//Cleans our wwwroot directory before building
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// Used to automatically add bundles to the _Layout.cshtml by using a template
const HtmlWebpackPlugin = require("html-webpack-plugin")
// We are getting "process.env.NODE_ENV" from the NPM scripts
// Remember the "dev" script?
const devMode = process.env.NODE_ENV !== "production";
module.exports = {
    // Tells Webpack which built-in optimizations to use
    // If you leave this out, Webpack will default to "production"
    mode: devMode ? "development" : "production",
    // Webpack needs to know where to start the bundling process,
    // so we define the Sass file under "./Styles" directory
    entry: {
        app: "./Client/main.ts",
        //style: "./Client/styles/site.scss",
        //polyfill: "core-js",
    },
    // This is where we define the path where Webpack will place
    // a bundled JS file. Webpack needs to produce this file,
    // but for our purposes you can ignore it
    output: {
        path: path.resolve(__dirname, "wwwroot"),
        // Specify the base path for all the styles within your
        // application. This is relative to the output path, so in
        // our case it will be "./wwwroot/css"
        publicPath: "/",
        // The name of the output bundle. Path is also relative
        // to the output path, so "./wwwroot/js"
        filename: "js/[name].bundle.js"
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        // Array of rules that tells Webpack how the modules (output)
        // will be created
        rules: [
            {
                test: /\.ts$/,
                use: [
                    "awesome-typescript-loader"
                ]
            },
            {
                enforce: "pre", test: /\.js$/, use: "source-map-loader"
            },
            {
                // Look for Sass files and process them according to the
                // rules specified in the different loaders
                test: /\.(sa|sc)ss$/,
                // Use the following loaders from right-to-left, so it will
                // use sass-loader first and ending with MiniCssExtractPlugin
                use: [
                    {
                        // Extracts the CSS into a separate file and uses the
                        // defined configurations in the "plugins" section
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        // Interprets CSS
                        loader: "css-loader",
                        options: {
                            importLoaders: 2
                        }
                    },
                    {
                        // Use PostCSS to minify and autoprefix with vendor rules
                        // for older browser compatibility
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            // We instruct PostCSS to autoprefix and minimize our
                            // CSS when in production mode, otherwise don"t do
                            // anything.
                            plugins: devMode
                                ? () => []
                                : () => [
                                    postcssPresetEnv({
                                        // Compile our CSS code to support browsers
                                        // that are used in more than 1% of the
                                        // global market browser share. You can modify
                                        // the target browsers according to your needs
                                        // by using supported queries.
                                        // https://github.com/browserslist/browserslist#queries
                                        browsers: [">1%"]
                                    }),
                                    require("cssnano")()
                                ]
                        }
                    },
                    {
                        // Adds support for Sass files, if using Less, then
                        // use the less-loader
                        loader: "sass-loader"
                    }
                ]
            },
            {
                // Adds support to load images in your CSS rules. It looks for
                // .png, .jpg, .jpeg and .gif
                test: /\.(png|jpe?g|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            // The image will be named with the original name and
                            // extension
                            name: "[name].[ext]",
                            // Indicates where the images are stored and will use
                            // this path when generating the CSS files.
                            publicPath: "../assets",
                            // When this option is "true", the loader will emit the
                            // image to output.path
                            emitFile: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // Configuration options for MiniCssExtractPlugin. Here I"m only
        // indicating what the CSS output file name should be and
        // the location
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            { from: "./Client/assets/*.*", to: "assets/", flatten: true }
        ]),
        new MiniCssExtractPlugin({
            filename: "css/site.css" 
        }),
        new HtmlWebpackPlugin({
            filename: "../Pages/Shared/_Layout.cshtml",
            template: "Client/_Layout_Template.cshtml"
        })
    ]
};
