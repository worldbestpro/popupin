/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, Scene, Router } from 'react-native-router-flux';
import Modal from 'react-native-simple-modal';
import {
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  ScrollView,
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

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
    }
  }

  componentDidMount() {
    // this.setState({modal: true});
    console.log(this.props.auth.latest);
  }

  getDateString(date) {
    let current = new Date();
    let oneDay = 24*60*60*1000;
    let state;

    let diffDays = Math.round(Math.abs(Math.abs(current.getTime() - date.getTime())/oneDay));
    if (diffDays == 0) {
      state = 'Active today';
    } else if (diffDays < 30) {
      state = diffDays + ' days ago';
    } else {
      stte = (Math.round(diffDays/30) + 1) + ' months ago';
    }
    return state;
  }

  gotoPuts() {
    this.props.actions.Auth.getTopicsByMobile(this.props.auth.user['topic']);
    Actions.put();
  }

  gotoReplies(topic) {
    this.props.actions.Auth.getReplies(topic);
    Actions.replies({topic: topic});
  }

  renderRow() {
    let array = [], items;
    items = this.props.auth.latest;
    if (items === null) return;

    for(let i = 0; i < items.length; i++) {
      let date = new Date(items[i]['TimeStamp']);

      if (items[i]['Title'] !== null) {
        array.push(
          <TouchableOpacity key={"key" + i} style={styles.rowContainer} onPress={() => this.gotoReplies(items[i])}>
            <View style={styles.rowLeft}>
              <Image style={styles.logoImage} source={require('../assets/logo.png')} />
            </View>
            <View style={styles.rowRight}>
              <View style={styles.commentTop}>
                <View style={styles.commentTopLeft}>
                  <Text style={styles.topic}>{items[i]['Title']}</Text>
                </View>
                <View style={styles.commentTopRight}>
                  <Text style={styles.active}>{this.getDateString(date)}</Text>
                </View>
              </View>
              <View style={styles.commentBottom}>
                <Text style={styles.description}>{items[i]['Author']}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      }
    }

    return array;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navContainer}>
          <View style={styles.navLeft}>
            <TouchableOpacity onPress={() => Actions.map()}>
              <Icon name="map" size={25} color="#bdc6c9" />
            </TouchableOpacity>
          </View>
          <View style={styles.navCenter}>
            <Text style={styles.navTitle}>Main</Text>
          </View>
          <View style={styles.navRight}>
            <TouchableOpacity onPress={() => this.gotoPuts()}>
              <Icon name="edit" size={30} color="#bdc6c9" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.listContainer}>
          <ScrollView>
            {this.renderRow()}
          </ScrollView>
        </View>

        <Modal
          offset={this.state.offset}
          open={this.state.modal}
          modalDidOpen={() => console.log('modal did open')}
          modalDidClose={() => this.setState({modal: false})}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{fontSize: 20, marginBottom: 10}}>Are you going to use GPS?</Text>
            <TouchableOpacity
              style={{margin: 5}}
              onPress={() => this.setState({modal: false})}>
              <Text style={{fontSize: 18}}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{margin: 5}}
              onPress={() => this.setState({modal: false})}>
              <Text style={{fontSize: 18}}>No</Text>
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
    paddingTop: 25,
    paddingLeft: 20,
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
    padding: 5,
  },
  commentTop: {
    flex: 1,
    flexDirection: 'row',
  },
  commentTopLeft: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTopRight: {
    flex: 2,
    flexDirection: 'row',
  },
  commentBottom: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topic: {
    fontSize: 16,
    fontWeight: '600',
  },
  active: {
    color: 'gray',
    fontSize: 14,
  },
  description: {
    fontSize: 14,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
