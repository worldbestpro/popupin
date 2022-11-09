import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import createLogger from'redux-logger';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';

let isDebugginInChrome = __DEV__ && !!window.navigator.userAgent;

let logger = createLogger({
  predicate: (getState, action) => isDebugginInChrome,
  collapsed: true,
  duration: true,
});

const createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);

export default function configureStore(onComplete: ?() => void) {
  const store = autoRehydrate() (createStoreWithMiddleware)(rootReducer);
  persistStore(store, {storage: AsyncStorage}, onComplete);
  if (isDebugginInChrome) {
    window.store = store;
  }
  return store;
}