import { formatDate, formatToCurrency } from "./utils";

export default (type, value) => {
  if(!value) return;
  switch(type) {
    case "createdAt":
    case "updateAt":
    case "dateInsert":
    case "date":
    case "expiry": {
      const addHours = ["createdAt", "updateAt", "dateInsert"].includes(type);
      return formatDate(value?.toString(), addHours);
    }
    case "subTotal":
    case "totalValue":
    case "priceBaseSell":
    case "price":
    case "unitValue":
    case "subtotal":
    case "priceBuy": {
      return formatToCurrency(value);
    }
    case "supplier":
    case "category": {
      return value?.name || value;
    }
    case "movementType":
    default: return value;
  }
}