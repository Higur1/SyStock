import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputAdornment, InputLabel, MenuItem, Select, Slide, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import { CurrencyInput } from "react-currency-mask";
import styled from "styled-components";
import InputCustom from "../../../components/common/InputCustom/InputCustom";
import InputCustomMask from "../../../components/common/InputCustom/InputCustomMaskPhone";
import InputCustomMaskPhone from "../../../components/common/InputCustom/InputCustomMaskPhone";
import InputCustomMaskCEP from "../../../components/common/InputCustom/InputCustomMaskCEP";
import { useEffect } from "react";
import useDebounce from "../../../utils/useDebounce";
import { states } from "../../../utils/utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding-top: 16px;
`
export default function CreateSupplierDialog(props) {
  const { handleCreate, handleClose, errorMessage, open, supplierObj } = props;

  const [supplier, setSupplier] = useState([
    {
      key: 'name',
      value: '',
      label: 'Nome',
      hasError: false,
      isRequired: true,
      max: 20,
      rule: v => v.length > 5 && v.length < 20 
    },
    {
      key: 'email',
      value: '',
      label: 'E-mail',
      hasError: false,
      isRequired: true,
      max: 250,
      rule: v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v)
    }, 
    {
      key: 'phone1',
      value: '',
      label: '',
      hasError: false,
      isRequired: false,
      max: 16,
      rule: v => v.length > 14 && v.length < 16 
    },
    {
      key: 'phone2',
      value: '',
      label: '',
      hasError: false,
      isRequired: false,
      max: 16,
      rule: v => v.length > 14 && v.length < 16 
    },
    {
      key: 'cep',
      value: '',
      label: 'Cep',
      hasError: false,
      isRequired: true,
      max: 9,
      rule: v => v.length === 9
    },
    {
      key: 'city',
      value: '',
      label: 'Cidade',
      hasError: false,
      isRequired: true,
      size: '65%',
      max: 30,
      rule: v => v.length > 5 && v.length < 30 
    },
    {
      key: 'state',
      value: '',
      label: 'Estado',
      hasError: false,
      isRequired: true,
      size: '15%',
      max: 2,
      rule: v => v.length === 2
    }, {
      key: 'street',
      value: '',
      label: 'Rua',
      hasError: false,
      isRequired: true,
      size: '80%',
      max: 250,
      rule: v => v.length > 5 && v.length < 250 
    }, {
      key: 'number',
      value: '',
      label: 'Número',
      hasError: false,
      isRequired: true,
      size: '19%',
      max: 250,
      rule: () => true
    }, {
      key: 'complement',
      value: '',
      label: 'Complemento',
      hasError: false,
      isRequired: false,
      size: '80%',
      max: 250,
      rule: () => true
    },{
      key: 'district',
      value: '',
      label: 'Bairro',
      hasError: false,
      isRequired: true,
      size: '19%',
      max: 250,
      rule: v => v.length > 5 && v.length < 250
    }, 
    {
      key: 'id',
      value: null
    }
  ]);

  useEffect(() => {
    if(!supplierObj) return;

    const { Address, Phone, email, id, name } = supplierObj;
    const { cep, city, complement, district, state, street, number } = Address[0];
    const [phone1, phone2] = Phone;

    setSupplier(prevState => prevState.map(atr => {
      const hasError = false;
      switch(atr.key) {
        case 'id':
          return {...atr, value: id};
        case 'name':
          return {...atr, value: name, hasError};
        case 'email':
          return {...atr, value: email, hasError};
          case 'phone1': {
            const value = phone1.phone;
            return {...atr, value, hasError};
          }
          case 'phone2': {
            const value = phone2.phone;
            return {...atr, value, hasError};
          }
        case 'cep':
          return {...atr, value: cep, hasError};
        case 'city':
          return {...atr, value: city, hasError};
        case 'state':
          return {...atr, value: state, hasError};
        case 'street':
          return {...atr, value: street, hasError};
        case 'number':
          return {...atr, value: number.toString(), hasError};
        case 'complement':
          return {...atr, value: complement, hasError};
        case 'district':
          return {...atr, value: district, hasError};
        default:
          break;
      }
    }));

  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const getCepInfo = async (cep) => {
    setIsLoading(true);

    const url = `https://cdn.apicep.com/file/apicep/${cep}.json`;

    try {
      const obj = await fetch(url);

      const objReturned = await obj.json();

      
      setSupplier(prevState => prevState.map(atr => {
        const { state, city, district, address:street } = objReturned;

        const hasError = false;
        switch(atr.key) {
          case 'state': {
            // const value = states.find(st => st.name === state)?.acronym;

            return {...atr, value: state, hasError};
          }
          case 'city':
            return {...atr, value: city, hasError};
          case 'district':
            return {...atr, value: district, hasError};
          case 'street':
            return {...atr, value: street, hasError};
          default:
            return {...atr, hasError};
        }

      }));
    } catch (e) {
      setSupplier(prevState => prevState.map(atr => {

      if(['state','city','district','street'].includes(atr.key)) {
        return {...atr, value: ''};
      } else if (['cep'].includes(atr.key)) {
        return {...atr, hasError: true}
      } else {
        return atr;
      }
      }));
    } finally {
      setIsLoading(false);
    }
  }

  const onChange = (v, key, max) => {
    const value = v.slice(0, max);
    setSupplier(prevState => prevState.map(atr => (atr.key === key ? {...atr, value, hasError: false} : {...atr})));
  }

  const onConfirm = () => {
    if(supplier.some(atr => atr.hasError)) return;

    const emptyAtr = supplier.filter(atr => atr.value === '' && atr.isRequired);
    if(emptyAtr.length) {
      return setSupplier(prevState => prevState
        .map(atr => (atr.value === '' && atr.isRequired ? {...atr, hasError: true} : {...atr}))
      );
    }

    const result = supplier.map(atr => ({key: atr.key, value: atr.value}));

    handleCreate(result);
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle><Title>{"Adicionar Fornecedor"}</Title></DialogTitle>
        <DialogContent>
          {isLoading && (
            <Backdrop open style={{zIndex: 9999}}>
              <CircularProgress color="secondary" />
            </Backdrop>
          )}
          <Container>
            {supplier.filter(atr => ['name', 'email'].includes(atr.key)).map((atribute, index) => (
              <InputCustom
                key={index}
                required
                label={atribute.label}
                value={atribute.value}
                autoFocus={index === 0}
                error={atribute.hasError || (atribute.value !== '' && !atribute.rule(atribute.value))}
                onChange={(e) => onChange(e.target.value, atribute.key, atribute.max)}
                disabled={isLoading}
              />
            ))}
            <div style={{display: 'flex', flexDirection:'column', gap: 8}}>
              <Title style={{fontSize: 16}}>Telefone</Title>
              <Container style={{gap: 8}}>
                {supplier.filter(atr => ['phone1', 'phone2'].includes(atr.key)).map((atribute, index) => (
                  <div style={{display: 'flex', gap: 16, alignItems: 'center'}} key={index}>
                    <Title style={{fontSize: 16}}>{`${index + 1}°`}</Title>
                    <InputCustomMaskPhone
                      value={atribute.value}
                      onChange={(value) => onChange(value, atribute.key, atribute.max)}
                      error={atribute.hasError}
                    />
                  </div>
                ))}
              </Container>
            </div>
            <div style={{display: 'flex', flexDirection:'column', gap: 8}}>
              <Title style={{fontSize: 16}}>Endereço</Title>
              <Container>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  {
                    supplier.filter(atr => ['cep'].includes(atr.key)).map((atribute, index) => (
                      <InputCustomMaskCEP
                        key={index}
                        label={atribute.label}
                        style={{flexBasis: '19%'}}
                        value={atribute.value}
                        onChange={(value) => onChange(value, atribute.key, atribute.max)}
                        disabled={isLoading}
                        error={atribute.hasError || (atribute.value !== '' && !atribute.rule(atribute.value))}
                        onKeyDown={(e) => {
                          if(e.code !== 'Tab') return;

                          getCepInfo(atribute.value);
                        }}
                        onBlur={() => {
                          if(atribute.value.length !== 9) return;
                          getCepInfo(atribute.value);
                        }}
                      />
                    ))
                  }
                  {supplier.filter(atr => ['city', 'state'].includes(atr.key)).map((atribute, index) => (
                    <InputCustom
                      key={index}
                      label={atribute.label}
                      style={{flexBasis: atribute.size}}
                      value={atribute.value}
                      onChange={(e) => onChange(e.target.value, atribute.key, atribute.max)}
                      disabled={isLoading}
                      error={atribute.hasError || (atribute.value !== '' && !atribute.rule(atribute.value))}
                    />
                  ))}
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                {supplier.filter(atr => ['street', 'number'].includes(atr.key)).map((atribute, index) => (
                  <InputCustom
                    key={index}
                    label={atribute.label}
                    style={{flexBasis: atribute.size}}
                    value={atribute.value}
                    onChange={(e) => onChange(e.target.value, atribute.key, atribute.max)}
                    disabled={isLoading}
                    error={atribute.hasError || (atribute.value !== '' && !atribute.rule(atribute.value))}
                  />
                ))}
                </div>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  {supplier.filter(atr => ['complement', 'district'].includes(atr.key)).map((atribute, index) => (
                    <InputCustom
                      key={index}
                      label={atribute.label}
                      style={{flexBasis: atribute.size}}
                      value={atribute.value}
                      onChange={(e) => onChange(e.target.value, atribute.key, atribute.max)}
                      disabled={isLoading}
                      error={atribute.hasError || (atribute.value !== '' && !atribute.rule(atribute.value))}
                    />
                  ))}
                </div>
              </Container>
            </div>
          </Container>
        </DialogContent>
        <DialogActions>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {errorMessage !== '' && (
              <p style={{fontSize: 16, fontWeight: 600, color: 'red'}}>{errorMessage}</p>
            )}
            <div style={{display:'flex', alignItems: 'center', gap: 16}}>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button onClick={onConfirm}>Adicionar</Button>
            </div>
          </div>
          
        </DialogActions>
      </Dialog>
    </>
  );
}

CreateSupplierDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleCreate: PropTypes.func,
  errorMessage: PropTypes.string,
  supplierObj: PropTypes.object
};