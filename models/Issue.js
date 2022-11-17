const mongoose = require("mongoose")

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    submitter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: false,
      default: 0,
    },
    // project: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Project",
    //   required: false,
    // },
    // release: {
    //   type: String,
    //   required: false,
    // },
    // priority: {
    //   type: String,
    //   required: false,
    // },
    // app_component: {
    //   type: String,
    //   required: false,
    // },
    // scheduled: {
    //   type: Date,
    //   required: false,
    // },
    // comments: [
    //   {
    //     user_id: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "User",
    //       required: true,
    //     },
    //     body: {
    //       type: String,
    //       required: true,
    //     },
    //     date: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
)

issueSchema.pre("save", function (next) {
  this.updatedAt = Date.now
  next()
})

module.exports = mongoose.model("Issue", issueSchema)
