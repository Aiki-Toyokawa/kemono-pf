'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  emoji?: string;
}

const CART_KEY = 'kemonopf_cart';

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const addItem = useCallback((item: CartItem) => {
    const current = loadCart();
    if (current.some((i) => i.productId === item.productId)) return;
    const next = [...current, item];
    saveCart(next);
    setItems(next);
  }, []);

  const removeItem = useCallback((productId: string) => {
    const next = loadCart().filter((i) => i.productId !== productId);
    saveCart(next);
    setItems(next);
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
    setItems([]);
  }, []);

  return { items, count: items.length, addItem, removeItem, clearCart };
}
