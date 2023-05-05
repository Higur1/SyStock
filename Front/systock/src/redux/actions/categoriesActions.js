import { apiBase, performFetch } from "../../apiBase"
import { CATEGORIES_GETTING_ALL, CATEGORIES_GETTING_ERROR, CATEGORIES_GETTING_SUCCESS } from "./actionTypes";



export function getCategories() {
  const url = "/categories";

  function gettingCategories(isGettingGategories) {
    return {
      type: CATEGORIES_GETTING_ALL,
      payload: {
        isGettingGategories
      }
    };
  }
  
  function gettingCategoriesSuccess(items) {
    return {
      type: CATEGORIES_GETTING_SUCCESS,
      payload: {
        items,
        isGettingGategories: false
      }
    };
  }
  
  function gettingCategoriesError(error) {
    return {
      type: CATEGORIES_GETTING_ERROR,
      payload: {
        isGettingGategories: false,
        error
      }
    };
  }

  return (dispatch) => {

    dispatch(gettingCategories(true));

    performFetch(url, {method: 'GET'})
      .then(response => dispatch(gettingCategoriesSuccess(response)))
      .catch((error) => dispatch(gettingCategoriesError(error)));

    // performFetch(`${apiBase}${url}`, {method: 'GET'})
    //   .then(response => dispatch(gettingCategoriesSuccess(response)))
    //   .catch((error) => dispatch(gettingCategoriesError(error)));
  }
}