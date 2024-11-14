import Batch from "../../../classes/Batch";
import Supplier from "../../../classes/Supplier";
import Supply from "../../../classes/Supply";
import BatchMappers from "../../Batch/Mappers/BatchMappers";

export default class SupplyMappers {
  toServer(obj = new Supply({})) {

    const batchs_fill = obj.batches.map(batch => ({
      quantity: batch.quantity,
      expirationDate: batch.expiry,
      product_id: batch.productID,
      price: Number(batch.priceSell),
      subTotal: batch.priceBuy * batch.quantity,
      costPrice: Number(batch.priceBuy)
    }));

    const totalPrice = obj.getTotalValue();

    return {
      totalPrice,
      batchs_fill,
      supplier_id: obj.supplierID,
      observation: obj.description
    }
  }

  toInterface({
    id = 1,
    totalPrice = "1000",
    observation = "Teste",
    supplier_id = 1,
    user_id = 1,
    createdAt = "2024-11-12T00:00:39.769Z",
    updatedAt = "2024-11-12T00:00:39.769Z"
  }, suppliers = [new Supplier()]) {
    const supply = new Supply();

    supply.id = id;
    supply.totalValue = totalPrice;
    supply.supplier = suppliers.find(sup => sup.id === supplier_id) || null;
    supply.supplierID = supplier_id;
    supply.description = observation;
    supply.dateInsert = new Date(createdAt);

    return supply;
  }

  toInterfaceViewProducts({
    batch_id_fk = {
      product_id_fk: {
        id: 1,
        name: "",
        costPrice: "",
      },
      quantity: 0,
      expirationDate: new Date().toString()
    },
    subTotal,
  }) {

    return {
      id: batch_id_fk?.product_id_fk?.id,
      product: batch_id_fk?.product_id_fk?.name,
      priceBuy: batch_id_fk?.product_id_fk?.costPrice,
      quantity: batch_id_fk?.quantity,
      expiry: batch_id_fk?.expirationDate,
      subTotal
    }
  }
}