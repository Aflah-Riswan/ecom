import { createListenerMiddleware } from "@reduxjs/toolkit";
import { 
  addProducts, addProductSuccess, 
  placeOrder,
  deleteProduct, deleteProductSuccess, // Import delete actions
  updateProduct, updateProductSuccess  // Import update actions
} from "../productSlice";
import { addDoc, collection, doc, updateDoc, deleteDoc } from "firebase/firestore"; // Import deleteDoc
import { db } from "../../../firebase";

const addProductListener = createListenerMiddleware()
const orderListener = createListenerMiddleware()
const deleteProductListener = createListenerMiddleware() // New listener
const updateProductListener = createListenerMiddleware() // New listener

// --- ADD PRODUCT LISTENER (No changes) ---
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

// --- ORDER LISTENER (No changes) ---
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

// --- (NEW) DELETE PRODUCT LISTENER ---
deleteProductListener.startListening({
  actionCreator: deleteProduct,
  effect: async (action, apiListener) => {
    const productId = action.payload; // Payload is just the ID
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef); // Delete the document from Firebase
      console.log("✅ Product deleted from Firestore!");
      apiListener.dispatch(deleteProductSuccess(productId)); // Dispatch success to Redux
    } catch (err) {
      console.error("❌ Failed to delete product:", err);
    }
  },
});

// --- (NEW) UPDATE PRODUCT LISTENER ---
updateProductListener.startListening({
  actionCreator: updateProduct,
  effect: async (action, apiListener) => {
    const productToUpdate = action.payload; // Payload is the whole updated product object
    try {
      const { id, ...productData } = productToUpdate; // Separate the ID from the rest of the data
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, productData); // Update Firebase with the new data
      console.log("✅ Product updated in Firestore!");
      apiListener.dispatch(updateProductSuccess(productToUpdate)); // Dispatch success to Redux
    } catch (err) {
      console.error("❌ Failed to update product:", err);
    }
  },
});


export { 
  addProductListener,
  orderListener,
  deleteProductListener, // Export new listener
  updateProductListener  // Export new listener
}