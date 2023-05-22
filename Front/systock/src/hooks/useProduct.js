import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useCategory() {
  const [products, setProducts] = useState([
    {id: 0, label: 'Garrafa', quantity: '4235', category: null},
  ]);

  const dispatch = useDispatch();
  const productsRedux = useSelector(state => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  return {
    products, setProducts
  }
}