/**
 * Created by llan on 2016/12/19.
 * 引入test目录下带_test文件
 */
var testsContext = require.context(".", true, /_test$/);
testsContext.keys().forEach(function (path) {
    try {
        testsContext(path);
    } catch (err) {
        console.error('[ERROR] WITH SPEC FILE: ', path);
        console.error(err);
    }
});
