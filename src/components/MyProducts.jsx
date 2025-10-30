import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
import { auth } from "../../firebase"; 
import { Link } from "react-router-dom";
import { deleteProduct, updateProduct } from "../features/productSlice"; // Import new actions

export default function MyProducts() {
  const allProducts = useSelector((state) => state.product.products);
  const currentUser = auth.currentUser;
  const dispatch = useDispatch(); // Get the dispatch function

  const myProducts = currentUser
    ? allProducts.filter(product => product.userId === currentUser.uid)
    : [];

  
  const handleDelete = (productId) => {

    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
    }
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center text-gray-600">
        Please log in to see your products.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          My Products
        </h1>

        {myProducts.length === 0 ? (
          <div className="text-center bg-white p-10 rounded-xl shadow-lg">
            <p className="text-xl text-gray-600 mb-6">You have not added any products yet.</p>
            <Link 
              to="/add"
              className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 hover:bg-blue-700"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            {myProducts.map((product) => {
              return (
                <div
                  key={product.id}
                  className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden"
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
                        ${product.price?.toLocaleString()}
                      </p>
                    </div>

                    <p className="text-gray-600 text-sm mb-6">
                      {product.description}
                    </p>

                    {/* --- (NEW) Added onClick handlers --- */}
                    <div className="mt-auto flex justify-end space-x-4">
                       <button
                         onClick={() => handleDelete(product.id)} // Add delete handler
                         className="font-medium py-2 px-5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                       >
                         Delete
                       </button>
                    </div>

                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}