import { createSlice } from "@reduxjs/toolkit";

const savedItems = JSON.parse(localStorage.getItem("cartItems")) || [];

const initialState = {
  items: savedItems, // This array now holds cart items for ALL users
  status: null,
  error: null,
  details: { totalProducts: 0, totalPrice: 0 }
};
const cartSlice = createSlice({
  name: 'cart-items',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // 1. Get the product and the shopper's ID from the payload
      const { product, shopperId } = action.payload;
      
      // 2. Create a new cart item that includes the shopper's ID
      const cartProduct = { ...product, isCarted: true, count: 1, shopperId: shopperId };
      
      state.items.push(cartProduct);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeCartItem: (state, action) => {
      // This logic doesn't need to change, it removes based on product.id
      const removeCart = { ...action.payload, isCarted: false };
      state.items = state.items.filter((product) => product.id !== removeCart.id);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    addCount: (state, action) => {
      // This logic is fine, as ...action.payload preserves the shopperId
      const currentCount = action.payload.count
      const product = { ...action.payload, count: currentCount + 1 }
      state.items = state.items.filter((p) => p.id !== product.id)
      state.items.push(product)
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    decreaseCount: (state, action) => {
      // This logic is fine, as ...action.payload preserves the shopperId
      const currentCount = action.payload.count
      const product = { ...action.payload, count: currentCount - 1 }
      state.items = state.items.filter((p) => p.id !== product.id)
      state.items.push(product)
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    cartDetails: (state, action) => {
      // 3. This action now requires a shopperId to know WHO to calculate for
      const shopperId = action.payload;
      let totalPrice = 0;
      let productCount = 0;

      // 4. Filter for only the current user's items BEFORE calculating
      const userCartItems = state.items.filter(item => item.shopperId === shopperId);

      userCartItems.forEach((product) => {
        productCount += Number(product.count)
        totalPrice += Number(product.price) * Number(product.count)
      })
      state.details = {
        totalProducts: productCount,
        totalPrice
      }
    },
    // 5. Renamed clearCart to clearUserCart
    clearUserCart: (state, action) => {
      // 6. This action now requires a shopperId
      const shopperId = action.payload;

      // 7. Filter out the user's items, but KEEP everyone else's
      state.items = state.items.filter(item => item.shopperId !== shopperId);
      
      state.details = { totalProducts: 0, totalPrice: 0 };
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    }
  },
})
// 8. Export the renamed action
export const { addToCart, removeCartItem, addCount, decreaseCount, cartDetails, clearUserCart } = cartSlice.actions
export default cartSlice.reducer