import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  category: string;
}

const AllProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/v1/get-products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/delete-product/${deleteProduct.id}`);
      setProducts(products.filter((product) => product.id !== deleteProduct.id));
      setDeleteProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      await axios.put(`http://localhost:3000/api/v1/update-product/${editingProduct.id}`, editingProduct);
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="flex flex-col items-center ml-50 p-6">
        <h1 className="text-black font-bold text-4xl mb-6">All Products</h1>

        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white shadow-lg rounded-xl p-6 border flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{product.title}</h2>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <p className="text-black font-bold mt-2">₹{product.price}</p>
                  <p className="text-sm text-gray-500">Category: {product.category}</p>
                </div>

              
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(product)}
                    className="flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

    
        {editingProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h2 className="text-xl font-bold mb-4">Edit Product</h2>
              <input
                type="text"
                value={editingProduct.title}
                onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                placeholder="Title"
              />
              <input
                type="text"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                placeholder="Description"
              />
              <input
                type="text"
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                placeholder="Price"
              />
              <input
                type="text"
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg mb-3"
                placeholder="Category"
              />
              <div className="flex justify-between mt-4">
                <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                  Update
                </button>
                <button onClick={() => setEditingProduct(null)} className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        
        <AnimatePresence>
          {deleteProduct && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete <strong>{deleteProduct.title}</strong>?
                </p>
                <div className="flex justify-between">
                  <button
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setDeleteProduct(null)}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AllProducts;
