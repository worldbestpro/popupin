import React from 'react';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';

import config from '../lib/config';

const {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  GETUS_REQUEST,
  GETUS_SUCCESS,
  GETUS_FAILURE,

  GETTP_REQUEST,
  GETTP_SUCCESS,
  GETTP_FAILURE,

  GETLT_REQUEST,
  GETLT_SUCCESS,
  GETLT_FAILURE,

  GETRP_REQUEST,
  GETRP_SUCCESS,
  GETRP_FAILURE,
} = require('../lib/constants').default;

const firebaseApp = firebase.initializeApp(config.firebaseConfig);

export function loginWithMobile(item) {
  return dispatch => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: item },
    })
  }
}

export function signupWithPhoneNumber(mobile, name, position) {
  return dispatch => {
    let userKey, topicKey;

    itemsRef = firebaseApp.database().ref('V1/GTopics');
    topicKey = itemsRef.push({ mobile: mobile }).key;

    let itemsRef = firebaseApp.database().ref('V1/GUsers');
    itemsRef.push({ mobile: mobile, name: name, latitude: position['coords']['latitude'], longitude: position['coords']['longitude'], topic: topicKey });

    Actions.login();
  }
}

export function getUsers() {
  return dispatch => {
    let items = [];
    const itemsRef = firebaseApp.database().ref('V1/GUsers');

    itemsRef.once('value', (snap) => {
      // get children as an array
      let items = [];
      snap.forEach((child) => {
        items.push({ key: child.key, mobile: child.val()['mobile'], name: child.val()['name'], latitude: child.val()['latitude'], longitude: child.val()['longitude'], topic: child.val()['topic'] });
      });

      dispatch({
        type: GETUS_SUCCESS,
        payload: { users: items },
      })
    });
  }
}

export function getTopicsByMobile(link) {
  return dispatch => {
    const itemsRef = firebaseApp.database().ref('V1/GTopics/' + link + '/Topics');

    itemsRef.once('value', (snap) => {
      // get children as an array

      let items = [];
      snap.forEach((item) => {
        items.push({ Author: item.val()['Author'], Title: item.val()['Title'], TimeStamp: item.val()['TimeStamp']});
      });

      dispatch({
        type: GETTP_SUCCESS,
        payload: { topics: items },
      })

      Actions.put();

    });
  }
}

export function getLatestTopics() {
  return dispatch => {
    const itemsRef = firebaseApp.database().ref('V1/GTopics');

    itemsRef.once('value', (snap) => {

      let items = [];
      let counts = 0;

      snap.forEach((child) => {
        counts += 1;
      });

      snap.forEach((child) => {

        const itemRef = firebaseApp.database().ref('V1/GTopics/' + child.key + '/Topics');

        itemRef.once('value', (snaps) => {

          let comment = null, time = null, author = null, tlink = null, lat = null, lng = null;
          snaps.forEach((item) => {
            if (time == null) {
              tlink = item.key;
              time = item.val()['TimeStamp'];
              comment = item.val()['Title'];
              author = item.val()['Author'];
              lat = item.val()['Latitude'];
              lng = item.val()['Longitude'];
            } else {
              if (Date.parse(time) < Date.parse(item.val()['TimeStamp'])) {
                tlink = item.key;
                time = item.val()['TimeStamp'];
                comment = item.val()['Title'];
                author = item.val()['Author'];
                lat = item.val()['Latitude'];
                lng = item.val()['Longitude'];
              }
            }
          });

          items.push({ Author: author, Title: comment, TimeStamp: time, Mobile: child.val()['mobile'], ULink: child.key, TLink: tlink, Latitude: lat, Longitude: lng });

          if (counts == items.length) {
            dispatch({
              type: GETLT_SUCCESS,
              payload: { topics: items },
            })
          } else if (items.length === 0) {
            dispatch({
              type: GETLT_SUCCESS,
              payload: { topics: null },
            })
          }
        });
      })
    });
  }
}

export function getReplies(topic) {
  return dispatch => {
    let items = [];
    const itemsRef = firebaseApp.database().ref('V1/GTopics/' + topic['ULink'] + '/Topics/' + topic['TLink'] + '/Replies');

    itemsRef.on('value', (snap) => {
      // get children as an array
      var items = [];
      snap.forEach((child) => {
        items.push({ title: child.val()['Title'], date: child.val()['Date'], author_link: child.val()['AuthorLink'], author_name: child.val()['AuthorName'] });
      });

      dispatch({
        type: GETRP_SUCCESS,
        payload: { replies: items },
      })
    });
  }
}

export function addTopic(user, topic, lat, lng) {
  return dispatch => {
    const itemsRef = firebaseApp.database().ref('V1/GTopics/' + user['topic'] + '/Topics');
    let now = new Date().toString();
    itemsRef.push({ Title: topic, Author: user['name'], TimeStamp: now, Latitude: lat, Longitude: lng });
  }
}

export function addReply(topic, title, link, name) {
  return dispatch => {
    let items = [];
    let now = new Date().toString();
    const itemsRef = firebaseApp.database().ref('V1/GTopics/' + topic['ULink'] + '/Topics/' + topic['TLink'] + '/Replies');

    itemsRef.push({ Title: title, TimeStamp: now, AuthorLink: link, AuthorName: name });
  }
}

// function orderUsers(user, users) {
//   let counts = users.length;

//   for (let i = 0; i < counts; i++) {
//     for (let j = i + 1; j < counts; j++) {

//     }
//   }
// }

// function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
//   let R = 6371;
//   let dLat = deg2rad(lat2 - lat1);
//   let dLon = deg2rad(lon2 - lon1);
//   let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
//   let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
//   let d = R * c;
//   return d;
// }

// function deg2rad(deg) {
//   return deg * (Math.PI/180);
// }
