import { createContext, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    const existingItem = cart.find(
      (cartItem) => cartItem.name === item.name
    );

    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.name === item.name
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1
              }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...item,
          quantity: 1
        }
      ]);
    }
  }

  function increaseQuantity(name) {
    setCart(
      cart.map((item) =>
        item.name === name
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );
  }

  function decreaseQuantity(name) {
    setCart(
      cart.map((item) =>
        item.name === name && item.quantity > 1
          ? {
              ...item,
              quantity: item.quantity - 1
            }
          : item
      )
    );
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;