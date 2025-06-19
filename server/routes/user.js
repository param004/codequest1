import express from "express";
import {
  getallusers,
  updateprofile,
  login,
  signup,
  transferPoints,
  updateLocation,
} from "../controller/users.js";
import multer from "multer";
import path from "path";

// Ensure uploads directory exists
import fs from "fs";
const uploadDir = "public/uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.get("/getallusers", getallusers);
router.patch("/update/:id", upload.single("avatar"), updateprofile);
router.post("/signup", signup);
router.post("/login", login);

// Add reward system routes
router.post("/transfer-points", transferPoints);
router.post("/update-location", updateLocation);

export default router;