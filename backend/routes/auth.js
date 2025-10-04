const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');

require('dotenv').config();
const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const { username, email, password } = req.body;

    // Kiểm tra user tồn tại chưa
    const existingUser = await users.findOne({ 
      $or: [ { email }, { username } ] 
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email hoặc username đã được sử dụng!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user mới
    const result = await users.insertOne({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ 
      message: "Đăng ký thành công!",
      userId: result.insertedId 
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const db = await connectDB();
    const users = db.collection("users");

    const { email, password } = req.body;

    // Tìm user theo email
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Thông tin đăng nhập không đúng!" });
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Thông tin đăng nhập không đúng!" });
    }

    // Tạo JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

module.exports = router;
