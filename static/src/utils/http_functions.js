/* eslint camelcase: 0 */

import axios from 'axios';

const tokenConfig = (token) => ({
    headers: {
        'Authorization': token, // eslint-disable-line quote-props
    },
});

export function validate_token(token) {
    return axios.post('/api/is_token_valid', {
        token,
    });
}

export function get_github_access() {
    window.open(
        '/github-login',
        '_blank' // <- This is what makes it open in a new window.
    );
}

export function create_user(email, password, nickname, aboutme) {
    return axios.post('api/create_user', {
        email,
        password,
        nickname,
        aboutme,
    });
}

export function get_token(email, password) {
    return axios.post('api/get_token', {
        email,
        password,
    });
}

export function get_follow_relations(token, followerid) {
    return axios.get('api/get_follow_relations', tokenConfig(token), {
        followerid,
    });
}

export function make_follow_relation(followerid, followedid) {
    return axios.post('api/make_follow_relation', {
        followerid,
        followedid,
    });
}

export function delete_follow_relation(followerid, followedid) {
    return axios.post('api/delete_follow_relation', {
        followerid,
        followedid,
    });
}

export function has_github_token(token) {
    return axios.get('api/has_github_token', tokenConfig(token));
}

export function data_about_user(token) {
//    console.log(axios.get('api/user', tokenConfig(token)));
    // return axios.get('api/user', tokenConfig(token))
    //    .then(function(response){
    //        console.log("ppppppppphyujk " + response.data); // ex.: { user: 'Your User'}
    //        console.log(response.status); // ex.: 200
    // });

    return axios.get('api/user', tokenConfig(token));
}

export function posts_of_user(email) {
//    console.log(axios.get('api/user', tokenConfig(token)));
    // return axios.get('api/user', tokenConfig(token))
    //    .then(function(response){
    //        console.log("ppppppppphyujk " + response.data); // ex.: { user: 'Your User'}
    //        console.log(response.status); // ex.: 200
    // });

    return axios.get('api/get_recent_post', {
        params : {
            email
        }
    });
}



export function info_of_users(token) {
//    console.log(axios.get('api/user', tokenConfig(token)));
    // return axios.get('api/user', tokenConfig(token))
    //    .then(function(response){
    //        console.log("ppppppppphyujk " + response.data); // ex.: { user: 'Your User'}
    //        console.log(response.status); // ex.: 200
    // });

    return axios.get('api/info_of_users', tokenConfig(token));
}

export function create_post(body, timestamp, userid) {
    return axios.post('api/create_post', {
        body,
        timestamp,
        userid,
    });
    // return axios.get('api/get_recent_post', {
    //     params: {
    //       body,
    //       timestamp,
    //       userid,
    //     }
    // });
}