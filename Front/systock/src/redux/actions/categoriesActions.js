import { performFetch } from "../../apiBase"
import { CATEGORIES_DELETING, CATEGORIES_DELETING_ERROR, CATEGORIES_DELETING_SUCCESS, CATEGORIES_GETTING_ALL, CATEGORIES_GETTING_ERROR, CATEGORIES_GETTING_SUCCESS, CATEGORIES_INSERTING_ALL, CATEGORIES_INSERTING_ERROR, CATEGORIES_INSERTING_SUCCESS, CATEGORIES_UPDATING_ALL, CATEGORIES_UPDATING_ERROR, CATEGORIES_UPDATING_SUCCESS } from "./actionTypes";



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

export function insertCategory(category) {
  const url = "/categories/new";

  function insertingCategory(insertingCategory) {
    return {
      type: CATEGORIES_INSERTING_ALL,
      payload: {
        insertingCategory
      }
    };
  }
  
  function insertingCategorySuccess(itemAdded) {
    return {
      type: CATEGORIES_INSERTING_SUCCESS,
      payload: {
        itemAdded,
        insertingCategory: false
      }
    };
  }
  
  function insertingCategoryError(error) {
    return {
      type: CATEGORIES_INSERTING_ERROR,
      payload: {
        insertingCategory: false,
        error
      }
    };
  }

  return (dispatch) => {
    dispatch(insertingCategory(true));

    performFetch(url, {method: 'POST', body: JSON.stringify(category)})
      .then(response => dispatch(insertingCategorySuccess(response)))
      .catch((error) => dispatch(insertingCategoryError(error)));
  }
}

export function updateCategory(category) {
  const url = "/categories/update";

  function updatingCategory(updatingCategory) {
    return {
      type: CATEGORIES_UPDATING_ALL,
      payload: {
        updatingCategory
      }
    };
  }
  
  function updatingCategorySuccess(itemAdded) {
    return {
      type: CATEGORIES_UPDATING_SUCCESS,
      payload: {
        itemAdded,
        updatingCategory: false
      }
    };
  }
  
  function updatingCategoryError(error) {
    return {
      type: CATEGORIES_UPDATING_ERROR,
      payload: {
        updatingCategory: false,
        error
      }
    };
  }

  return (dispatch) => {
    dispatch(updatingCategory(true));

    performFetch(url, {method: 'PUT', body: JSON.stringify(category)})
      .then(response => dispatch(updatingCategorySuccess(response)))
      .catch((error) => dispatch(updatingCategoryError(error)));
  }
}

export function deleteCategory(category) {
  const url = "/categories/delete"
  function deletingCategory(deletingCategory) {
    return {
      type: CATEGORIES_DELETING,
      payload: {
        deletingCategory
      }
    };
  }

  function deletingCategorySuccess() {
    return {
      type: CATEGORIES_DELETING_SUCCESS,
      payload: {
        deletingCategory: false,
        error: null
      }
    }
  }

  function deletingCategoryError(error) {
    return {
      type: CATEGORIES_DELETING_ERROR,
      payload: {
        deletingCategory: false,
        error
      }
    }
  }

  return (dispatch) => {

    dispatch(deletingCategory(true));

    performFetch(url, {method: 'DELETE', body: JSON.stringify(category)})
      .then(() => dispatch(deletingCategorySuccess()))
      .catch((e) => dispatch(deletingCategoryError(e.message)));

  }
}