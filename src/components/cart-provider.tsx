"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  status: string; // Added status to distinguish Ready vs Made to Order
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: Product, quantity?: number, size?: string, status?: string) => void;
  removeItem: (itemId: string, size?: string, status?: string) => void;
  increaseQuantity: (itemId: string, size?: string, status?: string) => void;
  decreaseQuantity: (itemId: string, size?: string, status?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isCartLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
        localStorage.removeItem('cart');
    } finally {
        setIsCartLoaded(true);
    }
  }, []);

  useEffect(() => {
      if (isCartLoaded) {
          localStorage.setItem('cart', JSON.stringify(cart));
      }
  }, [cart, isCartLoaded]);

  // --- FIXED: Use functional state update to prevent race conditions ---
  const addItem = (item: Product, quantity: number = 1, size?: string, status?: string) => {
    setCart((prevCart) => {
        // Default status to product availability if not provided
        const itemStatus = status || item.availability || 'READY TO SHIP';

        const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.size === size && cartItem.status === itemStatus
        );

        let newCart;
        if (existingItemIndex > -1) {
            newCart = [...prevCart];
            newCart[existingItemIndex] = {
                ...newCart[existingItemIndex],
                quantity: newCart[existingItemIndex].quantity + quantity
            };
        } else {
            newCart = [...prevCart, { ...item, quantity, size, status: itemStatus }];
        }
        return newCart;
    });
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string, size?: string, status?: string) => {
    setCart((prevCart) => prevCart.filter(
      (item) => !(item.id === itemId && item.size === size && item.status === status)
    ));
  };
  
  const increaseQuantity = (itemId: string, size?: string, status?: string) => {
    setCart((prevCart) => prevCart.map((item) =>
      item.id === itemId && item.size === size && item.status === status 
      ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decreaseQuantity = (itemId: string, size?: string, status?: string) => {
    setCart((prevCart) => prevCart
      .map((item) =>
        item.id === itemId && item.size === size && item.status === status
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      )
      .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ 
          cart, 
          addItem, 
          removeItem, 
          clearCart, 
          cartCount, 
          cartTotal, 
          increaseQuantity, 
          decreaseQuantity, 
          isCartOpen, 
          setIsCartOpen,
          isCartLoaded
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};