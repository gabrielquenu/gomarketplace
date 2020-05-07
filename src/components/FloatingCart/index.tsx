import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const totalValueArray = products.map(
      product => product.price * product.quantity,
    );

    if (totalValueArray.length === 0) return formatValue(0);

    const totalValueCart = totalValueArray.reduce(
      (acumulator, currentValue) => acumulator + currentValue,
    );
    return formatValue(totalValueCart);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const totalQuantityArray = products.map(product => product.quantity);

    if (totalQuantityArray.length === 0) return 0;

    const totalQuantityCart = totalQuantityArray.reduce(
      (acumulator, currentValue) => acumulator + currentValue,
    );
    return totalQuantityCart;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
