import { useEffect, useState } from "react";

export default function useCategory() {
  const [products, setProducts] = useState([
    {id: 0, label: 'Garrafa', quantity: '4235', category: null},
  ]);

  return {
    products, setProducts
  }
}