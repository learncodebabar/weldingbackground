import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ======================
// Register Admin (only once)
// ======================
export const registerAdmin = async (req, res) => {
  try {
    const exists = await Admin.findOne();
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const { name, email, password } = req.body;
    const admin = new Admin({ name, email, password });
    await admin.save();

    res.status(201).json({ message: "Admin registered" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ======================
// Login without OTP
// ======================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await admin.comparePassword(password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate JWT directly without OTP
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
