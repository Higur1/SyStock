import Category from "../../../classes/Category";
import Supplier from "../../../classes/Supplier";

const minCharsName = 3;
const maxCharsName = 51;

export default function SupplierValidations(supplier = new Supplier()) {
  const name = supplier.name.trim();
  // const email = supplier.email.trim();
  if(!(name.length > minCharsName && name.length < maxCharsName)) return `Nome do Fornecedor deve conter entre ${minCharsName} à ${maxCharsName} caracteres`;

  return null;
}