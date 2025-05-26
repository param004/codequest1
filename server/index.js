import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userroutes from "./routes/user.js";
import questionroutes from "./routes/question.js";
import answerroutes from "./routes/answer.js";

const app = express();
dotenv.config();

// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Routes
app.use("/user", userroutes);
app.use("/questions", questionroutes);
app.use("/answer", answerroutes);

// Default route
app.get("/", (req, res) => {
  res.send("Codequest is running perfect");
});

// Environment variables
const PORT = process.env.PORT || 5000;
const database_url = process.env.MONGO_URI; // ✅ Using MONGO_URI from .env

// Connect to MongoDB and start server
mongoose
  .connect(database_url) // ✅ Cleaned up connection (no deprecated options)
  .then(() => app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  }))
  .catch((err) => console.log(err.message));

  const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});
