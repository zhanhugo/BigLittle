import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      rquired: true
    },
    pic: {
      type: String,
      required: true
    },
    headline: {
      type: String,
      required: true,
    },
    aboutYou: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: false,
    },
    relevantExperience: {
      type: String,
      required: false,
    },
    category: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
