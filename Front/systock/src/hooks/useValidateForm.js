import { useEffect, useState, useMemo, useRef } from "react";

// Validation schemas can be passed in dynamically to make the hook more reusable.
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const FORM_TYPE = {
  PREUSER: "USER",
  USER: "CREATE_USER"
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
  }
};

const useValidateForm = (entity, formType) => {
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
  }), []);

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
        console.log("!result",!result);
        console.log("interacted[attribute]",interacted[attribute]);
        if (!result && interacted[attribute]) {
          console.log("came here");
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

  return {
    error,
    hasError,
    hasAnyError,
    hasInteracted
  };
};

export default useValidateForm;
