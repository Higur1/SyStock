import { Autocomplete, IconButton, Popper, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MainContext } from '../../../App';
import { ENTITIES } from '../../../utils/debug-local-helper';
import { TableContainer, TableData, TableRow } from '../styles';
import { formatDate } from '../../../utils/utils';
import { Visibility } from '@mui/icons-material';

const columns = [
  { value: "dateInsert", label: "Data e Hora"},
  { value: "id", label: "Código do Abastecimento"},
  { value: "supplier", label: "Fornecedor"},
  { value: "totalCost", label: "Total do Custo"},
  { value: "description", label: "Observação"},
  { value: "products", label: "Produtos"}
];

export default function ViewSupplies({handleViewProducts}) {
  const suppliesBase = useRef();

  const [suppliersAutoComplete, setSuppliersAutoComplete] = useState([]);
  const [filteredSupplier, setFilteredSupplier] = useState(null);
  const [supplies, setSupplies] = useState([]);

  const { getData } = useContext(MainContext);

  useEffect(() => {
    const arr = getData(ENTITIES.SUPPLIERS);
    suppliesBase.current = getData(ENTITIES.SUPPLY_LIST);
    setSuppliersAutoComplete(arr);

    filterList(suppliesBase.current, null);
  }, []);

  useEffect(() => {
    if(!suppliesBase.current) return;

    filterList(suppliesBase.current, filteredSupplier);
  }, [filteredSupplier]);

  function filterList(suppliesBaseArray = suppliesBase.current, filterSupply = filteredSupplier) {
    if (filterSupply === null) return setSupplies(suppliesBaseArray);
    const nextFilteredList = suppliesBaseArray.filter(supply => supply.supplier.email === filterSupply.email);

    setSupplies(nextFilteredList);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: "100%", width: "100%", alignItems: 'center' }}>
      <span style={{ fontWeight: 600, textAlign: 'center' }}>
        Lista de Abastecimentos Recentes
      </span>
      <Autocomplete
        disablePortal
        options={suppliersAutoComplete}
        value={filteredSupplier}
        onChange={(event, newInputValue) => {
          setFilteredSupplier(newInputValue);
        }}
        getOptionLabel={(option) => option.name}
        sx={{ width: "100%" }}
        renderInput={(params) => <TextField {...params} label="Fornecedor do Abastecimento" />}
        placeholder='Selecione o fornecedor para o abastecimento'
        // PopperComponent={props => <Popper {...props} style={{ ...props.style, zIndex: 100000 }} disablePortal={false} />}
        // PopperComponent={<Popper style={{zIndex: 2}}/>}
        // ListboxProps={{ style: { zIndex: 5 } }}
      />
      <div style={{ height: "100%", overflow: "hidden" }}>
        <TableContainer>
          <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
            {columns.map((column, i) => (
              <TableData style={{ justifyContent: 'center', width: 150, maxWidth: 150 }} key={`header-column-${i}`}>{column.label}</TableData>
            ))}
          </TableRow>
          <div className="customScroll">
            {(supplies.length > 0) && supplies.map((prod, index) => (
              <TableRow key={`row-${index}`} style={{
                borderRadius: index === supplies.length - 1 ? '0px 0px 8px 8px' : '0px',
                borderBottom: index === supplies.length - 1 ? '0px' : '1px solid #d3D3D3',
                background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
              }}>
                {columns.map((column, i) => {

                  if (column.value === "products") {
                    return (
                      <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>
                        <IconButton onClick={() => handleViewProducts(prod)}>
                          <Visibility />
                        </IconButton>
                      </TableData>
                    );
                  }

                  if (column.value === "supplier") {
                    return (
                      <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod[column.value].name}</TableData>
                    );
                  }
                  if (column.value === "dateInsert") {
                    return (
                      <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{formatDate(prod[column.value], true)}</TableData>
                    );
                  }
                  if (column.value === "totalCost") {
                    return (
                      <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod.getTotalValue()}</TableData>
                    );
                  }

                  
                  if(!prod[column.value]) {
                    return (
                      <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}></TableData>
                    )
                  }

                  return (
                    <TableData key={`row-${index}-${i}`} style={{ justifyContent: 'center', width: 150, maxWidth: 150 }}>{prod[column.value]}</TableData>
                  );
                })}
              </TableRow>
            ))}
          </div>
        </TableContainer>
      </div>
    </div>
  )
}
