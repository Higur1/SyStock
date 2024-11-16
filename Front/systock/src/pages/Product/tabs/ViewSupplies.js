import { Autocomplete, IconButton, Popper, TextField } from '@mui/material';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { MainContext } from '../../../App';
import { ENTITIES } from '../../../utils/debug-local-helper';
import { TableContainer, TableData, TableRow } from '../styles';
import { centerContent, formatDate } from '../../../utils/utils';
import { Visibility } from '@mui/icons-material';
import SupplyActions from '../../../Service/Supply/SupplyActions';
import TableRenderUI from '../../../utils/TableRenderUI';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';

const columns = [
  { value: "dateInsert", label: "Data e Hora" },
  { value: "id", label: "Código do Abastecimento" },
  { value: "supplier", label: "Fornecedor" },
  { value: "totalValue", label: "Total do Custo" },
  { value: "description", label: "Observação" },
  { value: "products", label: "Produtos" }
];

export default function ViewSupplies({ handleViewProducts }) {
  const suppliesBase = useRef();

  const { handleOpenSnackBar } = useContext(MainContext);

  const [suppliersAutoComplete, setSuppliersAutoComplete] = useState([]);
  const [filteredSupplier, setFilteredSupplier] = useState(null);
  const [supplies, setSupplies] = useState([]);

  useEffect(() => {
    getBatches();
  }, []);

  useEffect(() => {
    if (!suppliesBase.current) return;

    filterList(suppliesBase.current, filteredSupplier);
  }, [filteredSupplier]);

  function filterList(suppliesBaseArray = suppliesBase.current, filterSupply = filteredSupplier) {
    if (filterSupply === null) return setSupplies(suppliesBaseArray);
    console.log(suppliesBaseArray, filterSupply);
    const nextFilteredList = suppliesBaseArray.filter(supply => supply.supplierID === filterSupply.id);

    setSupplies(nextFilteredList);
  }
  console.log(suppliesBase.current);

  async function getBatches() {
    try {
      const supplies = await SupplyActions.getAll();
      suppliesBase.current = supplies;

      const suppliersNotFiltered = supplies.map(supply => supply.supplier).filter(supplier => supplier !== null);
      setSuppliersAutoComplete([...suppliersNotFiltered.filter((sup, index) => suppliersNotFiltered.findIndex(supFind => supFind.id === sup.id) === index)]);
    } catch (error) {
      handleOpenSnackBar("error", error);
      suppliesBase.current = [];
    } finally {
      filterList(suppliesBase.current, filteredSupplier);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: "100%", width: "100%", alignItems: 'center' }}>
      <span style={{ fontWeight: 600, textAlign: 'left' }}>
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
              <TableData style={{
                textAlign: centerContent(column.value) ? "center" : "left",
                justifyContent: centerContent(column.value) ? "center" : "flex-start", width: 150, maxWidth: 150
              }} key={`header-column-${i}`}>{column.label}</TableData>
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
                  return (
                    <TableData key={`row-${index}-${i}`} style={{
                      textAlign: centerContent(column.value) ? "center" : "left",
                      justifyContent: centerContent(column.value) ? "center" : "flex-start", width: 150, maxWidth: 150, overflow: 'hidden'
                    }}>
                      <TooltipAndEllipsis centerText={centerContent(column.value)} item={TableRenderUI(column.value, prod[column.value])} />
                    </TableData>
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
