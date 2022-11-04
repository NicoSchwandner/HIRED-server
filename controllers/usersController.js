const User = require("../models/User");
const Issue = require("../models/Issue");
// const project = require("../models/Project");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({
      message: "The following fields are required: username, password, roles",
    });
  }

  // Check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); //10 salt rounds

  const userObject = { username, password: hashedPwd, roles };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password, assignedProjects } = req.body;

  // Confirm data
  // if (!id || !username || !password || !active || !Array.isArray(roles) || !roles.length) {
  if (
    !id ||
    !username ||
    typeof active !== "boolean" ||
    !Array.isArray(roles) ||
    !roles.length
  ) {
    return res.status(400).json({
      message: "The following fields are required: id, username, active, roles",
    });
  }

  // Check if user exists
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicates
  const duplicate = await User.findOne({ username }).lean().exec();

  //Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({
      message: "Duplicate username - try again with another username",
    });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); //10 salt rounds
  }
  if (assignedProjects) user.assignedProjects = assignedProjects;

  const updatedUser = await user.save();

  res.json({
    message: `User ${updatedUser.username} with ID ${updatedUser._id} updated`,
  });
});

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  const issuesAssigned = await Issue.findOne({ assignedTo: id }).lean().exec();
  if (issuesAssigned) {
    return res.status(400).json({ message: "User has assigned issues" });
  }

  const issuesCreated = await Issue.findOne({ submitter: id }).lean().exec();
  if (issuesCreated) {
    return res.status(400).json({ message: "User has created issues" });
  }

  // Check if user exists
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `User ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
