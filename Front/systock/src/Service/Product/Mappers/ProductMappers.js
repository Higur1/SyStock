import Product from "../../../classes/Product"

export default class ProductMappers {
  toServer(obj = new Product({}), type = "POST") {
    const additional = type === "PUT" ? {id: obj.id} : {};
    return {
      ...additional,
      name: obj.name,
      price: obj.priceBaseSell,
      costPrice: obj.priceBaseBuy,
      minimunQuantity: obj.minimumQuantity,
      observation: obj.description,
      category_id: obj.category?.id,
    }
  }

  toServerLogin({user, password}) {
    return {
      user_login:user,
      user_password: password
    }
  }

  toInterface({ id, name, price, costPrice, minimunQuantity, observation, totalQuantityInStock, category_id }, {categories, category}) {
    const nextCategory = category ? category : categories.find(cat => cat.id === category_id);
    return new Product({ 
      refCode: id,
      name, 
      priceBaseSell: price, 
      priceBaseBuy: costPrice, 
      minimumQuantity: minimunQuantity, 
      description: observation, 
      totalQuantity: totalQuantityInStock, 
      category: nextCategory
    });
  }
}