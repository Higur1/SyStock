import Product from "../../../classes/Product"

export default class ProductMappers {
  toServer(obj = new Product({}), type = "POST") {
    const additional = type === "PUT" ? {id: obj.id} : {};

    const price = Number(obj.priceBaseSell);
    const costPrice = Number(obj.priceBaseBuy);
    const minimunQuantity = Number(obj.minimumQuantity);
    return {
      ...additional,
      name: obj.name,
      price,
      costPrice,
      minimunQuantity,
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

  toInterface({ id, name, price, costPrice, minimunQuantity, observation, totalQuantityInStock, category_id }, {categories, category} = {category: null}) {
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