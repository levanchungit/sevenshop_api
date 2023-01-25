import express, { Response } from "express";
import http from "http";
import mongoose from "mongoose";
import userRouter from "routes/user";
import productRouter from "routes/product";
import { config } from "dotenv";
import Log from "library/Log";

const app = express();
config();

/** Connect to Mongo */
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_DB_URL || "", { retryWrites: true, w: "majority" })
  .then(() => {
    Log.success("Mongo connected successfully.");
  })
  .catch((error) => Log.error(error));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* Routes */
app.use("/user", userRouter);
app.use("/product", productRouter);

app.get("/ping", (res: Response) =>
  res.status(200).json({ message: "pong" })
);

// catch 404 and forward to error handler
app.use((req, res) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);

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
