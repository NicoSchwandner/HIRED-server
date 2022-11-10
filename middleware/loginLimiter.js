ratelimit = require("express-rate-limit");
const { logEvents } = require("./logger");

const loginLimiter = ratelimit({
  windowsMs: 60 * 1000, //[ms]
  max: 5, // 5 Login requests from a single IP per window
  message: {
    messsage:
      "Too many login attempts from this IP, please try again in 1 minute",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too many requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // Return rate limit info in the "RateLimit-*" headers
  legacyHeaders: false, // Disable the "X-RateLimit-*" headers
});

module.exports = loginLimiter;
