const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
//const apicache = require("apicache");
const compression = require("compression");
const helmet = require("helmet");
const RateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const passport = require("passport");
require("./auth/auth");

// get config vars
dotenv.config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const blogRouter = require("./routes/blog");

const app = express();

//let cache = apicache.middleware;
//app.use(cache("10 minutes")); // cache results for 5 mins

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const dev_db_url =
  "mongodb+srv://bakermel:8aktqQjtPkFmritu@cluster0.hr9mfsm.mongodb.net/blog-api?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// Set up rate limiter: maximum of twenty requests per minute
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);
// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
app.use(logger("dev"));
app.use(compression()); // Compress all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(cors());

// enable CORS pre-flight
app.options("*", cors());

// Use routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/blog", blogRouter);

// Plug in the JWT strategy as a middleware so only verified users can access this route.
app.use("/user", passport.authenticate("jwt", { session: false }), blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ err: err.message });
});

module.exports = app;
