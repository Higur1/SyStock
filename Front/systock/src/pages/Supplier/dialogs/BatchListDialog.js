import React, { useEffect, useRef, useState } from 'react'
import { performFetch } from '../../../apiBase';

function BatchListDialog(props) {

  const { id } = props;

  console.log(id);

  const [batchs, setBatchs] = useState([]);

  const isMount = useRef();

  useEffect(() => {
    if(isMount.current) return;
    
    isMount.current = true;
    getBatchs();
  }, []);

  async function getBatchs() {
    try {
      const obj = await performFetch(`/supplier/batchs/${id}`, {method: 'GET'});
      const batchs = obj;
      setBatchs(batchs);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div>h</div>
  )
}

export default BatchListDialog