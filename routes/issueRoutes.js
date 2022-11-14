const express = require("express")
const router = express.Router()
const issuesController = require("../controllers/issuesController")
const verifyJWT = require("../middleware/verifyJWT")

router.use(verifyJWT)

router
  .route("/")
  .get(issuesController.getAllIssues)
  .post(issuesController.createNewIssue)
  .patch(issuesController.updateIssue)
  .delete(issuesController.deleteIssue)

module.exports = router
