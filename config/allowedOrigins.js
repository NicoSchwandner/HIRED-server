const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://hired-issue-tracker.onrender.com"]
    : ["http://localhost:3000"]

module.exports = allowedOrigins
