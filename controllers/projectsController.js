const User = require("../models/User");
// const Issue = require("../models/Issue");
const Project = require("../models/Project");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all projects
// @route GET /projects
// @access Private
const getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().lean();
  if (!projects?.length) {
    return res.status(400).json({ message: "No projects found" });
  }
  res.json(projects);
});

// @desc Create new project
// @route POST /projects
// @access Private
const createNewProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Confirm data
  if (!name || !description) {
    return res.status(400).json({
      message: "The following fields are required: name, description",
    });
  }

  // Check for duplicates
  const duplicate = await Project.findOne({ name }).lean().exec();

  if (duplicate) {
    return res.status(409).json({
      message: "Duplicate project title - try again with a more specific title",
    });
  }

  const projectObject = { name, description };

  // Create and store new user
  const project = await Project.create(projectObject);

  if (project) {
    res.status(201).json({ message: `New project ${project._id} created` });
  } else {
    res.status(400).json({ message: "Invalid project data received" });
  }
});

// @desc Update project
// @route PATCH /projects
// @access Private
const updateProject = asyncHandler(async (req, res) => {
  const { id, name, description, assigned_staff } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({
      message: "Project ID is required",
    });
  }

  // Check if user exists
  const project = await Project.findById(id).exec();

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  if (name) {
    // Check for duplicates
    const duplicate = await Project.findOne({ name }).lean().exec();

    // Allow updates to the original project
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({
        message:
          "Duplicate project title - try again with a more specific title",
      });
    }

    project.name = name;
  }

  if (assigned_staff) project.assigned_staff = assigned_staff;

  const updatedProject = await project.save();

  res.json({
    message: `Project ${updatedProject._id} updated ("${updatedProject.name}")`,
  });
});

// @desc Delete project
// @route DELETE /projects
// @access Private
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Project ID required" });
  }

  const assignedUsers = await User.findOne({ assignedProjects: id })
    .lean()
    .exec();
  if (assignedUsers) {
    return res.status(400).json({ message: "Project has assigned users" });
  }

  // Check if user exists
  const project = await Project.findById(id).exec();

  if (!project) {
    return res.status(400).json({ message: "Project not found" });
  }

  const result = await project.deleteOne();

  const reply = `Project ${result._id} deleted ("${result.name}")`;

  res.json(reply);
});

module.exports = {
  getAllProjects,
  createNewProject,
  updateProject,
  deleteProject,
};
