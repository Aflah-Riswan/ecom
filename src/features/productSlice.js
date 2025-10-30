import { createSlice } from "@reduxjs/toolkit";
import getDataFromDb from './middleware/getDataFromDb'

const initialState = {
  products: [],
  status: 'idle', 
  error: null
}
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // --- ADD PRODUCT ---
    addProducts: (state, action) => {
      state.status = 'loading';
    },
    addProductSuccess: (state, action) => {
      state.products.push(action.payload);
      state.status = 'fulfilled';
    },

    // --- DELETE PRODUCT ---
    deleteProduct: (state, action) => {
      state.status = 'loading';
    },
    deleteProductSuccess: (state, action) => {
      const productId = action.payload;
      state.products = state.products.filter((product) => product.id !== productId);
      state.status = 'fulfilled';
    },

    // --- UPDATE PRODUCT ---
    updateProduct: (state, action) => {
      state.status = 'loading';
    },
    updateProductSuccess: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      state.status = 'fulfilled';
    },

    // --- (DELETED) markCart and unmarkCart are GONE ---

    // --- ORDER LOGIC (This is correct) ---
    placeOrder: ( state , action ) => {
     const orderedProductsId=action.payload.map(product => product.id)
     state.products=state.products.map((product)=> {
      if(orderedProductsId.includes(product.id)){
         return {...product,isOrdered:true}
       }else{
        return product
       }
     })
      
    }

  },
  extraReducers: (builder) => {
    // ... (no change here)
    builder
      .addCase(getDataFromDb.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getDataFromDb.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        if (action.payload) state.products = action.payload
      })
      .addCase(getDataFromDb.rejected, (state, action) => {
        state.status = 'rejected'
        state.error = action.payload
      })
  }
})

// 1. REMOVED markCart and unmarkCart from the export
export const { 
  addProducts, addProductSuccess, 
  deleteProduct, deleteProductSuccess,
  updateProduct, updateProductSuccess,
  placeOrder 
} = productSlice.actions

export default productSlice.reducer