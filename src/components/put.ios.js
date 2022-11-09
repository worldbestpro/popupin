/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, Scene, Router } from 'react-native-router-flux';
import {
  Alert,
  AppRegistry,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

class Put extends Component {
  state = {
    initialPosition: null,
    lastPosition: null,
    region: {
      latitude: 35.715112,
      longitude: 139.80616,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    coordinate: {
      latitude: 35.715112,
      longitude: 139.80616,
    },
    comment: null,
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = position;
        this.setState({initialPosition});
        this.setState({
          region: {
            latitude: position['coords']['latitude'],
            longitude: position['coords']['longitude'],
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
          coordinate: {
            latitude: position['coords']['latitude'],
            longitude: position['coords']['longitude'],
          },
        });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }

  addComment(user, topic) {
    let endDate, hours, enable;
    enable = true;
    endDate = new Date();

    this.props.auth.topics.map(topic => {
      let startDate = new Date(topic.TimeStamp);
      hours = (endDate.getTime() - startDate.getTime())/1000/60/60;
      if (hours < 24) enable = false;
    });

    if (enable) {
      this.props.actions.Auth.addTopic(user, topic, this.state.initialPosition['coords']['latitude'], this.state.initialPosition['coords']['longitude']);
      this.props.actions.Auth.getTopicsByMobile(user['topic']);
      this.props.actions.Auth.getLatestTopics();
    } else {
      Alert.alert(
        'Warnning',
        "You can't create a new post now.\nPlease try a few hours later.",
        {text: 'OK', onPress: () => {}}
      );
    }
  }

  renderRow() {
    let array = [], items = [];
    items = this.props.auth.topics;
    if (items === null) return;

    for(let i = 0; i < items.length; i++) {
      array.push(
        <TouchableOpacity key={"key" + i} style={styles.rowContainer} onPress={() => {}}>
          <View style={styles.rowTitle}>
            <Text style={styles.title}>{items[i]['Title']}</Text>
          </View>
          <View style={styles.rowAuthor}>
            <Text style={styles.author}>{items[i]['Author']}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    array.push(
      <View key={"key" + items.length} style={styles.submit}>
        <TextInput style={styles.submitText} multiline={true} placeholder="Put your comment here..." onChangeText={(value) => this.setState({comment: value})} />
        <TouchableOpacity style={styles.submitButton} onPress={() => this.addComment(this.props.auth.user, this.state.comment)}>
          <Text style={styles.buttonStyle}>Submit</Text>
        </TouchableOpacity>
      </View>
    )

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
            <Text style={styles.navTitle}>Put</Text>
          </View>
          <View style={styles.navRight}>
            <TouchableOpacity onPress={() => {}}>
              <Icon name="edit" size={30} color="#bdc6c9" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.listContainer}>
          <ScrollView keyboardShouldPersistTaps={true}>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  navLeft: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
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
    flexDirection: 'column',
    borderColor: 'gray',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    height: 80,
    backgroundColor: '#fff',
  },
  rowTitle: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowAuthor: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  author: {
    fontSize: 18,
    fontWeight: '400',
  },
  submit: {
    flexDirection: 'column',
    borderColor: 'gray',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 5},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    height: 200,
    backgroundColor: '#fff',
  },
  submitText: {
    flex: 4,
    flexDirection: 'row',
    fontSize: 20,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#72a4f8',
  },
  buttonStyle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Put);
