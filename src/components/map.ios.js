/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { Actions, Scene, Router } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView from 'react-native-maps';
import _ from 'lodash';
import {
  AppRegistry,
  Dimensions,
  Image,
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

class Map extends Component {
  state = {
    initialPosition: 'unknown',
    lastPosition: 'uknown',
    region: {
      latitude: 35.715112,
      longitude: 139.80616,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    },
    coordinate: {
      latitude: 35.715112,
      longitude: 139.80616,
    }
  };

  watchID: ?number = null;

  componentWillMount() {
    this.setState({
      region: {
        latitude: this.props.auth.user.latitude,
        longitude: this.props.auth.user.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    })
  }

  componentDidMount() {
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     var initialPosition = JSON.stringify(position);
    //     this.setState({initialPosition});
    //     this.setState({
    //       region: {
    //         latitude: position['coords']['latitude'],
    //         longitude: position['coords']['longitude'],
    //         latitudeDelta: 0.0922,
    //         longitudeDelta: 0.0421,
    //       },
    //       coordinate: {
    //         latitude: position['coords']['latitude'],
    //         longitude: position['coords']['longitude'],
    //       },
    //     });
    //   },
    //   (error) => alert(JSON.stringify(error)),
    //   {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    // );
    // this.watchID = navigator.geolocation.watchPosition((position) => {
    //   var lastPosition = JSON.stringify(position);
    //   this.setState({lastPosition});
    // });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  getLatLng(topic) {
    var latlng = {
      latitude: topic.Latitude,
      longitude: topic.Longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    return latlng;
  }

  getCenter(user) {

    var latlng = {
      latitude: user.latitude,
      longitude: user.longitude,
    }

    return latlng;
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.mapContainer}
          region={this.state.region}
          onRegionChange={this.onRegionChange.bind(this)}
        >

          {this.props.auth.latest.map(topic => (!!topic.Latitude) && (
            <MapView.Marker coordinate={this.getLatLng(topic)} key={"marker" + topic.TLink} title={topic.Title} />
          ))}

          <MapView.Circle center={this.getCenter(this.props.auth.user)} fillColor="rgba(0,255,0,0.3)" strokeColor="#0f0" strokeWidth={2} radius={2000} />

        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  mapContainer: {
    width: deviceWidth,
    height: deviceHeight,
  },
  marker: {
    width: 25,
    height: 40,
    resizeMode: 'stretch',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Map);
