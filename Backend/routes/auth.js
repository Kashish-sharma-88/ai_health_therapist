import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Auth router working ✅" });
});

// -------------------- Register --------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Login --------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ message: "Login successful ✅", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// -------------------- Middleware for token --------------------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied ❌" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id; // user id store
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid ❌" });
  }
};

// -------------------- Protected Route (User Info) --------------------
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password"); // password hide
    if (!user) return res.status(404).json({ message: "User not found ❌" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error ❌" });
  }
});


export default router;
