import multer from "multer";
import path from "path";

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadMiddleware = multer({ storage });

// Standalone avatar upload handler (optional)
export const upload = (req, res) => {
  // Use uploadMiddleware.single("avatar") as route middleware!
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  return res.status(200).json({ imageUrl });
};