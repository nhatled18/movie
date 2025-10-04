// config/db.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db; // lưu instance DB để dùng lại, tránh connect nhiều lần

async function connectDB() {
  if (!db) {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    db = client.db("auth_db"); // thay bằng tên DB bạn muốn
  }
  return db;
}

module.exports = connectDB;
