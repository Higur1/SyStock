import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react'
import { centerContent, formatDate } from '../../../utils/utils';
import { TableContainer, TableData, TableRow } from '../styles';
import Supply from '../../../classes/Supply';
import ProductActions from '../../../Service/Product/ProductActions';
import { MainContext } from '../../../App';
import CircularLoading from '../../../components/common/CircularLoading';
import TableRenderUI from '../../../utils/TableRenderUI';
import SupplyActions from '../../../Service/Supply/SupplyActions';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';

const infos = [
  { value: "id", label: "Código do Abastecimento" },
  { value: "supplier", label: "Fornecedor" },
  { value: "dateInsert", label: "Data e Hora do Abastecimento" }
];

const columns = [
  { value: "product", label: "Produto" },
  { value: "quantity", label: "Quantidade" },
  { value: "expiry", label: "Data de Validade" },
  { value: "priceBuy", label: "Preço de Custo" },
  { value: "subTotal", label: "SubTotal" },
];

export default function ViewProductsBySupply({ supply = new Supply(), onClose }) {
  const { handleOpenSnackBar } = useContext(MainContext);

  const [products, setProducts] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);
  async function getProducts() {
    try {
      const response = await SupplyActions.getById(supply.id);

      setProducts(response);
    } catch (error) {
      setProducts([]);
      handleOpenSnackBar("error", error);
    }
  }

  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
      onClose={onClose}
    >
      <DialogTitle>{`Visualizar Produtos`}</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Informações do Abastecimento</span>
            <div style={{ display: "flex", gap: 4, flexDirection: 'column' }}>
              {infos.map((info, i) => (
                <span style={{ color: "#8f8f8f" }} key={i}>{`${info.label}: `}
                  <strong>
                    <>
                      {info.value === "id" && <>{supply[info.value] ? supply[info.value] : ""}</>}
                      {info.value === "supplier" && <>{supply[info.value]?.name}</>}
                      {info.value === "dateInsert" && <>{supply[info.value] ? formatDate(supply[info.value], true) : ""}</>}
                    </>
                  </strong>
                </span>
              ))}
            </div>
          </div>
          <Divider />
          <div style={{ height: "100%", maxHeight: 500 }}>
            <div style={{ height: "500px", overflow: 'hidden' }}>
              <TableContainer>
                <TableRow style={{ background: '#DCDCDC', borderRadius: '8px 8px 0px 0px' }}>
                  {columns.map((column, i) => (
                    <TableData style={{
                      textAlign: centerContent(column.value) ? "center" : "left",
                      justifyContent: centerContent(column.value) ? "center" : "flex-start", width: 150, maxWidth: 150
                    }} key={`header-column-${i}`}>{column.label}</TableData>
                  ))}
                </TableRow>
                {products === null ? (
                  <CircularLoading />
                ) : (<div className="customScroll">
                  {(products && products.length > 0) && products.map((prod, index) => (
                    <TableRow key={`row-${index}`} style={{
                      borderRadius: index === products.length - 1 ? '0px 0px 8px 8px' : '0px',
                      borderBottom: index === products.length - 1 ? '0px' : '1px solid #d3D3D3',
                      background: index & 2 === 0 ? "#ebebeb" : "#F5f5f5"
                    }}>
                      {columns.map((column, i) => {
                        return (
                          <TableData key={`row-${index}-${i}`} 
                          style={{ 
                            textAlign: centerContent(column.value) ? "center" : "left", 
                            justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                            width: 150, maxWidth: 150, 
                            overflow: 'hidden' 
                            }}>
                            <TooltipAndEllipsis centerText={centerContent(column.value)} item={TableRenderUI(column.value, prod[column.value])} />
                          </TableData>
                        );
                      })}
                    </TableRow>
                  ))}
                </div>
                )}
              </TableContainer>
            </div>

          </div>
          <div style={{ width: "100%", display: "flex", alignItems: 'center', justifyContent: 'flex-end' }}>
            <TextField style={{ width: 150 }} disabled value={TableRenderUI("subTotal", supply.totalValue)} variant="outlined" label="Total" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
