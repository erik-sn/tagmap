import { routerReducer } from 'react-router-redux';
import { combineReducers } from 'redux';

import DataReducer from './data_reducer';
import DisplayReducer from './display_reducer';

const rootReducer = combineReducers({
  router: routerReducer,
  data: DataReducer,
  display: DisplayReducer,
});

export default rootReducer;
