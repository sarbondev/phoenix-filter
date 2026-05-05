import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '@/shared/types';

interface CartItemState {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItemState[];
}

function loadCart(): CartItemState[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function saveCart(items: CartItemState[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initCart(state) {
      state.items = loadCart();
    },
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find((i) => i.product.id === action.payload.id);
      const stock = action.payload.stock ?? Infinity;
      if (existing) {
        existing.quantity = Math.min(existing.quantity + 1, stock);
      } else if (stock > 0) {
        state.items.push({ product: action.payload, quantity: 1 });
      }
      saveCart(state.items);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.product.id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find((i) => i.product.id === action.payload.id);
      if (item) {
        const stock = item.product.stock ?? Infinity;
        // Clamp [1, stock] — explicit removal goes through removeFromCart.
        item.quantity = Math.max(1, Math.min(action.payload.quantity, stock));
      }
      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCart(state.items);
    },
  },
});

export const { initCart, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
