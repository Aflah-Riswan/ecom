import { useDispatch, useSelector } from "react-redux"
import { addProducts } from "../features/productSlice" // 1. Removed markCart/unmarkCart
import { addToCart, removeCartItem } from "../features/cartSlice"
import { useEffect, useMemo } from "react" // 2. Import useMemo
import getDataFromDb from "../features/middleware/getDataFromDb"
// 3. toggleCartStatus is no longer imported
import { auth } from "../../firebase" 

export default function Home() {
  const dispatch = useDispatch()
  const currentUser = auth.currentUser; 

  // 4. Get the main products list
  const products = useSelector((state) => state.product.products)
  // 5. Get ALL cart items from the cart slice
  const allCartItems = useSelector((state) => state.cart.items);

  // 6. Create a quick lookup Set of IDs that are in the CURRENT user's cart
  const userCartIds = useMemo(() => {
      return new Set(
          allCartItems
              .filter(item => item.shopperId === currentUser?.uid)
              .map(item => item.id)
      );
  }, [allCartItems, currentUser]);

  // 7. Create the final list of products to display
  const productsToDisplay = useMemo(() => {
      return products
          // Filter out ordered items and user's own items
          .filter(p => 
              p.isOrdered === false && p.userId !== currentUser?.uid
          )
          // Dynamically add the correct 'isCarted' status
          .map(p => ({
              ...p,
              isCarted: userCartIds.has(p.id) 
          }));
  }, [products, userCartIds, currentUser]);
  
  


  useEffect(() => {
    dispatch(getDataFromDb())
  }, [dispatch]) 

  
  function handleCart(product) {
    if (product.isCarted) {
     
      dispatch(removeCartItem(product))
      
    } else {
      
      if (!currentUser) {
        alert("Please log in to add items to your cart.");
        return;
      }
      dispatch(addToCart({ product: product, shopperId: currentUser.uid }))
      
    }
  }
  const erroSample=null

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Products
        </h1>
        
        
        <div className="flex flex-col space-y-6">
          {productsToDisplay.map((product) => {
            return (
              <div
                key={product.id}
                className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full md:w-64 h-64 md:h-auto object-cover"
                />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-xl font-bold text-gray-900 ml-4 flex-shrink-0">
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mb-6">
                    {product.description}
                  </p>
                 
                  <div className="mt-auto flex justify-end">
                    <button
                      onClick={() => handleCart(product)}
                      className={`
                        w-48 h-12 flex items-center justify-center font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50
                        ${product.isCarted
                          ? 'bg-gray-300 text-gray-800 hover:bg-gray-400 focus:ring-gray-400' 
                          : 'bg-amber-500 text-gray-900 hover:bg-amber-600 focus:ring-amber-500'
                        }
                      `}
                    >
                      {product.isCarted ? 'Remove Cart' : 'Add To Cart'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}