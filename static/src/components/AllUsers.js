import React from 'react';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/data';
import * as actionCreatorsAuth from '../actions/auth';


var paperPosts = [];


const stylePaperWall = {
  margin: 3,
  marginTop: 10,
  marginBottom: 0,
  padding: 35,
  display: 'flex-box',
  textAlign: 'left',
  fontSize: 20,
};

const styleRaisedButton = {
  backgroundStyle: 'rgba(20, 200, 200, 0.4)',
};

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
export default class AllUsers extends React.Component { // eslint-disable-line react/prefe r-stateless-function

    constructor(props) {
        super(props);
        const redirectRoute = '/allusers';
        this.state = {
            userid: '',
            myUserIndex: '',
            follows: [],
            followerid: '',
            followedid: '',
            body_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        const token = this.props.token;
        this.props.fetchProtectedUsers(token);
        //this.props.fetchProtectedFollows(token, this.props.userName);
        //console.log("AAAAAAAAAAAAA      " + this.props.data.data[1]);
        //length=(this.props.data.data[1]).length;
    }

    postFollowUser(e) {
        //console.log(e.currentTarget.value + " " + this.props.userName);
        this.state.followerid = this.props.userName;
        this.state.followedid = e.currentTarget.value;
        //const token = this.props.token;
        //this.props.fetchProtectedUsers(token);
        this.props.registerFollowRelationship(this.state.followerid, this.state.followedid, this.state.myUserIndex, this.state.follows, this.state.redirectTo);
        const token = this.props.token;
        this.props.fetchProtectedUsers(token);
    }

    deleteFollowUser(e) {
        //console.log(e.currentTarget.value + " " + this.props.userName);
        this.state.followerid = this.props.userName;
        this.state.followedid = e.currentTarget.value;
        //const token = this.props.token;
        //this.props.fetchProtectedUsers(token);
        this.props.deleteFollowRelationship(this.state.followerid, this.state.followedid, this.state.myUserIndex, this.state.follows, this.state.redirectTo);
        const token = this.props.token;
        this.props.fetchProtectedUsers(token);
    }



    render() {
        this.state.follows = [];
        this.state.myUserIndex = '';
        if (this.props.loaded) {
            for (var i = 0; i < this.props.data.data[0].length; i++) {
                if (this.props.data.data[0][i].email == this.props.userName) {
                    this.state.myUserIndex = this.props.data.data[0][i].id;
                    break;
                }
        }
        console.log(this.state.myUserIndex);
        for (var i = 0; i < this.props.data.data[1].length; i++) {
            if (this.props.data.data[1][i].followerid == this.state.myUserIndex) {
                this.state.follows.push(this.props.data.data[1][i].followedid);
            }
        }
        console.log(this.state.follows);
        paperPosts=[];
            for (var i = 0; i < this.props.data.data[0].length; i++) {
                if (this.props.data.data[0][i].email != this.props.userName) {
                    if (this.state.follows.indexOf(this.props.data.data[0][i].id) > -1) {
                        paperPosts.push(<Paper key={this.props.data.data[0][i].id} style={stylePaperWall} zDepth={1}>
                                            <div>
                                                {this.props.data.data[0][i].nickname}
                                                <div style={{display: 'block', float: 'right', alignItems: 'left', justifyContent: 'left'}}>
                                                    <RaisedButton
                                                      label="Following"
                                                      value={this.props.data.data[0][i].email}
                                                      secondary={true}
                                                      style={styleRaisedButton}
                                                      onClick={(e) => this.deleteFollowUser(e)}
                                                    />
                                                </div>
                                            </div>

                                        </Paper>);
                    }
                    else {
                        paperPosts.push(<Paper key={this.props.data.data[0][i].id} style={stylePaperWall} zDepth={1}>
                                            <div>
                                                {this.props.data.data[0][i].nickname}
                                                <div style={{display: 'block', float: 'right', alignItems: 'left', justifyContent: 'left'}}>
                                                    <RaisedButton
                                                      label="Follow" 
                                                      value={this.props.data.data[0][i].email}
                                                      secondary={false}
                                                      onClick={(e) => this.postFollowUser(e)}
                                                    />
                                                </div>
                                            </div>

                                        </Paper>);
                    }

                }
            }
        }
        return (
            <div className="col-md-8">
                <h1>All Users</h1>
                <hr />
                <div style={{display: 'flex-box', alignItems: 'left', justifyContent: 'left'}}>
                    {paperPosts}
                </div>
            </div>
        );
    }
}

AllUsers.propTypes = {
    registerFollowRelationship: React.PropTypes.func,
    fetchProtectedUsers: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};

