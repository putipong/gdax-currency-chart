'use strict';

import webpack from 'webpack';
import Merge from 'webpack-merge';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import CommonConfig from './webpack.base.config';

export default Merge( CommonConfig, {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin( {
            minimize: true,
            debug: false
        } ),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new UglifyJsPlugin()
    ]
} );