import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      
      addToCart: (service, qty) => set((state) => {
        // Cek apakah service sudah ada di keranjang
        const existingItem = state.cartItems.find(item => item.id === service.id);
        
        if (existingItem) {
          // Jika ada, tambahkan qty nya
          return {
            cartItems: state.cartItems.map(item => 
              item.id === service.id 
                ? { ...item, qty: Number(item.qty) + Number(qty) }
                : item
            )
          };
        }
        
        // Jika belum ada, masukkan sebagai item baru
        return {
          cartItems: [...state.cartItems, { ...service, qty: Number(qty) }]
        };
      }),
      
      removeFromCart: (serviceId) => set((state) => ({
        cartItems: state.cartItems.filter(item => item.id !== serviceId)
      })),
      
      clearCart: () => set({ cartItems: [] }),
      
      // Getter untuk total item dan total harga
      getTotalItems: () => get().cartItems.reduce((total, item) => total + item.qty, 0),
      getTotalPrice: () => get().cartItems.reduce((total, item) => total + (item.price * item.qty), 0)
    }),
    {
      name: 'snowwash-cart', // nama key di localStorage
    }
  )
)

export default useCartStore
