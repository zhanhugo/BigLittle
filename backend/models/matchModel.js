import mongoose from "mongoose";

const matchSchema = mongoose.Schema(
    {
        mentor: {
            type: String,
            required: true,
        },
        mentorId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        mentorPic: {
            type: String,
            required: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Note",
        },
        user: {
            type: String,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        userPic: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        fbLink: {
            type: String,
            required: true,
        },
        confirmed: {
            type: Boolean,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
