import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  answerbody: { type: String, required: true },
  useranswered: { type: String, required: true },
  userid: { type: String, required: true },
  answeredon: { type: Date, default: Date.now }
});

const QuestionSchema = new mongoose.Schema({
  questiontitle: { type: String, required: "Question must have a title" },
  questionbody: { type: String, required: "Question must have a body" },
  questiontags: { type: [String], required: "Question must have tags" },
  noofanswers: { type: Number, default: 0 },
  upvote: { type: [String], default: [] },
  downvote: { type: [String], default: [] },
  userposted: { type: String, required: "Question must have an author" },
  userid: { type: String, required: true },
  askedon: { type: Date, default: Date.now },
  answer: [AnswerSchema]
});

export default mongoose.model("Question", QuestionSchema);