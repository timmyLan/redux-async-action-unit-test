/**
 * Created by llan on 2016/12/20.
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
