/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Actions, Scene, Router } from 'react-native-router-flux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-simple-modal';
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

class Signup extends Component {
  state = {
    mobile: null,
    name: null,
    initialPosition: null,
    lastPosition: null,
    modal: false,
  };

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ initialPosition: position });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({ lastPosition: position });
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  signup(mobile, name) {
    let items = [];

    if (name === null) return;

    items = this.props.auth.users;
    if (items === null) return;

    for(let i = 0; i < items.length; i++) {
      if (items[i]['mobile'] == mobile) {
        this.setState({modal: true});
        return;
      };
    }

    this.props.actions.Auth.signupWithPhoneNumber(mobile, name, this.state.initialPosition);
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.container}>
          <View style={styles.keyboardContainer}>
            <Text style={styles.welcome}>
              Name
            </Text>
            <TextInput style={styles.phonenumber} autoCapitalize="none" onChangeText={(value) => this.setState({name: value})} />
            <Text style={styles.welcome}>
              PHONE NUMBER
            </Text>
            <TextInput style={styles.phonenumber} keyboardType="number-pad" onChangeText={(value) => this.setState({mobile: value})} />
            <TouchableOpacity style={styles.loginButton} onPress={() => this.signup(this.state.mobile, this.state.name)}>
              <Text style={styles.loginText}>SIGNUP</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <Modal
            offset={this.state.offset}
            open={this.state.modal}
            modalDidOpen={() => console.log('modal did open')}
            modalDidClose={() => this.setState({modal: false})}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontSize: 20, marginBottom: 10}}>This mobile number already exist.</Text>
              <TouchableOpacity
                style={{margin: 5}}
                onPress={() => this.setState({modal: false})}>
                <Text style={{fontSize: 18}}>Ok</Text>
              </TouchableOpacity>
            </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
