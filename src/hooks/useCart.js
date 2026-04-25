import { useState, useEffect } from 'react';

const CART_KEY = 'theplug_cart';

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  function addItem(product) {
    setItems(prev => {
      if (prev.find(i => i.id === product.id)) return prev;
      return [...prev, product];
    });
  }

  function removeItem(productId) {
    setItems(prev => prev.filter(i => i.id !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + Number(i.sale_price), 0);

  return { items, addItem, removeItem, clearCart, total };
}
