import Batch from "../../../classes/Batch";
import Supplier from "../../../classes/Supplier";
import Supply from "../../../classes/Supply";
import BatchMappers from "../../Batch/Mappers/BatchMappers";

export default class SupplyMappers {
  toServer(obj = new Supply({})) {
    return {
      product_id: 0, 
      supplier_id: 0, 
      quantity: 0 
    }
  }

  toInterface({
    id=1,
    totalPrice="1000",
    observation="Teste",
    supplier_id=1,
    user_id=1,
    createdAt="2024-11-12T00:00:39.769Z",
    updatedAt="2024-11-12T00:00:39.769Z"
}, suppliers = [new Supplier()]) {
    const supply = new Supply();

    supply.id = id;
    supply.totalValue = totalPrice;
    supply.supplier = suppliers.find(sup => sup.id === supplier_id) || null;
    supply.description = observation;
    supply.dateInsert = new Date(createdAt);

    return supply;
  }
}