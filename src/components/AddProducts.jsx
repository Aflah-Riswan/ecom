import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux";
import { addProducts } from "../features/productSlice";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase"; 
import axios from "axios";

export default function AddProducts() {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
   
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to add a product.");
      return;
    }
    console.log(" submit worked..");
    const imageFile = data.image[0];
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "productImages");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dhgpzqzyy/image/upload", 
        formData
      );

      const cloudData = res.data;
      console.log("Uploaded image URL:", cloudData.secure_url);

      
      const productData = {
        imageUrl: cloudData.secure_url,
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        count: 1,
        isOrdered: false,
        userId: user.uid 
      };

      dispatch(addProducts(productData)); 
      navigate('/myproducts'); 
      console.log("Final Product Data:", productData);
      alert("Product added successfully!");

    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image: " + error.message);
    }
  };

  return (
   
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Add a New Product
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter the name of the product"
              {...register('name', { required: true })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter description about the product"
              {...register('description', { required: true })} 
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price
            </label>
            <input
              id="price"
              type="number" 
              step="0.01"   
              placeholder="Enter the price (e.g., 29.99)"
              {...register('price', { required: true, valueAsNumber: true })} 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Product Image
            </label>
            <input
              id="image"
              type='file'
              accept="image/*"
              {...register('image', { required: true })} 
              className="w-full text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100"
            />
          </div>
          <button
            type="submit"
            
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit Product
          </button>
        </form>
      </div>
    </div>
  );
}
