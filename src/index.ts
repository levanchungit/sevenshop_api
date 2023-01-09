import express from "express";
import http from "http";
import mongoose from "mongoose";
import userRouter from "routes/user";
const dotenv = require("dotenv");
dotenv.config();
import Log from "library/Log";

const app = express();

/** Connect to Mongo */
mongoose
  .connect(process.env.MONGO_DB_URL || "", { retryWrites: true, w: "majority" })
  .then(() => {
    Log.success("Mongo connected successfully.");
  })
  .catch((error) => Log.error(error));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Routes */
app.use("/user", userRouter);

/** Healthcheck */
app.get("/ping", (req, res, next) =>
  res.status(200).json({ messsage: "pong" })
);

/** Error handling */
app.use((req, res, next) => {
  const error = new Error("Not found");

  Log.error(error);

  res.status(404).json({
    message: error.message,
  });
});

http
  .createServer(app)
  .listen(process.env.BE_PORT, () =>
    Log.success(`Server is running on port ${process.env.BE_PORT}`)
  );
