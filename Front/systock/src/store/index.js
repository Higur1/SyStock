import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import categories from '../redux/reducers/categoryReducer';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  categories,
});

const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export default store;