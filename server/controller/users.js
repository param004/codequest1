import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/auth.js";

// SIGNUP
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) return res.status(404).json("User already exists");

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: newUser, token });
  } catch (err) {
    res.status(500).json("Something went wrong...");
  }
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existinguser = await User.findOne({ email });
    if (!existinguser) return res.status(404).json("User not found");

    const isPasswordCorrect = await bcrypt.compare(password, existinguser.password);
    if (!isPasswordCorrect) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { email: existinguser.email, id: existinguser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existinguser, token });
  } catch (err) {
    res.status(500).json("Something went wrong...");
  }
};

// GET ALL USERS
export const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    const alluserdetails = users.map((user) => ({
      _id: user._id,
      name: user.name,
      about: user.about,
      tags: user.tags,
      joinedon: user.createdAt,
      avatar: user.avatar,
      notificationEnabled: user.notificationEnabled,
      points: user.points, // Include points
      badges: user.badges, // Include badges
      location: user.location, // Include location
    }));
    res.status(200).json(alluserdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// UPDATE PROFILE
export const updateprofile = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send("User not found");
  }

  try {
    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.about) updateFields.about = req.body.about;
    if (req.body.tags) {
      updateFields.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(',').map(tag => tag.trim());
    }
    if (req.file) {
      updateFields.avatar = `/uploads/${req.file.filename}`;
    } else if (req.body.avatar) {
      updateFields.avatar = req.body.avatar;
    }
    if (req.body.notificationEnabled !== undefined) {
      updateFields.notificationEnabled =
        req.body.notificationEnabled === "true" || req.body.notificationEnabled === true;
    }

    const updatedProfile = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    // Return as { result: updatedProfile } for frontend compatibility
    res.status(200).json({ result: updatedProfile });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// TRANSFER POINTS
export const transferPoints = async (req, res) => {
  const { fromUserId, toUserId, amount } = req.body;
  if (!fromUserId || !toUserId || !amount) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  if (amount < 1) {
    return res.status(400).json({ message: "Amount must be positive" });
  }
  const fromUser = await User.findById(fromUserId);
  if (!fromUser) {
    return res.status(404).json({ message: "Sender not found" });
  }
  if (fromUser.points < 10 || fromUser.points < amount) {
    return res.status(400).json({ message: "Insufficient points" });
  }
  const toUser = await User.findById(toUserId);
  if (!toUser) {
    return res.status(404).json({ message: "Recipient not found" });
  }
  await User.findByIdAndUpdate(fromUserId, { $inc: { points: -amount } });
  await User.findByIdAndUpdate(toUserId, { $inc: { points: amount } });
  res.json({ message: "Points transferred" });
};

// UPDATE LOCATION
export const updateLocation = async (req, res) => {
  const { userId, city, state, country, lat, lng, weather } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }
  await User.findByIdAndUpdate(userId, {
    location: { city, state, country, lat, lng, weather }
  });
  res.json({ message: "Location updated" });
};