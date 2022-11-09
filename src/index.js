import React, { Component } from 'react';
import { Router, Reducer, Scene } from 'react-native-router-flux';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as AuthAction from './actions/auth';

import Init from './components/init';
import Login from './components/login';
import Signup from './components/signup';
import Main from './components/main';
import Post from './components/post';
import Put from './components/put';
import Map from './components/map';
import Replies from './components/replies';

// map redux store to props
function mapStateToProps(state) {
  return {
    auth: state.auth,
  }
}

// map actions to props
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      Auth: bindActionCreators(AuthAction, dispatch),
    }
  }
}

const reducerCreate = params => {
  const defaultReducer = Reducer(params);

  return (state, action) => {
    console.log("ROUTER ACTION: ", action);
    return defaultReducer(state, action);
  }
}



export default class popuppin extends Component {
  render() {
    return(
      <Router createReducer={reducerCreate}>
        <Scene key="root" hideNavBar>
          <Scene key="init" component={Init} title="Init" intial />
          <Scene key="login" component={Login} title="Login" />
          <Scene key="signup" component={Signup} title="Signup" />
          <Scene key="main" component={Main} title="Main" />
          <Scene key="post" component={Post} title="Post" />
          <Scene key="put" component={Put} title="Put" />
          <Scene key="map" component={Map} title="Map" />
          <Scene key="replies" component={Replies} title="Replies" />
        </Scene>
      </Router>
    );
  }
}
