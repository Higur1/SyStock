import { Add, Close, Save } from '@mui/icons-material';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material';
import React, { useState } from 'react'
import styled from 'styled-components'
import { TableContainer, TableData, TableRow } from '../styles';
import TableRenderUI from '../../../utils/TableRenderUI';
import TooltipAndEllipsis from '../../../components/dialogs/ComponentUtils/ToolTipAndEllipsis';
import { centerContent } from '../../../utils/utils';

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  gap: 16px;
  flex-direction: column;
  align-items: center;
`;

export const ContainerTitle = styled(DialogTitle)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

export const ContainerFilters = styled.div`
display: grid;
width: 100%;
height: 100%; 
grid-template:
  "category product product" 48px
  ". quantity add" 48px
  / calc(25% - 16px) calc(55% - 16px) calc(20% - 16px);
  gap: 16px;
`;

const columns = [
  { fixedWidth: true, label: "Produto", value: "product", width: 150 },
  { fixedWidth: true, label: "Quantidade", value: "quantity", width: 150 },
  { fixedWidth: true, label: "Preço Unitário", value: "price", width: 150 },
  { fixedWidth: true, label: "SubTotal", value: "subtotal", width: 200 },
  { fixedWidth: true, label: "Funções", value: "functions", width: 100 },
];

export default function EditSell() {

  const [editSellList, setEditSellList] = useState([]);
  return (
    <>
      <Dialog open fullWidth maxWidth="md">
        <ContainerTitle>
          <TextField
            label="Birthday"
            type="date"
            defaultValue="2017-05-24"
            size='small'
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: "1.5rem" }}>{"Editar Venda"}</div>
          <IconButton><Close /></IconButton>
        </ContainerTitle>
        <Divider />
        <DialogContent>
          <Container>
            <ContainerFilters>
              <FormControl style={{ gridArea: "category", height: "100%" }}>
                <Select
                  value={""}
                  onChange={() => { }}
                  displayEmpty
                  size='small'
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <Autocomplete
                multiple
                id="combo-box-category"
                options={[]}
                freeSolo
                value={""}
                size='small'
                style={{ gridArea: "product", height: "100%" }}
                onChange={() => { }}
                sx={{ width: '100%', margin: 0 }}
                renderInput={(params) => <TextField {...params} label="Categoria" />}
              />
              <TextField type='number' label="Quantidade" size='small' style={{ gridArea: "quantity", height: "100%" }} />
              <Button variant='contained' startIcon={<Add />} size='small' style={{ gridArea: "add", height: "100%" }}>Adicionar</Button>
            </ContainerFilters>
            <div style={{ flex: 1, minHeight: 400, position: 'relative' }}>
              <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <TableRow>
                    {columns.map((column, i) => (
                      <TableData
                        key={`header-${i}`}
                        style={{
                          textAlign: centerContent(column.value) ? "center" : "left", 
                          justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                          width: column.width,
                          maxWidth: column.fixedWidth ? column.width : "auto",
                          flex: column.fixedWidth ? "none" : "1"
                        }}
                      >
                        {column.label}
                      </TableData>
                    ))}
                  </TableRow>
                  <div className="customScroll">
                    {editSellList.map((log, index) => (
                      <TableRow key={index}>
                        {columns.map((column, i) => {
                          return (
                            <TableData
                              key={`row-${index}-${i}`}
                              style={{
                                textAlign: centerContent(column.value) ? "center" : "left", 
                                justifyContent: centerContent(column.value) ? "center" : "flex-start", 
                                width: column.width,
                                maxWidth: column.fixedWidth ? column.width : "auto",
                                flex: column.fixedWidth ? "none" : "1",
                                overflow: 'hidden'
                              }}
                            >
                              <TooltipAndEllipsis centerText={centerContent(column.value)} item={TableRenderUI(column.value, log[column.value])} />
                            </TableData>
                          );
                        })}
                      </TableRow>
                    ))}
                  </div>
                </TableContainer>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, position: 'absolute', right: 16, bottom: -48 }}>
                <span>Total:</span>
                <strong>{"R$280.00"}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', width: "100%", gap: 16 }}>
              <FormControl>
                <Select
                  value={""}
                  onChange={() => { }}
                  displayEmpty
                  size='small'
                  label="Forma de Pagamento"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={10}>Ten</MenuItem>
                  <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem>
                </Select>
              </FormControl>
              <TextField
                id="outlined-multiline-static"
                label="Observação"
                multiline
                rows={4}
                variant="outlined"
              />
            </div>
          </Container>
        </DialogContent>
        <DialogActions style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: "16px 32px" }}>
          <Button startIcon={<Close />} variant='contained'>Cancelar</Button>
          <Button startIcon={<Save />} variant='contained'>Salvar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
