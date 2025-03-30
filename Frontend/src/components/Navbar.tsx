import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {

  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {

    const email = localStorage.getItem("userEmail");
    setUserEmail(email);
  }, []);

  return (
    <nav className="flex items-center justify-between mt-3 px-6 py-4 bg-white">
      <div
      onClick={()=> navigate("/allproductspage")} 
      className="text-4xl font-bold ml-12 hover:cursor-pointer">
        <span className="text-black">BUCKET</span>
      </div>

      <div className="relative w-1/3">
        <input
          type="text"
          placeholder="Search by Product name or Description"
          className="w-full p-3 pl-10 border border-gray-400 text-black font-medium rounded-full focus:ring-2 focus:ring-gray-300 focus:outline-none"
        />
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
      </div>

      <div className="flex text-black gap-5 items-center">
        {userEmail ? (
          <span className="text-black font-medium">{userEmail}</span>
        ) : (
          <span className="text-gray-500">Not logged in</span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
