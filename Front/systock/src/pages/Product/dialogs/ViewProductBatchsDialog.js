import React, { useContext, useEffect, useMemo, useState } from 'react'
import DialogCustom from '../../../components/common/CustomDialog/DialogCustom'
import { Divider, TextField } from '@mui/material'
import styled from 'styled-components';
import TableRenderUI from '../../../utils/TableRenderUI';
import { MainContext } from '../../../App';
import CircularLoading from '../../../components/common/CircularLoading';
import BatchActions from '../../../Service/Batch/BatchActions';
import Product from '../../../classes/Product';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';

export const TableContainer = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '8px',
  background: "#ebebeb",
  border: '1px solid #d3D3D3',
  height: "100%",
  width: "100%"
});

export const TableRow = styled("div")({
  width: '100%',
  display: 'flex',
  height: '48px',
  padding: '0px 8px',
  alignItems: 'center',
  justifyContent: 'flex-start',
  borderBottom: '1px solid #d3D3D3'
});

export const TableData = styled("div")(() => ({
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  height: '48px',
  fontWeight: 600
}));

const columns = [
  {
    width: "33%", fixedWidth: true, label: "ID do Abastecimento", value: "id"
  },
  {
    width: "33%", fixedWidth: true, label: "Data de Validade", value: "expiry"
  },
  {
    width: "33%", fixedWidth: true, label: "Quantidade nessa Validade", value: "quantity"
  },
]

export default function ViewProductBatchsDialog({ product = new Product(), onClose = () => { } }) {

  const [batchs, setBatchs] = useState(null);
  const { handleOpenSnackBar } = useContext(MainContext);

  useEffect(() => {
    getBatchsInfo();
  }, []);

  async function getBatchsInfo() {
    try {
      const batchs = await BatchActions.getByProduct(product.id);
      setBatchs(batchs);

    } catch (e) {
      console.log(e);
      handleOpenSnackBar("error", e);
    }
  }

  const sum = useMemo(() => {
    if(batchs === null) return 0;
    let result = 0;
    batchs.forEach(batch => {
      result += batch.quantity;
    });
    return result;
  }, [batchs]);

  console.log(batchs, sum);

  return (
    <DialogCustom maxWidth="md" title={"Produto"} hideActions onClose={onClose}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', minWidth: "calc(50% - 16px)", gap: 16 }}>
          <div style={{ flexBasis: "100%" }}><span>Código: <strong>{product.id}</strong></span></div>
          <div style={{ flexBasis: "100%" }}><span>Nome: <strong>{product.name}</strong></span></div>
          <div style={{ flexBasis: "100%" }}><span>Preço de Compra: <strong>{TableRenderUI("price", product.priceBaseBuy)}</strong></span></div>
          <div style={{ flexBasis: "100%" }}><span>Preço de Venda: <strong>{TableRenderUI("price", product.priceBaseSell)}</strong></span></div>
          <div style={{ flexBasis: "100%", justifySelf: 'center', textAlign: "center" }}><span>Quantidade mínima informada: <strong>{product.minimumQuantity}</strong></span></div>
        </div>
        <Divider />
        <TableContainer>
          <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
            {columns.map((column, index) => (
              <TableData style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px', width: column.fixedWidth ? column.width : "100%", maxWidth: column.fixedWidth ? column.width : "auto", flex: column.fixedWidth ? "none" : "1"  }} key={index}>
                {column.label}
              </TableData>
            ))}
          </TableRow>

          {batchs ? (
            <div className="customScroll">
              {(batchs.length > 0) && batchs.map((prod, index) => (
                <TableRow key={`row-${index}`} style={{
                  borderRadius: index === batchs.length - 1 ? '0px 0px 8px 8px' : '0px',
                  borderBottom: index === batchs.length - 1 ? '0px' : '1px solid #d3D3D3',
                  background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5", justifyContent: 'space-between'
                }}>
                  {columns.map((column, i) => {
                    return (
                      <TableData key={`row-${index}-${i}`} 
                        style={{ 
                          width: column.fixedWidth ? column.width : "100%", 
                          maxWidth: column.fixedWidth ? column.width : "auto", 
                          flex: column.fixedWidth ? "none" : "1",
                          overflow: 'hidden'
                        }}
                      >
                        <TooltipAndEllipsis item={TableRenderUI(column.value, prod[column.value])} />
                      </TableData>
                    );
                  })}
                </TableRow>
              ))}
            </div>
          ) : (
            <CircularLoading />
          )}
        </TableContainer>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span>Quantidade Geral: <strong>{sum || "-"}</strong></span>
        </div>
        <TextField
          id="outlined-multiline-static"
          label="Observação"
          multiline
          disabled
          value={""}
          rows={4}
          variant="outlined"
        />
      </div>
    </DialogCustom>
  )
}
