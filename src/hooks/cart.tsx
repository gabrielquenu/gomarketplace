import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const listOfProducts: Product[] = [];
      const listOfProductsKeys = await AsyncStorage.getAllKeys();
      const listOfProductsStringfied = await AsyncStorage.multiGet(
        listOfProductsKeys,
      );

      if (listOfProductsStringfied.length !== 0) {
        listOfProducts.push(
          ...listOfProductsStringfied.map(object =>
            JSON.parse(object[1] || '{}'),
          ),
        );
      }
      setProducts([...listOfProducts]);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    const productStringfied = await AsyncStorage.getItem(product.id);

    if (productStringfied === null) {
      const newProduct = product;
      newProduct.quantity = 1;
      await AsyncStorage.setItem(newProduct.id, JSON.stringify(newProduct));

      const listOfProducts: Product[] = [];
      const listOfProductsKeys = await AsyncStorage.getAllKeys();
      const listOfProductsStringfied = await AsyncStorage.multiGet(
        listOfProductsKeys,
      );

      if (listOfProductsStringfied.length !== 0) {
        listOfProducts.push(
          ...listOfProductsStringfied.map(object =>
            JSON.parse(object[1] || '{}'),
          ),
        );
      }

      setProducts([...listOfProducts]);
    } else {
      const productIncrement = JSON.parse(productStringfied);
      productIncrement.quantity += 1;
      await AsyncStorage.setItem(
        productIncrement.id,
        JSON.stringify(productIncrement),
      );
      const listOfProducts: Product[] = [];
      const listOfProductsKeys = await AsyncStorage.getAllKeys();
      const listOfProductsStringfied = await AsyncStorage.multiGet(
        listOfProductsKeys,
      );

      if (listOfProductsStringfied.length !== 0) {
        listOfProducts.push(
          ...listOfProductsStringfied.map(object =>
            JSON.parse(object[1] || '{}'),
          ),
        );
      }

      setProducts([...listOfProducts]);
    }
  }, []);

  const increment = useCallback(async id => {
    const productStringfied = await AsyncStorage.getItem(id);
    const product = JSON.parse(productStringfied);

    product.quantity += 1;
    await AsyncStorage.setItem(id, JSON.stringify(product));

    const listOfProducts: Product[] = [];
    const listOfProductsKeys = await AsyncStorage.getAllKeys();
    const listOfProductsStringfied = await AsyncStorage.multiGet(
      listOfProductsKeys,
    );

    if (listOfProductsStringfied.length !== 0) {
      listOfProducts.push(
        ...listOfProductsStringfied.map(object =>
          JSON.parse(object[1] || '{}'),
        ),
      );
    }

    setProducts([...listOfProducts]);
  }, []);

  const decrement = useCallback(async id => {
    const productStringfied = await AsyncStorage.getItem(id);
    const product = JSON.parse(productStringfied);

    if (!productStringfied) return;

    product.quantity -= 1;

    if (product.quantity < 1) {
      await AsyncStorage.removeItem(id);

      const listOfProducts: Product[] = [];
      const listOfProductsKeys = await AsyncStorage.getAllKeys();
      const listOfProductsStringfied = await AsyncStorage.multiGet(
        listOfProductsKeys,
      );

      if (listOfProductsStringfied.length !== 0) {
        listOfProducts.push(
          ...listOfProductsStringfied.map(object =>
            JSON.parse(object[1] || '{}'),
          ),
        );
      }

      setProducts([...listOfProducts]);
    } else {
      await AsyncStorage.setItem(product.id, JSON.stringify(product));

      const listOfProducts: Product[] = [];
      const listOfProductsKeys = await AsyncStorage.getAllKeys();
      const listOfProductsStringfied = await AsyncStorage.multiGet(
        listOfProductsKeys,
      );

      if (listOfProductsStringfied.length !== 0) {
        listOfProducts.push(
          ...listOfProductsStringfied.map(object =>
            JSON.parse(object[1] || '{}'),
          ),
        );
      }

      setProducts([...listOfProducts]);
    }
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
