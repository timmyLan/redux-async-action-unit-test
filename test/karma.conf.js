/**
 * Created by llan on 2016/12/19.
 */
var webpackConfig = require('../webpack.test');
module.exports = function (config) {
    config.set({
        // 使用的测试框架&断言库
        frameworks: ['mocha', 'chai'],
        // 测试文件同时作为webpack入口文件
        files: [
            'test_index.js'
        ],
        // webpack&sourcemap处理测试文件
        preprocessors: {
            'test_index.js': ['webpack', 'sourcemap']
        },
        // 测试浏览器
        browsers: ['PhantomJS'],
        // 测试结束关闭PhantomJS
        phantomjsLauncher: {
            exitOnResourceError: true
        },
        // 生成测试报告
        reporters: ['mocha', 'coverage'],
        // 覆盖率配置
        coverageReporter: {
            dir: 'coverage',
            reporters: [{
                type: 'json',
                subdir: '.',
                file: 'coverage.json',
            }, {
                type: 'lcov',
                subdir: '.'
            }, {
                type: 'text-summary'
            }]
        },
        // webpack配置
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only'
        },
        // 自动监测测试文件内容
        autoWatch: false,
        // 只运行一次
        singleRun: true,
        // 运行端口
        port: 9876,
        // 输出彩色
        colors: true,
        // 输出等级
        // config.LOG_DISABLE
        // config.LOG_ERROR
        // config.LOG_WARN
        // config.LOG_INFO
        // config.LOG_DEBUG
        logLevel: config.LOG_INFO
    });
};
