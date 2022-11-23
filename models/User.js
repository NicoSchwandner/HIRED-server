const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: {
      type: [Number],
      default: [2001],
    },
  },
  { timestamps: true }
)

userSchema.pre("save", function (next) {
  this.updatedAt = Date.now
  next()
})

module.exports = mongoose.model("User", userSchema)
