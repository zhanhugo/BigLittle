import asyncHandler from "express-async-handler";
import Match from "../models/matchModel.js";

//@description     Fetch matches for user
//@route           POST /api/matches/
//@access          Private
const getMatchesById = asyncHandler(async (req, res) => {
  const { isMentor, isMentee, confirmed, deleted } = req.body;
  var matches;
  if (isMentor && isMentee) {
    matches = confirmed == "both" ? await Match.find({ $or:[{"mentorId": req.user._id}, {"userId": req.user._id}], deleted }) : await Match.find({ $or:[{"mentorId": req.user._id}, {"userId": req.user._id}], confirmed, deleted });
  } else if (isMentor) {
    matches = confirmed == "both" ? await Match.find({ mentorId: req.user._id, deleted }) : await Match.find({ mentorId: req.user._id, confirmed, deleted });
  } else if (isMentee) {
    matches = confirmed == "both" ? await Match.find({ userId: req.user._id, deleted }) : await Match.find({ userId: req.user._id, confirmed, deleted });
  }



  if (matches) {
    res.json(matches);
  } else {
    res.status(404).json({ message: "Matches not found" });
  }
});

// @desc    Create match request
// @route   PUT /api/matches/create
// @access  Private
const RequestMatch = asyncHandler(async (req, res) => {
  const { mentor, mentorId, mentorPic, postId, messages } = req.body;

  const matchExists = await Match.findOne({ postId, userId: req.user._id });
  if (matchExists) {
    res.status(404);
    if (matchExists.confirmed) {
      throw new Error("Users are already matched");
    }
    throw new Error("Pending request");
  }

  const match = new Match({ mentor, mentorId, mentorPic, postId, user: req.user.name, userId: req.user._id, userPic: req.user.pic, messages, confirmed: false, deleted: false });

  const createdMatch = await match.save();

  res.status(201).json(createdMatch);
});

// @desc    Update a match
// @route   POST /api/notes/:id
// @access  Private
const UpdateMatch = asyncHandler(async (req, res) => {
  const match = await Match.findById(req.params.id);

  const {mentor, mentorPic, user, userPic, newMessage, confirmed, deleted} = req.body

  if (match) {
    match.mentor = mentor;
    match.mentorPic = mentorPic;
    match.user = user;
    match.userPic = userPic
    match.confirmed = confirmed;
    match.deleted = deleted;
    if (newMessage) {    
      match.messages.push(newMessage);
    }
    const updatedMatch = await match.save();
    res.json(updatedMatch);
  } else {
    res.status(404);
    throw new Error("Match not found");
  }
});
  
export { getMatchesById, RequestMatch, UpdateMatch };
