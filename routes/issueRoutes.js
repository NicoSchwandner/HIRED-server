const express = require("express");
const router = express.Router();
const issuesController = require("../controllers/issuesController");

router
  .route("/")
  .get(issuesController.getAllIssues)
  .post(issuesController.createNewIssue)
  .patch(issuesController.updateIssue)
  .delete(issuesController.deleteIssue);

module.exports = router;
