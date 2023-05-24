import { performFetch } from "../../apiBase"
import { PRODUCTS_CREATING, PRODUCTS_CREATING_ERROR, PRODUCTS_CREATING_SUCCESS, PRODUCTS_DELETING, PRODUCTS_DELETING_ERROR, PRODUCTS_DELETING_SUCCESS, PRODUCTS_GETTING_ALL, PRODUCTS_GETTING_ERROR, PRODUCTS_GETTING_SUCCESS, PRODUCTS_UPDATING, PRODUCTS_UPDATING_ERROR, PRODUCTS_UPDATING_SUCCESS } from "./actionTypes";

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

export function updateProduct(product) {
  const url = "/products/update";

  function updatingProduct(isUpdatingProduct) {
    return {
      type: PRODUCTS_UPDATING,
      payload: {
        isUpdatingProduct
      }
    };
  }
  
  function updatingProductSuccess(itemAdded) {
    return {
      type: PRODUCTS_UPDATING_SUCCESS,
      payload: {
        itemAdded,
        isUpdatingProduct: false
      }
    };
  }
  
  function updatingProductError(error) {
    return {
      type: PRODUCTS_UPDATING_ERROR,
      payload: {
        isUpdatingProduct: false,
        error
      }
    };
  }

  return (dispatch) => {
    dispatch(updatingProduct(true));

    performFetch(url, {method: 'PUT', body: JSON.stringify(product)})
      .then(response => dispatch(updatingProductSuccess(response)))
      .catch((error) => dispatch(updatingProductError(error.message)));
  }
}

export function deleteProduct(Product) {
  const url = "/products/delete"
  function deletingProduct(isDeletingProduct) {
    return {
      type: PRODUCTS_DELETING,
      payload: {
        isDeletingProduct
      }
    };
  }

  function deletingProductSuccess() {
    return {
      type: PRODUCTS_DELETING_SUCCESS,
      payload: {
        isDeletingProduct: false,
        error: null
      }
    }
  }

  function deletingProductError(error) {
    return {
      type: PRODUCTS_DELETING_ERROR,
      payload: {
        isDeletingProduct: false,
        error
      }
    }
  }

  return (dispatch) => {

    dispatch(deletingProduct(true));

    performFetch(url, {method: 'DELETE', body: JSON.stringify(Product)})
      .then(() => dispatch(deletingProductSuccess()))
      .catch((e) => dispatch(deletingProductError(e.message)));

  }
}