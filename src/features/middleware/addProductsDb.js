import { createListenerMiddleware } from "@reduxjs/toolkit";
import { 
  addProducts, addProductSuccess, 
  placeOrder,
  deleteProduct, deleteProductSuccess, 
  updateProduct, updateProductSuccess  
} from "../productSlice";
import { addDoc, collection, doc, updateDoc, deleteDoc } from "firebase/firestore"; 
import { db } from "../../../firebase";

const addProductListener = createListenerMiddleware()
const orderListener = createListenerMiddleware()
const deleteProductListener = createListenerMiddleware() 
const updateProductListener = createListenerMiddleware() 


addProductListener.startListening({
  actionCreator: addProducts, 
  effect: async (action, apiListener) => { 
    const product = action.payload
    try {
      const docRef = await addDoc(collection(db, 'products'), product)
      console.log(" saved firebase with ID: ", docRef.id)
      apiListener.dispatch(addProductSuccess({ ...product, id: docRef.id }));
    } catch (e) {
      console.log(e)
    }
  }
})


orderListener.startListening({
  actionCreator: placeOrder,
  effect: async (action, listenerApi) => {
    const orderedProducts = action.payload; 
    try {
      for (const product of orderedProducts) {
        const productRef = doc(db, "products", product.id);
        await updateDoc(productRef, { isOrdered: true });
      }
      console.log("✅ All ordered products updated in Firestore!");
    } catch (err) {
      console.error("❌ Failed to update ordered products:", err);
    }
  },
});


deleteProductListener.startListening({
  actionCreator: deleteProduct,
  effect: async (action, apiListener) => {
    const productId = action.payload; 
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
      console.log("✅ Product deleted from Firestore!");
      apiListener.dispatch(deleteProductSuccess(productId)); 
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
    }
  },
});


updateProductListener.startListening({
  actionCreator: updateProduct,
  effect: async (action, apiListener) => {
    const productToUpdate = action.payload; 
    try {
      const { id, ...productData } = productToUpdate; 
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, productData); 
      console.log("✅ Product updated in Firestore!");
      apiListener.dispatch(updateProductSuccess(productToUpdate)); 
    } catch (err) {
      console.error("❌ Failed to update product:", err);
    }
  },
});


export { 
  addProductListener,
  orderListener,
  deleteProductListener, 
  updateProductListener  
}
