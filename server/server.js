const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");

// Config .env to
require("dotenv").config({
  path: "./config/config.env",
});

// connect to database
connectDB();

const app = express();

// Config bodyParser
app.use(bodyParser.json());

// Config for only development
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
    })
  );
  app.use(morgan("dev"));
}

//load all routes
app.use("/api/", authRoute);
app.use("/api/", userRoute);
app.use("/api/", postRoute);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page Not Founded",
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`App listening on ${PORT}`));
