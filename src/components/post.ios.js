/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, Scene, Router } from 'react-native-router-flux';
import {
  AppRegistry,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AuthAction from '../actions/auth';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

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

class Post extends Component {
  componentDidMount() {

  }

  gotoPut(mobile) {
    this.props.actions.Auth.getTopicsByMobile(mobile);
  }

  renderRow() {
    let array = [], items = [];
    items = this.props.auth.users;
    if (items === null) return;

    for(let i = 0; i < items.length; i++) {
      array.push(
        <TouchableOpacity key={"key" + i} style={styles.rowContainer} onPress={() => this.gotoPut(items[i]['mobile'])}>
          <View style={styles.rowLeft}>
            <Image style={styles.logoImage} source={require('../assets/logo.png')} />
          </View>
          <View style={styles.rowRight}>
            <Text style={styles.topic}>{items[i]['mobile']}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    return array;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navContainer}>
          <View style={styles.navLeft}>
            <TouchableOpacity onPress={() => Actions.pop()}>
              <Icon name="chevron-left" size={30} color="#bdc6c9" />
            </TouchableOpacity>
          </View>
          <View style={styles.navCenter}>
            <Text style={styles.navTitle}>Post</Text>
          </View>
          <View style={styles.navRight}>
            <TouchableOpacity onPress={() => Actions.map()}>
              <Icon name="edit" size={30} color="#bdc6c9" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.listContainer}>
          <ScrollView>
            {this.renderRow()}
          </ScrollView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth,
    height: deviceHeight,
    backgroundColor: '#F5FCFF',
  },
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'gray',
  },
  navLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
  },
  navCenter: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 20,
  },
  navRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  listContainer: {
    flex: 10,
    flexDirection: 'row',
  },
  rowContainer: {
    flexDirection: 'row',
    borderColor: 'gray',
    borderBottomWidth: 1,
    height: 100,
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 60,
    height: 60,
    resizeMode: 'stretch',
  },
  rowRight: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  topic: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
