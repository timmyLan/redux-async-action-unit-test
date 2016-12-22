/**
 * Created by llan on 2016/12/22.
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
