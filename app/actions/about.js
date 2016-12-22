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

exports.fetchAbout = ()=> {
    return async(dispatch)=> {
        dispatch(aboutRequest());
        try {
            let response = await fetch(fetchStateUrl);
            let data = await response.json();
            return dispatch(aboutSucceed(data));
        } catch (e) {
            return dispatch(aboutFailed());
        }
    }
};

exports.changeStart = (value)=> ({
    type: CHANGE_START,
    value: value,
    error: Validators.changeStart(value)
});

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
