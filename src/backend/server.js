const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authToken = require("./middleware/authToken")
const mongoSanitize = require("express-mongo-sanitize")
const xssClean = require("xss-clean")

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(mongoSanitize());
app.use(xssClean());
app.use(cookieParser());
const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const clubRouter = require("./routes/clubRoutes");
const userRouter = require("./routes/userRoutes");

app.use("/club", clubRouter);
app.use("/user", userRouter);
app.use(authToken);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
