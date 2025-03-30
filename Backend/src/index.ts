import express from 'express';
import nodemailer from "nodemailer";
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import bcrypt from 'bcrypt';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors());
const storage = multer.memoryStorage();
const upload = multer({ storage });

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

const otpStorage: Record<string, number> = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_PASS!,
    }
});

const sendOtpToEmail = async (userEmail: string, otp: number) => {
    const mailOption = {
        from: process.env.GMAIL_USER!,
        to: userEmail,
        subject: "Bucket OTP Code",
        text: `Your OTP is : ${otp}`,
    };

    try {
        let info = await transporter.sendMail(mailOption);
        console.log("Email Sent to", info.response);
    } catch (error) {
        console.log("Error sending mail", error);
    }
};

app.post("/api/v1/get-otp", async (req, res) => {
    const email = req.body.data;
    const otp = Math.floor(1000 + Math.random() * 9000);

    console.log(`Generating OTP for ${email}: ${otp}`);

    otpStorage[email] = otp;
    try {
        await sendOtpToEmail(email, otp);
        res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

app.post("/api/v1/verify-otp", (req, res) => {
    const { otp, userEmail } = req.body;

    const storedOTP = otpStorage[userEmail];

    console.log(`Stored: ${storedOTP}, Received: ${otp}`);

    if (storedOTP && storedOTP.toString() === otp) {
        res.status(200).json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
});

//@ts-ignore
app.post("/api/v1/insert-into-users-table", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const { data, error } = await supabase
            .from("users")
            .insert([{ email, password: hashedPassword }]);

        if (error) throw error;

        res.status(201).json({ message: "User registered successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Error inserting user" });
    }
});

//@ts-ignore
app.post("/api/v1/login-into", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('password')
            .eq('email', email)
            .single();

        if (error || !user) return res.status(400).json({ message: "Invalid email or password" });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


app.post("/api/v1/store-product", async (req, res) => {
    try {
      const { title, description, price, category } = req.body;
  

      const { data: product, error: dbError } = await supabase
        .from("products")
        .insert([{ title, description, price, category }]);
  
      if (dbError) throw dbError;
  
      res.status(201).json({ message: "Product added successfully", product });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to store product" });
    }
  });
  

  app.get("/api/v1/get-products", async (req, res) => {
    try {
      const { category } = req.query; 
  
      let query = supabase.from("products").select("*");
  
      if (category && category !== "All") {
        query = query.eq("category", category); 
      }
  
      const { data, error } = await query;
  
      if (error) throw error;
  
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });
  
  
  app.delete("/api/v1/delete-product/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      await supabase.from("products").delete().eq("id", id);
      res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  app.put("/api/v1/update-product/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, price, category } = req.body;
  
    try {
      await supabase.from("products").update({ title, description, price, category }).eq("id", id);
      res.status(200).json({ message: "Product updated successfully!" });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Failed to update product" });
    }
  });
  
//@ts-ignore
  app.get("/api/v1/my-products/:user_id", async (req, res) => {
    const { user_id } = req.params;
  
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", user_id);
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    return res.status(200).json(data);
  });



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
