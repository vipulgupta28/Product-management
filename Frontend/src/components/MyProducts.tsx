import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const MyProducts: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const categories = [
    "Shoes",
    "Clothing",
    "Accessories",
    "Electronics",
    "Beauty",
    "Home & Living",
  ];

  const toggleForm = () => setIsVisible(!isVisible);

  const AddProduct = async () => {
    if (!title || !description || !price || !category) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v1/store-product", {
        title: title.trim(),
        description: description.trim(),
        price: price.trim(),
        category: category.trim(),
      });

      if (response.status === 201) {
        setSuccessMessage("Product added successfully!");
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory("");

        
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-end p-6">
      <button
        onClick={toggleForm}
        className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition duration-300"
      >
        Add Product
      </button>

      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white shadow-md p-6 rounded-xl mt-6 w-full max-w-5xl"
        >
          <div className="flex gap-4">
            <label className="border border-gray-300 w-108 h-133 flex items-center justify-center rounded-lg cursor-pointer bg-gray-100">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-gray-500">Upload Image</span>
              )}
              <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>

            <div className="flex-1 space-y-4">
              <label className="font-medium">Title</label>
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />

              <label className="font-medium">Description</label>
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 h-40 focus:ring-black"
              />

              <label className="font-medium">Price</label>
              <input
                type="text"
                placeholder="Price (in rupees)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              />

              <label className="font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={AddProduct}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition duration-400"
            >
              Add Product
            </button>
          </div>
        </motion.div>
      )}

 
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          {successMessage}
        </motion.div>
      )}
    </div>
  );
};

export default MyProducts;
