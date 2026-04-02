const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Admin login request received:", req.body); // 🔍 ADD THIS

  try {
    const admin = await User.findOne({ email, role: "admin" });

    console.log("Admin found:", admin); // 🔍 ADD THIS

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Admin login successful",
      name: admin.name,
      email: admin.email
    });

  } catch (err) {
    console.error("Error in admin login:", err); // 🔴 IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;