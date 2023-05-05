import initialState from "../../store/initialState";
import { CATEGORIES_GETTING_ALL, CATEGORIES_GETTING_ERROR, CATEGORIES_GETTING_SUCCESS } from "../actions/actionTypes";


export default function categoryReducer(state = initialState.category, action) {
  switch (action.type) {
    case CATEGORIES_GETTING_ALL:
    case CATEGORIES_GETTING_ERROR:
    case CATEGORIES_GETTING_SUCCESS:
      return {...state, ...action.payload}
    default:
      return state
  }
}

