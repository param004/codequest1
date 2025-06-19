import mongoose from "mongoose";
import Question from "../models/Question.js";
import User from "../models/auth.js"; // Use your User model path

// Post an answer
export const postanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { noofanswers, answerbody, useranswered, userid } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }
  try {
    const updatequestion = await Question.findByIdAndUpdate(
      _id,
      {
        $push: {
          answer: {
            answerbody,
            useranswered,
            userid,
            answeredon: new Date(),
          },
        },
        $set: { noofanswers: noofanswers },
      },
      { new: true }
    );
    // Reward 5 points to user for posting an answer
    await User.findByIdAndUpdate(userid, { $inc: { points: 5 } });
    res.status(200).json(updatequestion);
  } catch (error) {
    res.status(500).json({ message: "Error in uploading answer", error: error.message });
  }
};

// Delete an answer
export const deleteanswer = async (req, res) => {
  const { id: _id } = req.params;
  const { answerid, noofanswers } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("question unavailable...");
  }
  if (!mongoose.Types.ObjectId.isValid(answerid)) {
    return res.status(404).send("answer unavailable...");
  }
  try {
    // Find the question to get the answer's user id
    const question = await Question.findById(_id);
    const answer = question.answer.find(ans => String(ans._id) === String(answerid));
    await Question.updateOne(
      { _id },
      { $pull: { answer: { _id: answerid } }, $set: { noofanswers: noofanswers } }
    );
    // Deduct 5 points from user for deleting an answer
    if (answer && answer.userid) {
      await User.findByIdAndUpdate(answer.userid, { $inc: { points: -5 } });
    }
    res.status(200).json({ message: "successfully deleted.." });
  } catch (error) {
    res.status(500).json({ message: "Error in deleting answer", error: error.message });
  }
};