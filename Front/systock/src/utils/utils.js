
export function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

export const generateID = () => Math.random().toString().slice(2);


export const centerContent = column => 
  [
    "totalQuantity", 
    "refCode", 
    "priceBaseSell",
    "date",
    "codRef",
    "quantity",
    "movementType",
    "codSell",
    "products",
    "total",
    "paymentType",
    "id",
    "expiry",
    "quantity",
    "priceBuy",
    "subTotal",
    "totalQuantitySameExpiry",
    "minimumQuantity",
    "dateInsert",
    "totalValue",
  ].includes(column);


export const states = [
  { name: "Acre", acronym: "AC" },
  { name: "Alagoas", acronym: "AL" },
  { name: "Amapá", acronym: "AP" },
  { name: "Amazonas", acronym: "AM" },
  { name: "Bahia", acronym: "BA" },
  { name: "Ceará", acronym: "CE" },
  { name: "Distrito Federal", acronym: "DF" },
  { name: "Espírito Santo", acronym: "ES" },
  { name: "Goiás", acronym: "GO" },
  { name: "Maranhão", acronym: "MA" },
  { name: "Mato Grosso", acronym: "MT" },
  { name: "Mato Grosso do Sul", acronym: "MS" },
  { name: "Minas Gerais", acronym: "MG" },
  { name: "Pará", acronym: "PA" },
  { name: "Paraíba", acronym: "PB" },
  { name: "Paraná", acronym: "PR" },
  { name: "Pernambuco", acronym: "PE" },
  { name: "Piauí", acronym: "PI" },
  { name: "Rio de Janeiro", acronym: "RJ" },
  { name: "Rio Grande do Norte", acronym: "RN" },
  { name: "Rio Grande do Sul", acronym: "RS" },
  { name: "Rondônia", acronym: "RO" },
  { name: "Roraima", acronym: "RR" },
  { name: "Santa Catarina", acronym: "SC" },
  { name: "São Paulo", acronym: "SP" },
  { name: "Sergipe", acronym: "SE" },
  { name: "Tocantins", acronym: "TO" }

];

export function formatDate(dateString = null, addHours = true) {
  if (dateString === null) return "";

  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formatDate = `${day}/${month}/${year}${addHours ? ` ${hours < 10 ? `${hours}0` : hours}:${minutes < 10 ? `${minutes}0` : minutes}` : ""}`;

  return formatDate;
}

export function convertMsToDay(ms) {
  const millisecondsInADay = 24 * 60 * 60 * 1000;

  const days = ms / millisecondsInADay;

  return days;
}

export function removeEquals(arr, comparisonStrategy = null) {
  const nextArr = arr.filter((obj, i) => arr.findIndex(objFind => (comparisonStrategy === null ? obj : obj[comparisonStrategy]) === (comparisonStrategy === null ? objFind : objFind[comparisonStrategy])) === i);

  return nextArr;
}

export function extraDateToString(expiry) {
  if(expiry === null) return "";

  const date = new Date(expiry);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const formatDate = `${day}/${month}/${year}`;

  return formatDate;
}

export function dateToTextField(dateString = "") {
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const formatDate = `${year}-${month}-${day}`;

  return formatDate;
}

export const CURRENT_INSTANCE = window.location.host;

