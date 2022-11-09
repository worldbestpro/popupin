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

class Replies extends Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: null,
    }
  }

  addComment() {
    this.props.actions.Auth.addReply(this.props.topic, this.state.comment, this.props.auth.user['key'], this.props.auth.user['name']);
  }

  renderRow() {
    let array = [], items = [];
    items = this.props.auth.replies;
    if (items === null) return;

    for(let i = 0; i < items.length; i++) {
      array.push(
        <TouchableOpacity key={"key" + i} style={styles.rowContainer} onPress={() => this.addComment()}>
          <View style={styles.rowTitle}>
            <Text style={styles.title}>{items[i]['title']}</Text>
          </View>
          <View style={styles.rowAuthor}>
            <Text style={styles.author}>{items[i]['author_name']}</Text>
          </View>
        </TouchableOpacity>
      )
    }

    array.push(
      <View key={"key" + items.length} style={styles.submit}>
        <TextInput style={styles.submitText} multiline={true} placeholder="Put your reply here..." onChangeText={(value) => this.setState({comment: value})} />
        <TouchableOpacity style={styles.submitButton} onPress={() => this.addComment()}>
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
            <Text style={styles.navTitle}>Reply</Text>
          </View>
          <View style={styles.navRight}>
            <TouchableOpacity onPress={() => {}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Replies);
