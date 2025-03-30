import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";

const categories = [
  "All",
  "Shoes",
  "Clothing",
  "Accessories",
  "Electronics",
  "Beauty",
  "Home & Living",
];

const Categories: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const fetchProducts = async (category: string) => {
    try {
      const categoryParam = category === "All" ? "" : `?category=${category}`;
      const response = await axios.get(
        `http://localhost:3000/api/v1/get-products${categoryParam}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="min-h-screen flex flex-col ml-60 p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Categories</h1>
        
      
        <div className="flex gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`p-3 rounded-xl border border-gray-300 flex items-center justify-center 
                transition-all duration-300 cursor-pointer
                ${
                  selectedCategory === category
                    ? "bg-black text-white" 
                    : "bg-white/80 hover:bg-gray-800 hover:text-white"
                }`}
            >
              <p className="text-lg font-semibold">{category}</p>
            </motion.div>
          ))}
        </div>

    
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-gray-700 mb-6">
            {selectedCategory} Products
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={index}
                  className="border p-4 rounded-xl shadow-md bg-white"
                >
                  <h3 className="text-xl font-semibold">{product.title}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-lg font-bold text-black mt-2">
                    ₹{product.price}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No products found in this category.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
