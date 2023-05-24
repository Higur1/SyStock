import initialState from "../../store/initialState";
import { 
  PRODUCTS_CREATING,
  PRODUCTS_CREATING_ERROR,
  PRODUCTS_CREATING_SUCCESS,
  PRODUCTS_DELETING,
  PRODUCTS_DELETING_ERROR,
  PRODUCTS_DELETING_SUCCESS,
  PRODUCTS_GETTING_ALL,
  PRODUCTS_GETTING_ERROR,
  PRODUCTS_GETTING_SUCCESS,
  PRODUCTS_UPDATING,
  PRODUCTS_UPDATING_ERROR,
  PRODUCTS_UPDATING_SUCCESS
 } from "../actions/actionTypes";


export default function categoryReducer(state = initialState.products, action) {
  switch (action.type) {
    case PRODUCTS_GETTING_ALL:
    case PRODUCTS_GETTING_ERROR:
    case PRODUCTS_GETTING_SUCCESS:
    case PRODUCTS_CREATING:
    case PRODUCTS_CREATING_ERROR:
    case PRODUCTS_CREATING_SUCCESS:
    case PRODUCTS_UPDATING:
    case PRODUCTS_UPDATING_ERROR:
    case PRODUCTS_UPDATING_SUCCESS:
      return {...state, ...action.payload}
    default:
      return state
  }
}

