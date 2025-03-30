import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const showPassword = () => setShowPass(!showPass);

  const onClickSignUp = () => navigate("/SignupPage");
  const onClickForgotPassword = () => navigate("/OTPgatewayPage");

  const onClickLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await axios.post("http://localhost:3000/api/v1/login-into", {
        email,
        password
      });
  
      if (response.status === 200) {
       
        localStorage.setItem("userEmail", email);
  
        setTimeout(() => {
          setLoading(false);
          navigate("/homepage");
        }, 1000);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      setError("Invalid credentials");
      setTimeout(() => setError(""), 3000);
    }
  };
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div 
        className="w-full max-w-md p-8 bg-white rounded-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-4xl font-bold text-black mb-8 text-center" variants={itemVariants}>
          Welcome to BUCKET
        </motion.h1>

        <motion.div className="space-y-6" variants={itemVariants}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              className="w-full p-3 text-black rounded-lg border border-gray-200 bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full p-3 rounded-lg text-black border border-gray-200 bg-gray-50"
              />
              <button
                type="button"
                onClick={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            <div className="flex justify-end">
              <button onClick={onClickForgotPassword} className="text-sm text-black hover:underline">
                Forgot Password
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8">
          {loading ? (
            <div className="text-center text-black font-medium animate-pulse">
              Logging in...
            </div>
          ) : (
            <button
              onClick={onClickLogin}
              className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
            >
              Login
            </button>
          )}
        </motion.div>

        <motion.div className="mt-6 text-center" variants={itemVariants}>
          <p className="text-gray-500 mb-2">Don't have an account yet?</p>
          <button
            onClick={onClickSignUp}
            className="w-full p-3 bg-black text-white border border-black rounded-lg hover:bg-gray-800"
          >
            Sign Up
          </button>
        </motion.div>
      </motion.div>

   
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;