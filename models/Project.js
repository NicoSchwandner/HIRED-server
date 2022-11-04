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
    // assigned_staff: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: false,
    //   },
    // ],
  },
  { timestamps: true }
);

projectSchema.pre("save", function (next) {
  this.updatedAt = Date.now;
  next();
});

module.exports = mongoose.model("Project", projectSchema);
