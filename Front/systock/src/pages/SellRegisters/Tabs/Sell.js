import { Add, Clear, Save } from '@mui/icons-material';
import { Autocomplete, Button, FormControl, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react'
import styled from 'styled-components'
import { TableContainer, TableData, TableRow } from '../styles';

const Container = styled("div")({
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  width: "100%",
  height: "100%",
});

const GridContainer = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template:
    "category product product quantity quantity quantity add" 48px
    "table table table table table table table" 1fr
    "payment payment obs obs . . ." 120px
    / calc(15% - 16px) calc(5% - 16px) 1fr calc(5% - 16px) calc(15% - 16px) calc(2% - 16px) calc(20% - 16px);
  flex: 1;
  gap: 16px;
  justify-content: center;
`;

const columns = [
  { fixedWidth: true, label: "Produto", value: "product", width: 150 },
  { fixedWidth: true, label: "Quantidade", value: "quantity", width: 150 },
  { fixedWidth: true, label: "Preço Unitário", value: "price", width: 150 },
  { fixedWidth: true, label: "SubTotal", value: "subtotal", width: 200 },
  { fixedWidth: true, label: "Funções", value: "functions", width: 100 },
];

export default function Sell() {

  const [addSellList, setAddSellList] = useState([]);
  return (
    <Container>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, flexBasis: 48, fontSize: "1.5rem" }}>
        {"Editar Venda"}
      </div>
      <GridContainer>
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
        <div style={{ position: 'relative', gridArea: "table" }}>
          <div style={{ display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}>
            <TableContainer>
              <TableRow>
                {columns.map((column, i) => (
                  <TableData
                    key={`header-${i}`}
                    style={{
                      justifyContent: column.fixedWidth ? "center" : "left",
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
                {addSellList.map((log, index) => (
                  <TableRow key={index}>
                    {columns.map((column, i) => {
                      return (
                        <TableData
                          key={`row-${index}-${i}`}
                          style={{
                            justifyContent: column.fixedWidth ? "center" : "left",
                            width: column.width,
                            maxWidth: column.fixedWidth ? column.width : "auto",
                            flex: column.fixedWidth ? "none" : "1"
                          }}
                        >
                          {log[column.value]}
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
        <FormControl style={{ gridArea: "payment" }}>
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
          style={{ gridArea: "obs" }}
          variant="outlined"
        />
      </GridContainer>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        <Button startIcon={<Clear />} variant='contained'>Limpar</Button>
        <Button startIcon={<Save />} variant='contained'>Salvar</Button>
      </div>
    </Container>
  )
}
