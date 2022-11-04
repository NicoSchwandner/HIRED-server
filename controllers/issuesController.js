// const User = require("../models/User");
const Issue = require("../models/Issue");
// const project = require("../models/Project");
const asyncHandler = require("express-async-handler");

// @desc Get all issues
// @route GET /issues
// @access Private
const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find().lean();
  if (!issues?.length) {
    return res.status(400).json({ message: "No issues found" });
  }
  res.json(issues);
});

// @desc Create new issue
// @route POST /issues
// @access Private
const createNewIssue = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, submitter, type, status } = req.body;

  // Confirm data
  if (!title || !submitter) {
    return res
      .status(400)
      .json({ message: "The following fields are required: title, submitter" });
  }

  // Check for duplicates
  const duplicate = await Issue.findOne({ title }).lean().exec();

  if (duplicate) {
    return res.status(409).json({
      message: "Duplicate title - try again with a more specific title",
    });
  }

  // Expand issueObject with optional data
  const issueObject = { title, submitter };

  if (description) {
    // issueObject = {...issueObject, description}
    issueObject.description = description;
  }

  if (assignedTo) issueObject.assignedTo = assignedTo;
  if (type) issueObject.type = type;
  if (status) issueObject.status = status;

  // Create and store new issue
  const issue = await Issue.create(issueObject);

  if (issue) {
    res.status(201).json({ message: `New issue ${issue._id} created` });
  } else {
    res.status(400).json({ message: "Invalid issue data received" });
  }
});

// @desc Update issue
// @route PATCH /issues
// @access Private
const updateIssue = asyncHandler(async (req, res) => {
  const { id, title, description, assignedTo, submitter, type, status } =
    req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({
      message: "Issue ID is required",
    });
  }

  // Check if user exists
  const issue = await Issue.findById(id).exec();

  if (!issue) {
    return res.status(400).json({ message: "Issue not found" });
  }

  if (title) {
    // Check for duplicates
    const duplicate = await Issue.findOne({ title }).lean().exec();

    //Allow updates to the original issue
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({
        message: "Duplicate issue title - try again with a more specific title",
      });
    }

    issue.title = title;
  }

  if (description) issue.description = description;
  if (assignedTo) issue.assignedTo = assignedTo;
  if (submitter) issue.submitter = submitter;
  if (type) issue.type = type;
  if (status) issue.status = status;

  const updatedIssue = await issue.save();

  res.json({
    message: `Issue ${updatedIssue._id} updated ("${updatedIssue.title}")`,
  });
});

// @desc Delete issue
// @route DELETE /issues
// @access Private
const deleteIssue = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Issue ID required" });
  }

  // Check if user exists
  const issue = await Issue.findById(id).exec();

  if (!issue) {
    return res.status(400).json({ message: "Issue not found" });
  }

  const result = await issue.deleteOne();

  const reply = `Issue ${result._id} deleted ("${result.title}")`;

  res.json(reply);
});

module.exports = {
  getAllIssues,
  createNewIssue,
  updateIssue,
  deleteIssue,
};
