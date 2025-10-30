import { createUserWithEmailAndPassword } from 'firebase/auth'
import React from 'react' // Removed unused useState
import { auth } from '../../firebase'
import { Link, useNavigate } from 'react-router-dom' // Added Link import
import { useForm } from 'react-hook-form'

const Signup = () => {
  const { register, handleSubmit } = useForm('')
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const { name, email, password } = data
    try {
      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredentials.user
      // Fixed: Show user email or name
      alert("successfully account created for: " + (user.email || name))
      navigate('/')
    } catch (e) {
      alert("found error : " + e.message) // Fixed: Use e.message
      console.log(e)
    }
  }

  return (
    // Full-screen container
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      
      {/* Signup Card */}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Your Account
        </h1>

        {/* Form with spacing */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Name Input Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input 
              id="name"
              type="text" 
              placeholder='enter your name ' 
              {...register('name', { required: true })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email Input Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input 
              id="email"
              type="email" 
              placeholder='enter your email'
              {...register('email', { required: true })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Input Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input 
              id="password"
              type="password" 
              placeholder='password' 
              {...register('password', { required: true })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button 
            type='submit'
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Create Account
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to={'/login'} className="font-medium text-blue-600 hover:text-blue-700">
              Log In
            </Link>
          </div>

        </form>
      </div>
    </div>
  )
}

export default Signup