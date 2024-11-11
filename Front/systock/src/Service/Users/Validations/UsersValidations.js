import Account from "../../../classes/Account";

const minCharsName = 5;
const maxCharsName = 20;

const minCharsLogin = 5;
const maxCharsLogin = 10;

const minCharsPassword = 5;
const maxCharsPassword = 10;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export default function UsersValidations(acc = new Account()) {
  const name = acc.name.trim();
  const user = acc.user.trim();
  const password = acc.password.trim();
  const email = acc.email.trim();

  if(!emailRegex.test(email)) return "Formato de e-mail inválido";
  if(!(name.length > minCharsName && name.length < maxCharsName)) return `Nome do Usuário deve conter entre ${minCharsName} à ${maxCharsName} caracteres`;
  if(!(user.length > minCharsLogin && user.length < maxCharsLogin)) return `Login do Usuário deve conter entre ${minCharsLogin} à ${maxCharsLogin} caracteres`;
  if(!(password.length > minCharsPassword && password.length < maxCharsPassword)) return `Senha deve conter entre ${minCharsPassword} à ${maxCharsPassword} caracteres`;

  return null;
}

export function PreUsersValidations(acc = new Account()) {
  const name = acc.name.trim();
  const email = acc.email.trim();

  if(!emailRegex.test(email)) return "Formato de e-mail inválido";
  if(!(name.length > minCharsName && name.length < maxCharsName)) return `Nome do Usuário deve conter entre ${minCharsName} à ${maxCharsName} caracteres`;

  return null;
}