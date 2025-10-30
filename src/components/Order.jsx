import { useEffect, useMemo } from "react" // 1. Import useMemo
import { useDispatch, useSelector } from "react-redux"
import { cartDetails, clearUserCart } from "../features/cartSlice" 
import { placeOrder } from "../features/productSlice"
import { useNavigate } from "react-router-dom"; 
import { auth } from "../../firebase"; 

export default function Order() {
  const currentUser = auth.currentUser; 
  
  const allCartItems = useSelector((state) => state.cart.items)
  
  // 2. Wrap the cartItems filter in useMemo
  const cartItems = useMemo(() => {
    return allCartItems.filter(item => item.shopperId === currentUser?.uid);
  }, [allCartItems, currentUser]); // Dependencies
  
  const cartSummary = useSelector((state) => state.cart.details)
  const dispatch = useDispatch()
  const navigate = useNavigate(); 

  useEffect(() => {
    // 3. This is now safe and will not cause a loop
    if (currentUser) {
      dispatch(cartDetails(currentUser.uid))
    }
  }, [dispatch, cartItems, currentUser]) 

  const handleConfirmOrder = () => {
    dispatch(placeOrder(cartItems)); 
    dispatch(clearUserCart(currentUser.uid));           
    alert("Order confirmed successfully!"); 
    navigate('/');                   
  }

  return (
    
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
          Confirm Your Order
        </h1>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
            <h2 className="text-2xl font-semibold text-gray-900 p-6 border-b border-gray-200">
              Items in Your Order
            </h2>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((cart) => (
                <li key={cart.id} className="flex items-center p-4 sm:p-6">
                  <img
                    src={cart.imageUrl}
                    alt={cart.name}
                    className="w-20 h-20 rounded-lg object-cover mr-4"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-semibold text-gray-900 truncate">
                      {cart.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Quantity: {cart.count}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 ml-4">
                    ${(cart.price * cart.count).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">
                Order Summary
              </h2>
              
              
              <div className="flex justify-between items-center text-gray-600 mb-2">
                <p>Total Items:</p>
                <p className="font-semibold">{cartSummary.totalProducts}</p>
              </div>
              
              
              <hr className="my-4" />
              
              
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 mb-6">
                <p>Total Price:</p>
                <p>${cartSummary.totalPrice?.toLocaleString()}</p>
              </div>

              
              <button onClick={handleConfirmOrder} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}