import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deepCopy } from "../utils/utils";
import { getProducts } from "../redux/actions/productsActions";

export default function useCategory() {
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();
  const productsRedux = useSelector(state => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  useEffect(() => {
    if(productsRedux.items.length === 0) return;

    const newProducts = deepCopy(productsRedux.items);
    setProducts(newProducts);
  }, [productsRedux.items]);

  return {
    products, setProducts
  }
}