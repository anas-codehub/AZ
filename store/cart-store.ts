// store/cart-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // প্রোডাক্ট আইডি
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string, color: string) => void;
  updateQuantity: (id: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const currentItems = get().items;
        // চেক করুন একই প্রোডাক্ট, সাইজ ও কালার আগে থেকে আছে কি না
        const existingItem = currentItems.find(
          (item) =>
            item.id === newItem.id &&
            item.size === newItem.size &&
            item.color === newItem.color
        );

        if (existingItem) {
          // থাকলে শুধু পরিমাণ বাড়ান
          set({
            items: currentItems.map((item) =>
              item.id === newItem.id &&
              item.size === newItem.size &&
              item.color === newItem.color
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          // না থাকলে নতুন আইটেম হিসেবে যোগ করুন
          set({ items: [...currentItems, newItem] });
        }
      },

      removeItem: (id, size, color) => {
        set({
          items: get().items.filter(
            (item) =>
              !(item.id === id && item.size === size && item.color === color)
          ),
        });
      },

      updateQuantity: (id, size, color, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size, color);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "luxe-cart-storage", // LocalStorage-এ সেভ হবে
    }
  )
);