/**
 * Created by llan on 2016/12/22.
 */
process.env.NODE_ENV = 'test';

var webpack = require('webpack');
var path = require('path');
module.exports = {
    name: 'run test webpack',
    devtool: 'inline-source-map', //Source Maps
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
        preLoaders: [{ //在webpackK打包前用isparta-instrumenter记录编译前文件,精准覆盖率
            test: /\.jsx|.js$/,
            include: [path.resolve('app/')],
            loader: 'isparta'
        }],
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('test')
            })
        ]
    }
};
