import React, { useEffect, useMemo } from 'react' 
import { useDispatch, useSelector } from 'react-redux'
import { addCount, cartDetails, decreaseCount, removeCartItem } from '../features/cartSlice'
import { Link } from 'react-router-dom'
// 1. Removed unmarkCart and toggleCartStatus
import { auth } from '../../firebase' 

const Cart = () => {
    const allCartItems = useSelector((state) => state.cart.items)
    const currentUser = auth.currentUser; 
    
    const cartItems = useMemo(() => {
        return allCartItems.filter(item => item.shopperId === currentUser?.uid)
    }, [allCartItems, currentUser]); 
    
    const cartSummary = useSelector((state)=> state.cart.details)
    const dispatch = useDispatch()

    useEffect(() => {
        if (currentUser) {
          dispatch(cartDetails(currentUser.uid))
        }
    }, [dispatch, cartItems, currentUser]) 

    
    const handleRemoveItem = (cartProduct) => {
      
      dispatch(removeCartItem(cartProduct));
     
    }

    
    if (cartItems.length === 0) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
          <div className="text-center bg-white p-12 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link 
              to="/"
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 hover:bg-blue-700"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
              Your Shopping Cart
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
                <h2 className="text-2xl font-semibold text-gray-900 p-6 border-b border-gray-200">
                  Cart Items ({cartSummary.totalProducts})
                </h2>
                <ul className="divide-y divide-gray-200">
                  {cartItems.map((cart) => (
                    <li key={cart.id} className="flex flex-col sm:flex-row items-center p-4 sm:p-6">
                      <img
                        src={cart.imageUrl}
                        alt={cart.name}
                        className="w-32 h-32 rounded-lg object-cover mr-0 sm:mr-6 mb-4 sm:mb-0"
                      />
                      <div className="flex-1 min-w-0 text-center sm:text-left">
                        <p className="text-lg font-semibold text-gray-900 truncate">
                          {cart.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${cart.price.toLocaleString()} each
                        </p>
                      </div>
                      <div className="flex items-center my-4 sm:my-0 sm:mx-6">
                        <button 
                          onClick={() => {
                            if (cart.count > 1) dispatch(decreaseCount(cart))
                          }}
                          className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full font-bold text-lg flex items-center justify-center transition hover:bg-gray-300 disabled:opacity-50"
                          disabled={cart.count <= 1}
                        >
                          -
                        </button>
                        <p className="w-12 text-center text-lg font-semibold text-gray-800">
                          {cart.count}
                        </p>
                        <button 
                          onClick={() => dispatch(addCount(cart))}
                          className="w-10 h-10 bg-gray-200 text-gray-700 rounded-full font-bold text-lg flex items-center justify-center transition hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-col items-center sm:items-end ml-0 sm:ml-4">
                        <p className="text-lg font-semibold text-gray-800 mb-2">
                          ${(cart.price * cart.count).toLocaleString()}
                        </p>
                        
                        <button 
                          onClick={() => handleRemoveItem(cart)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
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
                  <Link 
                    to={'/order'} 
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-center block"
                  >
                    Proceed to Check Out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default Cart