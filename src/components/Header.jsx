import { signOut } from 'firebase/auth'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../../firebase'
import { useDispatch } from 'react-redux' 
import { clearUserCart } from '../features/cartSlice' // 1. Import clearUserCart

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch() 

  const handleSignout = async () => {
    // 2. Get the user ID *before* signing out
    const user = auth.currentUser;
    
    try {
      // 3. Pass the user's ID to clear *only* their cart
      if (user) {
        dispatch(clearUserCart(user.uid)) 
      }
      
      await signOut(auth)
      alert("logout successfully")
      navigate('/login')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    // ... (rest of your component is fine)
    <div className="w-full bg-white shadow-md p-4 flex items-center justify-between">
      <div className="text-2xl font-bold text-blue-600">
        <Link to={'/'}>MyEcom</Link> 
      </div>
      <nav className="flex items-center space-x-6">
        <Link 
          to={'/'} 
          className="text-gray-700 font-medium transition-colors duration-200 hover:text-blue-600"
        >
          Home
        </Link>
        <Link 
          to={'/cart'} 
          className="text-gray-700 font-medium transition-colors duration-200 hover:text-blue-600"
        >
          Cart
        </Link>
        <Link 
          to={'/add'} 
          className="text-gray-700 font-medium transition-colors duration-200 hover:text-blue-600"
        >
          Add Product
        </Link>
        <Link 
          to={'/myproducts'} 
          className="text-gray-700 font-medium transition-colors duration-200 hover:text-blue-600"
        >
          My Products
        </Link>
        <button 
          onClick={handleSignout} 
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Sign Out
        </button>
      </nav>
    </div>
  )
}

export default Header