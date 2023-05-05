import initialState from "../../store/initialState";
import { CATEGORIES_GETTING_ALL, CATEGORIES_GETTING_ERROR, CATEGORIES_GETTING_SUCCESS, CATEGORIES_INSERTING_ALL, CATEGORIES_INSERTING_ERROR, CATEGORIES_INSERTING_SUCCESS, CATEGORIES_UPDATING_ALL, CATEGORIES_UPDATING_ERROR, CATEGORIES_UPDATING_SUCCESS } from "../actions/actionTypes";


export default function categoryReducer(state = initialState.category, action) {
  switch (action.type) {
    case CATEGORIES_GETTING_ALL:
    case CATEGORIES_GETTING_ERROR:
    case CATEGORIES_GETTING_SUCCESS:
    case CATEGORIES_INSERTING_ALL:
    case CATEGORIES_INSERTING_ERROR:
    case CATEGORIES_INSERTING_SUCCESS:
    case CATEGORIES_UPDATING_ALL:
    case CATEGORIES_UPDATING_ERROR:
    case CATEGORIES_UPDATING_SUCCESS:
      return {...state, ...action.payload}
    default:
      return state
  }
}

