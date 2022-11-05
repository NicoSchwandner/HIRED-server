const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // status: {
    //   type: Number,
    //   required: false,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model("Project", projectSchema);
