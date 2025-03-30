import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FiGrid, FiBox, FiList, FiMenu } from "react-icons/fi";
import { motion } from "framer-motion";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    navigate("/loginpage");
  };

  return (
    <>
   
      <button 
        onClick={toggleSidebar} 
        className="fixed top-8 left-5  hover:cursor-pointer hover:bg-gray-300 transition duration-400 text-white p-2 rounded-full z-50"
      >
        <FiMenu size={24} className="text-black" />
      </button>


      <motion.div 
        initial={{ width: 250 }}
        animate={{ width: isOpen ? 250 : 70 }}
        transition={{ duration: 0.3 }}
        className="h-screen bg-white p-4 fixed left-0 text-black  overflow-hidden"
      >
        <nav className="space-y-4">
          {[{ path: "/allproductspage", icon: <FiGrid />, label: "All Products" },
            { path: "/myproductspage", icon: <FiBox />, label: "My Products" },
            { path: "/categoriespage", icon: <FiList />, label: "Categories" }].map((item, index) => (
            <Link key={index} to={item.path} className="flex items-center p-3 rounded-lg hover:bg-gray-200 transition">
              <span className="text-xl">{item.icon}</span>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                transition={{ duration: 0.3 }}
                className={`ml-3 text-lg font-medium ${!isOpen && "hidden"}`}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </nav>
        
     
        <button
          onClick={() => setShowLogoutPopup(true)}
          className="bg-black p-3 text-white rounded-xl mt-100 hover:cursor-pointer hover:bg-gray-700 w-full"
        >
          Log Out
        </button>
      </motion.div>

 
      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-medium mb-4">Are you sure you want to log out?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
