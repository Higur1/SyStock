import Product from "../../../classes/Product"

export default class ProductMappers {
  toServer(obj = new Product({}), type = "POST") {
    console.log(obj);
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
      id,
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

  toInterfaceExpired({expirationDate, product_id_fk, quantity}) {
    const name = product_id_fk?.name;
    const id = product_id_fk?.id;
    const totalQuantity = product_id_fk?.totalQuantityInStock;
    const category = product_id_fk?.category_id_fk?.name || "";
    
    return new Product({ 
      id,
      refCode: id,
      name, 
      expiry: expirationDate ? new Date(expirationDate) : null,
      totalQuantity: totalQuantity, 
      totalQuantitySameExpiry: quantity,
      category
    });
  }
}