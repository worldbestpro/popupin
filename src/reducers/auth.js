import { Actions } from 'react-native-router-flux';

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

const initialState = {
  mobile:       null,
  name:         null,
  user:         null,
  users:        null,
  topics:       null,
  latest:       null,
  replies:      null,
};

export default function AuthReducers(state = initialState, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        user:   action.payload.user,
      });
      break;
    case GETUS_SUCCESS:
      return Object.assign({}, state, {
        users:   action.payload.users,
      });
      break;
    case GETTP_SUCCESS:
      return Object.assign({}, state, {
        topics:   action.payload.topics,
      });
      break;
    case GETLT_SUCCESS:
      return Object.assign({}, state, {
        latest:   action.payload.topics,
      });
      break;
    case GETRP_SUCCESS:
      return Object.assign({}, state, {
        replies:   action.payload.replies,
      });
      break;
    default:
      return state;
  }
}
