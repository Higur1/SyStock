import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import styled from 'styled-components';
import VirtualizedTableCustom from '../../../components/VirtualizedTableCustom';
import BatchActions from '../../../Service/Batch/BatchActions';

const Title = styled('div')({
  fontSize: 24,
  fontWeight: 700
});

function BatchListDialog(props) {

  const { id } = props;

  console.log(id);

  const [batchs, setBatchs] = useState([
    {id: 0, productName: 'teste', createdAt: new Date(), updateAt: new Date(), quantity: 123, unitValue: 'R$12,00'},
    {id: 1, productName: 'teste 1', createdAt: new Date(), updateAt: new Date(), quantity: 123, unitValue: 'R$12,00'},
    {id: 2, productName: 'teste 2', createdAt: new Date(), updateAt: new Date(), quantity: 123, unitValue: 'R$12,00'},
    {id: 3, productName: 'teste 3', createdAt: new Date(), updateAt: new Date(), quantity: 123, unitValue: 'R$12,00'}
  ]);
  const [columns, setColumns] = useState([]);

  const isMount = useRef();

  useEffect(() => {
    if(isMount.current) return;
    
    isMount.current = true;
    getBatchs();
  }, []);

  useEffect(() => {
    if(!batchs.length) return;

    const columns = [
      {width: '20%', label: 'Data de criação', dataKey: 'createdAt', numeric: false},
      {width: '20%', label: 'Data de Alteração', dataKey: 'updateAt', numeric: false},
      {width: '30%', label: 'Nome do Produto', dataKey: 'productName', numeric: false},
      {width: '10%', label: 'Quantidade', dataKey: 'quantity', numeric: true},
      {width: '20%', label: 'Valor Unitário', dataKey: 'unitValue', numeric: false}
    ];

    setColumns(columns);
  }, [batchs]);

  async function getBatchs() {
    try {
      const batchs = await BatchActions.getAll();
      if(batchs.length === 0) return;
      setBatchs(batchs);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Dialog
      open
      maxWidth="md"
      fullWidth
    >
      <DialogTitle><Title>{"Lotes"}</Title></DialogTitle>
      <DialogContent>
        <VirtualizedTableCustom
          rows={batchs}
          columns={columns}
        />
      </DialogContent>
    </Dialog>
  )
}

export default BatchListDialog