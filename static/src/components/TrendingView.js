import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';
import * as actionCreatorsAuth from '../actions/auth';

function mapStateToProps(state) {
    return {
        data: state.data,
        token: state.auth.token,
        loaded: state.data.loaded,
        isFetching: state.data.isFetching,
    };
}

function mapDispatchToProps(dispatch) {
    mapDispatchToPropsForPost(dispatch);
    return bindActionCreators(actionCreators, dispatch);
}

function mapDispatchToPropsForPost(dispatch) {
    return bindActionCreators(actionCreatorsAuth, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
export default class TrendingView extends React.Component {
	constructor(props) {
        super(props);
        const redirectRoute = '/main';
        this.state = {
            body: '',
            timestamp: '',
            userid: '',
            body_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
            flagRender: true,
        };
    }

    componentDidMount() {
        this.fetchData();
    }


    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedData(token);
    }

    render() {
    	return (
    		
    		<div> 
    			<hr />
     			<hr />
    			<h1>Trending</h1>
    			<hr />
    		</div>
    	);
    }
}