const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

//  multer for file uploads
   const storage = multer.diskStorage({
     destination: function (req, file, cb) {
       cb(null, "uploads/");
     },
     filename: function (req, file, cb) {
       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
       cb(null, uniqueSuffix + path.extname(file.originalname));
     },
   });

   const upload = multer({
     storage: storage,
     limits: {
       fileSize: 5 * 1024 * 1024,
     },
     fileFilter: (req, file, cb) => {
       if (file.mimetype.startsWith("image/")) {
         cb(null, true);
       } else {
         cb(new Error("Not an image! Please upload an image."), false);
       }
     },
   });

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/uploads", express.static("uploads"));

connectDB();

   app.post("/api/upload", upload.single("image"), (req, res) => {
     if (!req.file) {
       return res.status(400).json({ message: "No file uploaded" });
     }
     res.json({
       url: `http://localhost:5000/uploads/${req.file.filename}`,
       path: `/uploads/${req.file.filename}`,
     });
   });

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
