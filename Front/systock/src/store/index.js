import { legacy_createStore, combineReducers } from 'redux';
import categories from '../redux/reducers/categoryReducer';

const rootReducer = combineReducers({
  categories,
});

const store = legacy_createStore(rootReducer);

export default store;