import { formatDate, formatToCurrency } from "./utils";

export default (type, value) => {
  switch(type) {
    case "createdAt":
    case "updateAt":
    case "dateInsert":
    case "date":
    case "expiry": {
      if(value === null) return "--/--/----";
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
      if(!value) {
        if(type === "supplier") return "Sem fornecedor";
        if(type === "category") return "Sem categoria";
      }
      return value?.name || value;
    }
    case "movementType":
    default: return value;
  }
}