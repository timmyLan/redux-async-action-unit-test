/**
 * Created by llan on 2016/12/22.
 */
process.env.NODE_ENV = 'test';

var webpack = require('webpack');
var path = require('path');
module.exports = {
    name: 'run test webpack',
    devtool: 'inline-source-map',
    externals: {
        cheerio: 'window',
        'react/lib/ExecutionEnvironment': true,
        'react/addons': true,
        'react/lib/ReactContext': true,
        fs: '{}'
    },
    module: {
        loaders: [
            {
                test: /\.jsx|.js$/,
                include: [
                    path.resolve('app/'),
                    path.resolve('test/')
                ],
                loader: 'babel'
            }
        ],
        preLoaders: [{
            test: /\.jsx|.js$/,
            include: [path.resolve('app/')],
            loader: 'isparta'
        }]
    }
};
