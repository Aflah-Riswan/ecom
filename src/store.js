import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/productSlice'
import cartReducer from './features/cartSlice'
// Import all the listeners
import { 
  addProductListener, 
  orderListener,
  deleteProductListener,
  updateProductListener
} from './features/middleware/addProductsDb'

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer
  },
  // Chain all the middleware listeners
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .prepend(addProductListener.middleware)
    .prepend(orderListener.middleware)
    .prepend(deleteProductListener.middleware) // Add delete listener
    .prepend(updateProductListener.middleware) // Add update listener
})