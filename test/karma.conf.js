/**
 * Created by llan on 2016/12/19.
 */
var webpackConfig = require('../webpack.test');
module.exports = function (config) {
	config.set({
		frameworks: ['mocha', 'chai'],
		// ... normal karma configuration
		files: [
			// all files ending in "_test"
			'test_index.js'
			// each file acts as entry point for the webpack configuration
		],
		preprocessors: {
			// add webpack as preprocessor
			'test_index.js': ['webpack','sourcemap']
		},
		browsers: ['PhantomJS'],
		phantomjsLauncher: {
			// Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
			exitOnResourceError: true
		},
		reporters: ['spec', 'coverage'],
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
		webpack: webpackConfig,
		webpackMiddleware: {
			// webpack-dev-middleware configuration
			// i. e.
			stats: 'errors-only'
		},
		autoWatch: false,
		singleRun: true,
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO
	});
};
