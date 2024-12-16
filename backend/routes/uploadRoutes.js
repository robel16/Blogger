const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  uploadImage,
  uploadMiddleware,
} = require("../controllers/uploadController");

router.post("/", protect, uploadMiddleware, uploadImage);

module.exports = router;