export function getErrorMessage(method, route, status, secondaryMessage) {
  
  if(status === 500) return "Ocorreu um erro no sistema";
  switch(route) {
    case "/auth": {
      switch(method) {
        case "POST": {
          if(status === 404) return "Usuário não encontrado";
          if(status === 401) return "Verifique seu usuário e senha";

          break;
        }
        default: break; 
      }
      break;
    }
    case "/recovery": {
      switch(method) {
        case "POST": {
          if(status === 404) return "E-mail não encontrado";

          break;
        }
        default: break; 
      }
      break;
    }
    case "/preusers": {
      switch(method) {
        case "GET": {
          if(status === 401) return "Usuário expirado";

          break;
        }
        default: break; 
      }
      break;
    }
    case "/preuser": {
      switch(method) {
        case "POST": {
          if(status === 409) return "E-mail já está em uso";

          break;
        }
        default: break; 
      }
      break;
    }
    case "/users": {
      switch(method) {
        case "GET": {
          if(status === 401) return "Usuário expirado";
          break;
        }
        case "POST": {
          if(status === 401) return "Usuário expirado";
          if(status === 404) return "Usuário não registrado";
          if(status === 409) return "E-mail já está em uso";
          break;
        }
        default: break; 
      }
      break;
    }
    case "/user": {
      switch(method) {
        case "PATCH": {
          if(status === 401) return "Usuário expirado";
          if(status === 404) return "Usuário não registrado";
          if(status === 409) return "E-mail já existe";
          break;
        }
        case "DELETE": {
          if(status === 401) return "Usuário expirado";
          if(status === 403) return "Não é possível deletar o usuário Administrador";
          if(status === 404) return "Usuário não encontrado";
          
          break;
        }
        default: break; 
      }
      break;
    }
    case "/reset/password": {
      switch(method) {
        case "PUT": {
          if(status === 401) return "Usuário expirado";
          if(status === 400) return "A senha já foi atualizada utilizando esse link";
          break;
        }
        default: break; 
      }
      break;
    }
    case "/category": {
      switch(method) {
        case "POST": {
          if(status === 401) return "Usuário expirado"; 
          if(status === 409) return "Categoria já existe";
          break;
        }
        case "GET": {
          if(status === 401) return "Usuário expirado"; 
          if(status === 404) return "Categoria não encontrada"; 
          break;
        }
        case "PUT": {
          if(status === 401) return "Usuário expirado"; 
          if(status === 409) return "Categoria já existe";
          if(status === 404) return "Categoria não encontrada"; 
          break;
        }
        case "DELETE": {
          if(status === 401) return "Usuário expirado"; 
          if(status === 404) return "Categoria não encontrada"; 
          if(status === 409) return "Não é possível deletar essa categoria pois está registrada em outros produtos"; 
          break;
        }
        default: break; 
      }
      break;
    }
    case "/categories": {
      switch(method) {
        case "GET": {
          if(status === 401) return "Usuário expirado";
          break;
        }
        default: break; 
      }
      break;
    }
    case "/suppliers": {
      switch(method) {
        case "GET": {
          if(status === 401) return "Usuário expirado";
          break;
        }
        default: break; 
      }
      break;
    }
    case "/supplier": {
      switch(method) {
        case "GET": {
          if(status === 404) return "Fornecedor não encontrado";
          if(status === 401) return "Usuário expirado";
          break;
        }
        case "POST": {
          if(status === 401) return "Usuário expirado";
          if(status === 409) return "Nome, telefone ou email já existem";
          break;
        }
        case "DELETE": {
          if(status === 401) return "Usuário expirado";
          if(status === 404) return "Fornecedor não encontrado";
          
          break;
        }
        case "PUT": {
          if(status === 401) return "Usuário expirado";
          if(status === 404) return "Fornecedor não encontrado";
          if(status === 409) return "Nome, telefone ou email já existem";
          break;
        }
        default: break; 
      }
      break;
    }
    case "/products": {
      switch(method) {
        case "GET": {
          if(status === 401) return "Usuário expirado";
          break;
        }
        case "POST": {
          if(status === 401) return "Usuário expirado";
          if(status === 409) return "Produto já existe";
          break;
        }
        case "PUT": {
          if(status === 401) return "Usuário expirado";
          if(status === 409) return "Nome já existe";
          break;
        }
        case "DELETE": {
          if(status === 401) return "Usuário expirado";
          if(status === 409) return "Não foi possível deletar esse produto, o mesmo contém quantidade em estoque";
          break;
        }
        default: break; 
      }
      break;
    }
    case "/batchs": {
      switch(method) {
        case "GET": {
          if(status === 401) return "Usuário expirado";
          break;
        }
        case "POST": {
          if(status === 401) return "Usuário expirado";
          if(status === 404) return "Lote não encontrado";
          if(status === 409) return "A quantidade est[a menor que a requerida";
          break;
        }
        default: break; 
      }
      break;
    }
    case "/batch/subQuantity": {
      switch(method) {
        case "POST": {
          if(status === 409) return "Quantidade insuficiente";
          break;
        }
      }
      break;
    }
    default: break;
  }
  return secondaryMessage || "Ocorreu um erro";
}

export function formatPhoneNumber(numberString) {
  return numberString.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

export function formatToCurrency(value) {
  const number = typeof value === "number" ? value : parseFloat(value);
  if (isNaN(number)) return "Invalid number";

  // Format the number as currency
  return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2, 
  }).format(number);
}

export function formatDateToTextField(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function removeFromHash(obj = {}, key) {
  const nextObj = {};
  Object.entries(obj).forEach(([objKey, objValue]) => {
    if(objKey !== key) nextObj[objKey] = objValue;
  });

  return nextObj;
}

export function textFieldDateToDateObject(dateString = "11-14-2000") {
  if(dateString === "") return null;
  const nextDate = new Date(dateString);
  console.log(nextDate);

  const diffMinutes = nextDate.getTimezoneOffset();
  nextDate.setMinutes(nextDate.getMinutes() + diffMinutes);

  return nextDate;
}