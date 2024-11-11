import Category from "../../../classes/Category";

const minChars = 3;
const maxChars = 15;

export default function CategoryValidations(category = new Category()) {
  const name = category.name.trim();
  if(!(name.length > minChars && name.length < maxChars)) return "Nome da Categoria deve conter entre 3 a 15 caracteres";

  return null;
}