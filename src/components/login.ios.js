/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Actions, Scene, Router } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthAction from '../actions/auth';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight= Dimensions.get('window').height;

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

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobile: null,
    }
  }

  componentDidMount() {
    console.log('~~~~~~~~~',this.props.auth.latest);
  }

  login(mobile) {
    let items = [];
    items = this.props.auth.users;
    if (items === null) return;

    for(let i = 0; i < items.length; i++) {
      if (items[i]['mobile'] == mobile) {
        this.props.actions.Auth.loginWithMobile(items[i]);
        Actions.main();
      };
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.welcome}>
            PHONE NUMBER
          </Text>
          <TextInput style={styles.phonenumber} keyboardType="number-pad" onChangeText={(value) => this.setState({mobile: value})} />
          <TouchableOpacity style={styles.loginButton} onPress={() => this.login(this.state.mobile)}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => Actions.signup()}>
            <Text style={styles.loginText}>SIGNUP</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
    width: deviceWidth,
    height: deviceHeight,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  phonenumber: {
    borderColor: 'gray',
    borderWidth: 1,
    color: '#333333',
    height: 50,
    marginLeft: 20,
    marginRight: 20,
    textAlign: 'center',
  },
  loginButton: {
    borderColor: 'blue',
    borderWidth: 2,
    marginTop: 30,
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 2,
    paddingBottom: 2,
  },
  loginText: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
