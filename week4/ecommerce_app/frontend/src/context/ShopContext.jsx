import { createContext, useState, useEffect } from 'react';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('ecom_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedCart = localStorage.getItem('ecom_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('ecom_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecom_user');
  };

  const addToCart = (product) => {
    const exist = cart.find(x => x._id === product._id);
    let updatedCart;
    if (exist) {
      updatedCart = cart.map(x => x._id === product._id ? { ...exist, qty: exist.qty + 1 } : x);
    } else {
      updatedCart = [...cart, { ...product, qty: 1 }];
    }
    setCart(updatedCart);
    localStorage.setItem('ecom_cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (id) => {
    const updatedCart = cart.filter(x => x._id !== id);
    setCart(updatedCart);
    localStorage.setItem('ecom_cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ecom_cart');
  };

  return (
    <ShopContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </ShopContext.Provider>
  );
};
