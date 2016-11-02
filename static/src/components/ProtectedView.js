import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import TrendingView from 'components/TrendingView';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../actions/data';
import * as actionCreatorsAuth from '../actions/auth';

var SPACE = ' ';
var length = 0;
var paperPosts = [];
var followPaperPosts = [];
var flagRender = 1;

const styles = {
  chip: {
    margin: 4,
    marginRight: 10,
  },
};

const stylesTabs = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

const style = {
  marginRight: 20,
};

const styleRaisedButton = {
  backgroundStyle: 'rgba(200, 200, 200, 0.4)',
};

const stylePaper = {
  height: 150,
  margin: 0,
  marginBottom: 20,
  paddingLeft: 40,
  paddingRight: 40,
  display: 'block',
  borderRadius: '50px',
  borderBottomLeftRadius: '200px',
  borderTopRightRadius: '200px',
};

const stylePaperWall = {
  margin: 3,
  marginTop: 10,
  marginBottom: 0,
  padding: 35,
  display: 'flex-box',
  textAlign: 'center',
  fontSize: 20,
};

const stylePaperWaller = {
  margin: 3,
  marginTop: 10,
  marginBottom: 0,
  padding: 35,
  display: 'flex-box',
  float: 'left',
  textAlign: 'left',
  fontSize: 20,
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
export default class ProtectedView extends React.Component {

    constructor(props) {
        super(props);
        const redirectRoute = '/home';
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
        //console.log("AAAAAAAAAAAAA      " + this.props.data.data[1]);
        //length=(this.props.data.data[1]).length;
    }

    postBody(e) {
        // e.preventDefault();
        this.state.userid = this.props.data.data[0].email;
        this.props.registerPost(this.state.body, this.state.timestamp, this.state.userid, this.state.redirectTo);
        this.fetchData();
        this.setState({
            //this.isDisabled();
        });
    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            //this.isDisabled();
        });
    }


    render() {
        if (this.props.loaded) {
            if (this.state.flagRender == true) {
                this.state.flagRender = false;
                        console.log("Main paagal hun");

            }
            paperPosts=[];
            followPaperPosts=[];
            for (var i = 0; i < this.props.data.data[1].length; i++) {
                paperPosts.push(<Paper style={stylePaperWall} zDepth={2}>
                                    <div>
                                        {this.props.data.data[1][i].body}
                                    </div>
                                </Paper>);
            }
            for (var i = 0; i < this.props.data.data[2].length; i++) {
                for (var j = 0; j < this.props.data.data[2][i].length; j++) {
                    followPaperPosts.push(<Paper style={stylePaperWaller} zDepth={2}>
                                    <div>
                                        {this.props.data.data[2][i][j].body}
                                    </div>
                                    <div>
                                        <Chip style={styles.chip}>
                                            <Avatar size={32}>A</Avatar>
                                            {this.props.data.data[2][i][j].userid}
                                        </Chip>
                                    </div>
                                </Paper>);
                }
            }
        }
        return (
            <div>
                {!this.props.loaded
                    ? <h1>Loading data...</h1>
                    :
                    <div>
                        <div style={{display: 'block'}}>
                            <h1>Welcome{SPACE}@{this.props.data.data[0].nickname}{SPACE}{SPACE}</h1>
                            <h2>{this.props.data.data[0].aboutme} </h2>
                        </div>
                        <div style={{display: 'block'}}>
                            <Paper style={stylePaper} zDepth={1}>
                                <div>
                                    <TextField
                                        id="text-field"
                                        hintText="What's in your mind??"
                                        type="body"
                                        floatingLabelText="Speak up here!!"
                                        maxLength="140"
                                        multiLine={false}
                                        fullWidth={true}
                                        rows={1}
                                        rowsMax={1}
                                        onChange={(e) => this.changeValue(e, 'body')}
                                    />
                                </div>
                                <br />
                                <div style={{display: 'block', float: 'right', alignItems: 'left', justifyContent: 'left'}}>
                                    <RaisedButton
                                      label="Post it!" 
                                      secondary={true} 
                                      style={styleRaisedButton}
                                      onClick={(e) => this.postBody(e)}/>
                                </div>
                            </Paper>
                            <Tabs>
                                <Tab label="My EasyPosts" >
                                    <div>
                                        <div style={{display: 'inline', alignItems: 'center', justifyContent: 'center'}}>
                                            {paperPosts}
                                        </div>
                                        <p>
                                        </p>
                                    </div>
                                </Tab>
                                <Tab label="Following" >
                                    <div>
                                        <div style={{display: 'inline', alignItems: 'center', justifyContent: 'center'}}>
                                            {followPaperPosts}
                                        </div>
                                        <p>
                                        </p>
                                    </div>
                                </Tab>
                            </Tabs>
                            
                        </div>
                    </div>
                }
            </div>
        );
    }
}

ProtectedView.propTypes = {
    registerPost: React.PropTypes.func,
    fetchData: React.PropTypes.func,
    loaded: React.PropTypes.bool,
    userName: React.PropTypes.string,
    data: React.PropTypes.any,
    token: React.PropTypes.string,
};