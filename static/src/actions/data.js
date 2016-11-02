import { FETCH_PROTECTED_DATA_REQUEST, RECEIVE_PROTECTED_DATA } from '../constants/index';
import { parseJSON } from '../utils/misc';
import { data_about_user } from '../utils/http_functions';
import { posts_of_user } from '../utils/http_functions';
import { info_of_users } from '../utils/http_functions';
import { get_follow_relations } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';


export function receiveProtectedData(data) {
    //console.log(data);

    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data,
        },
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROTECTED_DATA_REQUEST,
    };
}

export function fetchProtectedData(token) {

    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        
        data_about_user(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
        
    };
}

export function fetchProtectedPosts(email) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        posts_of_user(email)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function fetchProtectedUsers(token) {
    return (dispatch) => {
        dispatch(fetchProtectedDataRequest());
        info_of_users(token)
            .then(parseJSON)
            .then(response => {
                dispatch(receiveProtectedData(response.result));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

