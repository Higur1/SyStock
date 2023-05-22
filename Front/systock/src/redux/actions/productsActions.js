import { performFetch } from "../../apiBase"

export function createProduct(product) {
  const url = "/products/new";

  function creatingProduct(isCreatingProduct) {
    return {
      type: PRODUCTS_CREATING,
      payload: {
        isCreatingProduct
      }
    };
  }

  function creatingProductSuccess(isCreatingProduct) {
    return {
      type: PRODUCTS_CREATING,
      payload: {
        isCreatingProduct
      }
    };
  }

  function creatingProductError(error) {
    return {
      type: PRODUCTS_CREATING_ERROR,
      payload: {
        error,
        isCreatingProduct: false
      }
    };
  }

  function creatingProductSuccess() {
    return {
      type: PRODUCTS_CREATING_SUCCESS,
      payload: {
        error: null,
        isCreatingProduct: false,
      }
    };
  }

  return dispatch => {

    dispatch(creatingProduct(true));

    performFetch(url, {method: "POST", body: JSON.stringify(product)})
    .then(response => {
      if(response.status === 200) {
        dispatch(creatingProductError(response.statusText));
      } else if (response.status === 201) {
        dispatch(creatingProductSuccess());
      }
    })
    .catch(error => dispatch(creatingProductError(error.message)));
  }
}

export function getProducts() {
  const url = "/products";

  function gettingProducts(isGettingProducts) {
    return {
      type: PRODUCTS_GETTING_ALL,
      payload: {
        isGettingProducts
      }
    };
  }
  
  function gettingProductsSuccess(products) {
    const items = Array.isArray(products) ? products : []
    return {
      type: PRODUCTS_GETTING_SUCCESS,
      payload: {
        items,
        isGettingProducts: false,
        error: null
      }
    };
  }
  
  function gettingProductsError(error) {
    return {
      type: PRODUCTS_GETTING_ERROR,
      payload: {
        isGettingProducts: false,
        error
      }
    };
  }

  return (dispatch) => {

    dispatch(gettingProducts(true));

    performFetch(url, {method: 'GET'})
      .then(response => dispatch(gettingProductsSuccess(response)))
      .catch((error) => dispatch(gettingProductsError(error.message)));

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