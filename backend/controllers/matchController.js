import asyncHandler from "express-async-handler";
import Match from "../models/matchModel.js";

//@description     Fetch matches for user
//@route           POST /api/matches/
//@access          Private
const getMatchesById = asyncHandler(async (req, res) => {
  const { isMentor, isMentee, confirmed } = req.body;
  var matches;
  if (isMentor && isMentee) {
    matches = await Match.find({ $or:[{"mentorId": req.user._id}, {"userId": req.user._id}], confirmed });
  } else if (isMentor) {
    matches = await Match.find({ mentorId: req.user._id, confirmed });
  } else if (isMentee) {
    matches = await Match.find({ userId: req.user._id, confirmed });
  }

  if (matches) {
    res.json(matches);
  } else {
    res.status(404).json({ message: "Matches not found" });
  }

  res.json(matches);
});

// @desc    Create match request
// @route   POST /api/matches/create
// @access  Private
const RequestMatch = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { mentor, mentorId, mentorPic, postId, message, fbLink } = req.body;

  const matchExists = await Match.findOne({ postId, userId: req.user._id });
  if (matchExists) {
    res.status(404);
    if (matchExists.confirmed) {
      throw new Error("Users are already matched");
    }
    throw new Error("Pending request");
  }

  const match = new Match({ mentor, mentorId, mentorPic, postId, user: req.user.name, userId: req.user._id, userPic: req.user.pic, message, fbLink, confirmed: false });

  const createdMatch = await match.save();

  res.status(201).json(createdMatch);
});

//@description     Delete single match
//@route           GET /api/matches/:id
//@access          Private
const DeleteMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);

  if (match) {
    await match.remove();
    res.json({ message: "Match Removed" });
  } else {
    res.status(404);
    throw new Error("Match not Found");
  }
});

// @desc    Confirm a match
// @route   PUT /api/notes/:id
// @access  Private
const ConfirmMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);

  if (match) {
    match.confirmed = true;

    const confirmedMatch = await match.save();
    res.json(confirmedMatch);
  } else {
    res.status(404);
    throw new Error("Match not found");
  }
});
  
export { getMatchesById, RequestMatch, DeleteMatch, ConfirmMatch };
