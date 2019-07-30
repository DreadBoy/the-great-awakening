const debug = process.env.NODE_ENV !== 'production';
const webpack = require('webpack');

const plugins = [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    })
];

module.exports = {
    mode: debug ? 'development' : 'production',
    devtool: debug ? 'inline-sourcemap' : null,
    entry: './js/main.ts',
    resolve: {
        extensions: [".ts", ".js"],
        alias: {
            jquery: "jquery/src/jquery"
        },
    },
    output: {
        path: './js',
        filename: 'main.min.js'
    },
    module: {
        rules: [
            {test: /\.tsx?$/, loader: "ts-loader"},
        ]
    },
    plugins: debug ? plugins : [
        ...plugins,
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({mangle: true, sourcemap: true}),
    ],
};
