import { useEffect, useState, useMemo, useRef } from "react";

// Validation schemas can be passed in dynamically to make the hook more reusable.
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

export const FORM_TYPE = {
  PREUSER: "USER",
  USER: "CREATE_USER",
  PRODUCT: "CREATE_PRODUCT",
  DECREASE_PRODUCT: "DECREASE_PRODUCT"
};

const defaultValidationMessages = {
  [FORM_TYPE.PREUSER]: {
    name: "Nome do Usuário deve conter entre 5 à 20 caracteres",
    email: "Email inválido",
  },
  [FORM_TYPE.USER]: {
    name: "Nome deve conter entre 5 à 20 caracteres",
    user: "Nome de usuário deve conter entre 5 à 10 caracteres",
    password: "Senha deve conter entre 5 à 10 caracteres",
    email: "Email inválido",
  },
  [FORM_TYPE.PRODUCT]: {
    name: "Nome deve conter entre 2 à 20 caracteres",
    priceSell: "O Preço deve ser um valor positivo e no formato adequado",
    priceBuy: "O Preço deve ser um valor positivo e no formato adequado",
    minimumQuantity: "A quantidade deve ser um valor positivo"
  },
  [FORM_TYPE.DECREASE_PRODUCT]: {
    quantityToRemove: "A quantidade deve ser um valor positivo e menor que a quantidade atual"
  }
};

const useValidateForm = (entity, formType, extraValue = {}) => {
  const [error, setError] = useState({});
  const [interacted, setInteracted] = useState({});

  const refEntity = useRef(entity);

  const validateFunctions = useMemo(() => ({
    [FORM_TYPE.PREUSER]: {
      name: (value) => value.length > 5 && value.length < 20,
      email: (value) => emailRegex.test(value),
    },
    [FORM_TYPE.USER]: {
      name: (value) => value.length > 5 && value.length < 20,
      user: (value) => value.length > 5 && value.length < 10,
      password: (value) => value.length > 5 && value.length < 10,
      email: (value) => emailRegex.test(value),
    },
    [FORM_TYPE.PRODUCT]: {
      name: (value) => value.length > 2 && value.length < 20,
      priceSell: (value) => value >= 0 && currencyRegex.test(value),
      priceBuy: (value) => value >= 0 && currencyRegex.test(value),
      minimumQuantity: (value) => value >= 0
    },
    [FORM_TYPE.DECREASE_PRODUCT]: {
      quantityToRemove: (value) => value > 0 && value < extraValue?.currentQuantity
    }
  }), []);

  console.log(extraValue);

  const getValidationMessage = (formType, attribute) => {
    return defaultValidationMessages[formType]?.[attribute] || '';
  };

  useEffect(() => {
    if (entity) {
      insertInteract();
      validate();
    }
  }, [entity]);

  function insertInteract() {
    const interact = {};
    Object.entries(entity).forEach(([attribute, value]) => {
      if(!interacted[attribute]) {
        if(value !== refEntity.current[attribute]) interact[attribute] = true; 
      }
    });

    setInteracted(prev => ({...prev, ...interact}));

  }

  function validate() {
    const nextError = {};

    Object.entries(entity).forEach(([attribute, value]) => {
      if (validateFunctions[formType][attribute]) {
        const result = validateFunctions[formType][attribute](value);
        if (!result && interacted[attribute]) {
          nextError[attribute] = getValidationMessage(formType, attribute);
        }
      }
    });

    setError(nextError);
  }

  const hasError = (field) => !!error[field];
  const hasInteracted = (field) => interacted[field] === true;

  const hasAnyError = Object.keys(entity).some(hasError);

  console.log({error});

  function resetValidate() {
    refEntity.current = entity;
    setError({});
    setInteracted({});
  }

  return {
    error,
    hasError,
    hasAnyError,
    hasInteracted,
    resetValidate
  };
};

export default useValidateForm;
