import { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from  './components/home'
import Login from './components/Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import Signup from './components/Signup'
import Header from './components/Header'
import Cart from './components/Cart'
import AddProducts from './components/AddProducts'
import Order from './components/Order'
import MyProducts from './components/MyProducts'

// 1. Import your new ErrorBoundary
import ErrorBoundary from './components/ErrorBoundary' 

function App() {

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         if(currentUser) {
          setUser(currentUser)
         } else {
          setUser(null)
         }
         setLoading(false);
    })
  return () => unsubscribe()
  },[])

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <BrowserRouter>
    
      {/* 2. Wrap your entire router (or just the Routes) in the ErrorBoundary */}
      <ErrorBoundary>
        {user && <Header/>}

        <Routes>
          {/* Protected Routes */}
          <Route path='/' element={user ? <Home /> : <Navigate to={'/login'}/>} />
          <Route path='/add' element={user ? <AddProducts/> : <Navigate to={'/login'}/>} />
          <Route path='/order' element={user ? <Order/> : <Navigate to={'/login'}/>} />
          <Route path='/cart' element={user ? <Cart/> : <Navigate to={'/login'}/>} />
          <Route path='/myproducts' element={user ? <MyProducts/> : <Navigate to={'/login'}/>} />
          
          {/* Public Routes */}
          <Route path='/login' element={user ? <Navigate to={'/'}/> : <Login />} />
          <Route path='/signup' element={ user ? <Navigate to={'/'}/> :  <Signup/>}/>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
        </Routes>
      </ErrorBoundary>
      {/* 3. The ErrorBoundary tag closes here */}

      </BrowserRouter>
    </>
  )
}

export default App