import React, { useState } from "react";
import OTPcomponent from "./OTPcomponent";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Signup: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const navigate = useNavigate();

  const showPassword = () => setShowPass(!showPass);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const sendOtp = async () => {
    try {
      await axios.post("http://localhost:3000/api/v1/get-otp", { data: email });
      setSuccess("OTP sent successfully! "); 
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error(error);
      setError("Please enter a valid email");
      setTimeout(() => setError(""), 3000);
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join('');
    try {
      await axios.post("http://localhost:3000/api/v1/verify-otp", {
        otp: otpString,
        userEmail: email,
      });
      setSuccess("OTP Verified! "); 
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.log(error);
      setError("Invalid OTP");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/v1/insert-into-users-table", {
        email,
        password,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Error during registration. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
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
        <motion.h1 
          className="text-4xl font-bold text-black mb-8 text-center"
          variants={itemVariants}
        >
          Register to BUCKET
        </motion.h1>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-bold text-black">Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="flex-1 text-black p-3 rounded-lg border border-gray-200 bg-gray-50"
              />
              <button 
                onClick={sendOtp} 
                className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Send OTP
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-bold text-black">OTP</label>
            <div className="flex gap-2 items-center">
              <OTPcomponent otp={otp} setOtp={setOtp} />
              <button 
                onClick={verifyOtp} 
                className="px-7 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Verify
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <label className="text-sm font-bold text-black">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
                className="w-full p-3 text-black rounded-lg border border-gray-200 bg-gray-50"
              />
              <button 
                type="button" 
                onClick={showPassword} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button 
              onClick={handleSignup} 
              disabled={loading} 
              className={`w-full p-3 ${loading ? "bg-gray-400" : "bg-black hover:bg-gray-800"} text-white rounded-lg`}
            >
              {loading ? "Signing up..." : "Signup"}
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <p className="text-gray-500 mb-2">Already have an account?</p>
            <button 
              onClick={() => navigate("/")} 
              className="w-full p-3 bg-black text-white border border-black rounded-lg hover:bg-gray-800"
            >
              Login
            </button>
          </motion.div>
        </div>
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

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Signup;
