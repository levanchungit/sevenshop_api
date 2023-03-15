import express, { Response } from "express";
import http from "http";
import mongoose from "mongoose";
import userRouter from "routes/user";
import productRouter from "routes/product";
import authRouter from "routes/auth";
import categoryRouter from "routes/category";
import orderRouter from "routes/order";
import colorRouter from "routes/color";
import sizeRouter from "routes/size";
import cartRouter from "routes/cart";
import { config } from "dotenv";
import Log from "libraries/log";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import nocache from "nocache";
import morgan from "morgan";

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

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(helmet());
app.use(nocache());

/* Routes */
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/auth", authRouter);
app.use("/colors", colorRouter);
app.use("/sizes", sizeRouter);
app.use("/orders", orderRouter);
app.use("/carts", cartRouter);

app.get("/ping", (req, res: Response) => {
  res.status(200).json({
    message: "pong",
  });
});

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
  .listen(process.env.PORT || 3000, () =>
    Log.success(`Server is running on port ${process.env.PORT}`)
  )
  .on("error", () => {
    Log.error("Port is already in use. Trying another port.");
    const port = parseInt(process.env.PORT as string) + 1;
    http
      .createServer(app)
      .listen(port, () => Log.success(`Server is running on port ${port}`));
  });
