const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// Connect to the database
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Blog API running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
