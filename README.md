reudx-async-action-unit-test [![Travis](https://img.shields.io/travis/rust-lang/rust.svg)](https://travis-ci.org/timmyLan/redux-async-action-unit-test)
===
如果觉得redux async action单元测试难以入手,不妨尝试本文方法.

`redux`状态管理确实带来十分大的便利,但随之而来的`单元测试`实现却令人头痛(至少刚开始我不知道从何着手).尤其async action单元测试更甚,本文意旨简单实现redux async action单元测试.

实现工具
---
* karma 测试管理工具
* mocha 测试框架
* chai 测试断言库

项目结构
---
```bash
.
├── LICENSE
├── README.md
├── app #前端相关
│   ├── actions #redux actions
│   │   └── about.js
│   └── helpers #validator
│       └── validator.js
├── package.json
├── test #测试相关
│   ├── actions #test redux actions
│   │   └── about_test.js
│   ├── karma.conf.js #karma配置文件
│   └── test_index.js #test 入口文件
├── webpack.test.js #test wepack
└── yarn.lock
```
karma搭建
---
    karma配置文件
```javascript
/**
 * test/karma.conf.js
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
```
    karma测试入口文件
```javascript
/**
 * test/test_index.js
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
```
es6~~将会~~已经成为主流,所以搭建`karma`时选择`webpack`配合`babel`进行打包处理.
    webpack
```javascript
/**
 * webpack.test.js
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
```
    babel
```javascript
/**
 * .babelrc
 */
{
  "presets": ["es2015", "stage-0", "react"]
}
```
actions
---
为了对actions执行了什么有个具体的概念,此处贴一张图
![about.png](http://ohumzw01d.bkt.clouddn.com/about.png)
```javascript
/**
 * app/actions/about.js
 */
import 'isomorphic-fetch';
import * as Validators from '../helpers/validator';

export const GET_ABOUT_REQUEST = 'GET_ABOUT_REQUEST';
export const GET_ABOUT_SUCCEED = 'GET_ABOUT_SUCCEED';
export const GET_ABOUT_FAILED = 'GET_ABOUT_FAILED';
export const CHANGE_START = 'CHANGE_START';
export const CHANGE_ABOUT = 'CHANGE_ABOUT';

const fetchStateUrl = '/api/about';
/**
 * 异步获取about
 * method get
 */
exports.fetchAbout = ()=> {
    return async(dispatch)=> {
        // 初始化about
        dispatch(aboutRequest());
        try {//成功则执行aboutSucceed
            let response = await fetch(fetchStateUrl);
            let data = await response.json();
            return dispatch(aboutSucceed(data));
        } catch (e) {//失败则执行aboutFailed
            return dispatch(aboutFailed());
        }
    }
};
/**
 * 改变start
 * value 星数
 */
exports.changeStart = (value)=> ({
    type: CHANGE_START,
    value: value,
    error: Validators.changeStart(value)
});
/**
 * 异步改变about
 * method post
 */
exports.changeAbout = ()=> {
    return async(dispatch)=> {
        try {
            let response = await fetch('/api/about', {
                method: 'POST'
            });
            let data = await response.json();
            return dispatch({
                type: CHANGE_ABOUT,
                data: data
            });
        } catch (e) {

        }
    }
};

const aboutRequest = ()=> ({
    type: GET_ABOUT_REQUEST
});

const aboutSucceed = (data)=>({
    type: GET_ABOUT_SUCCEED,
    data: data
});

const aboutFailed = ()=> {
    return {
        type: GET_ABOUT_FAILED
    }
};

```
因为对星数有限制,编写validator限制
    validator
```javascript
/**
 * app/helpers/validator.js
 */

// 限制星数必须为正整数且在1~5之间
export function changeStart(value) {
    var reg = new RegExp(/^[1-5]$/);
    if (typeof(value) === 'number' && reg.test(value)) {
        return ''
    }
    return '星数必须为正整数且在1~5之间'
}
```

单元测试
---
这里测试了actions应该暴露的`const`,普通的`actions`,异步的`actions`.

测试`async actions`主要靠[fetch-mock](https://github.com/wheresrhys/fetch-mock)拦截actions本身,并且返回期望的结果.

注意:[fetch-mock](https://github.com/wheresrhys/fetch-mock) mock(matcher, response, options)方法,matcher使用`begin:`匹配相应url.如:begin:http://www.example.com/,即匹配http://www.example.com/也匹配http://www.example.com/api/about


```javascript
/**
 * test/actions/about_test.js
 */
import 'babel-polyfill'; // 转换es6新的API 这里主要为Promise
import 'isomorphic-fetch'; // fetchMock依赖
import fetchMock from 'fetch-mock';// fetch拦截并模拟数据
import configureMockStore from 'redux-mock-store';// 模拟store
import thunk from 'redux-thunk';
import * as Actions from '../../app/actions/about';
//store通过middleware进行模拟
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('actions/about', () => {
    //export constant test
    describe('export constant', ()=> {
        it('Should export a constant GET_ABOUT_REQUEST.', () => {
            expect(Actions.GET_ABOUT_REQUEST).to.equal('GET_ABOUT_REQUEST');
        });
        it('Should export a constant GET_ABOUT_SUCCEED.', () => {
            expect(Actions.GET_ABOUT_SUCCEED).to.equal('GET_ABOUT_SUCCEED');
        });
        it('Should export a constant GET_ABOUT_FAILED.', () => {
            expect(Actions.GET_ABOUT_FAILED).to.equal('GET_ABOUT_FAILED');
        });
        it('Should export a constant CHANGE_START.', () => {
            expect(Actions.CHANGE_START).to.equal('CHANGE_START');
        });
        it('Should export a constant GET_ABOUT_REQUEST.', () => {
            expect(Actions.CHANGE_ABOUT).to.equal('CHANGE_ABOUT');
        });
    });
    //normal action test
    describe('action fetchAbout', ()=> {
        it('fetchAbout should be exported as a function.', () => {
            expect(Actions.fetchAbout).to.be.a('function')
        });
        it('fetchAbout should return a function (is a thunk).', () => {
            expect(Actions.fetchAbout()).to.be.a('function')
        });
    });
    describe('action changeStart', ()=> {
        it('changeStart should be exported as a function.', () => {
            expect(Actions.changeStart).to.be.a('function')
        });
        it('Should be return an action and return correct results', () => {
            const action = Actions.changeStart(5);
            expect(action).to.have.property('type', Actions.CHANGE_START);
            expect(action).to.have.property('value', 5);
        });
        it('Should be return an action with error while input empty value.', () => {
            const action = Actions.changeStart();
            expect(action).to.have.property('error').to.not.be.empty
        });
    });
    describe('action changeAbout', ()=> {
        it('changeAbout be exported as a function.', () => {
            expect(Actions.changeAbout).to.be.a('function')
        });
    });
    //async action test
    describe('async action', ()=> {
        //对每个执行完的测试恢复fetchMock
        afterEach(fetchMock.restore);

        describe('action fetchAbout', ()=> {
            it('Should be done when fetch action fetchAbout', async()=> {
                const data = {
                    "code": 200,
                    "msg": "ok",
                    "result": {
                        "value": 4,
                        "about": "it's my about"
                    }
                };
                // 期望的发起请求的 action
                const actRequest = {
                    type: Actions.GET_ABOUT_REQUEST
                };
                // 期望的请求成功的 action
                const actSuccess = {
                    type: Actions.GET_ABOUT_SUCCEED,
                    data: data
                };
                const expectedActions = [
                    actRequest,
                    actSuccess,
                ];
                //拦截/api/about请求并返回自定义数据
                fetchMock.mock(`begin:/api/about`, data);
                const store = mockStore({});
                await store.dispatch(Actions.fetchAbout());
                //比较store.getActions()与期望值
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
            it('Should be failed when fetch action fetchAbout', async()=> {
                // 期望的发起请求的 action
                const actRequest = {
                    type: Actions.GET_ABOUT_REQUEST
                };
                // 期望的请求失败的 action
                const actFailed = {
                    type: Actions.GET_ABOUT_FAILED
                };
                const expectedActions = [
                    actRequest,
                    actFailed,
                ];
                //拦截/api/about请求并返回500错误
                fetchMock.mock(`begin:/api/about`, 500);
                const store = mockStore({});
                await store.dispatch(Actions.fetchAbout());
                //比较store.getActions()与期望值
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
        });
        describe('action changeAbout', ()=> {
            it('Should be done when fetch action changeAbout', async()=> {
                const data = {
                    "code": 200,
                    "msg": "ok",
                    "result": {
                        "about": "it's changeAbout fetch about"
                    }
                };
                const acSuccess = {
                    type: Actions.CHANGE_ABOUT,
                    data: data
                };
                const expectedActions = [
                    acSuccess
                ];
                //拦截/api/about post请求并返回自定义数据
                fetchMock.mock(`begin:/api/about`, data, {method: 'POST'});
                const store = mockStore({});
                await store.dispatch(Actions.changeAbout());
                //比较store.getActions()与期望值
                expect(store.getActions()).to.deep.equal(expectedActions);
            });
        });
    });
});

```
dependencies
---
```javasript
 "dependencies": {
    "isomorphic-fetch": "^2.2.1",
    "react": "^15.4.1",
    "react-dom": "^15.4.1",
    "redux": "^3.6.0",
    "webpack": "^1.14.0"
  },
  "devDependencies": {
    "babel-cli": "^6.18.0",
    "babel-loader": "^6.2.10",
    "babel-polyfill": "^6.20.0",
    "babel-preset-es2015": "^6.18.0",
    "babel-preset-react": "^6.16.0",
    "babel-preset-stage-0": "^6.16.0",
    "chai": "^3.5.0",
    "fetch-mock": "^5.8.0",
    "isparta-loader": "^2.0.0",
    "karma": "^1.3.0",
    "karma-chai": "^0.1.0",
    "karma-coverage": "^1.1.1",
    "karma-mocha": "^1.3.0",
    "karma-mocha-reporter": "^2.2.1",
    "karma-phantomjs-launcher": "^1.0.2",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-webpack": "^1.8.1",
    "mocha": "^3.2.0",
    "redux-mock-store": "^1.2.1",
    "redux-thunk": "^2.1.0",
    "sinon": "next"
  }
```
script
---
直接在项目根目录中执行`npm test`则可以进行测试
```javascript
"scripts": {
    "test": "./node_modules/karma/bin/karma start test/karma.conf.js"
  }
```
测试结果
![testInfo.png](http://ohumzw01d.bkt.clouddn.com/testInfo.png)
项目地址
---
[https://github.com/timmyLan/redux-async-action-unit-test](https://github.com/timmyLan/redux-async-action-unit-test)

参考资料
---
* [http://cn.redux.js.org/docs/recipes/WritingTests.html](http://cn.redux.js.org/docs/recipes/WritingTests.html)
* [https://github.com/wheresrhys/fetch-mock](https://github.com/wheresrhys/fetch-mock)

