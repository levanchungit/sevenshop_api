import express, { Response } from "express";
import mongoose from "mongoose";
import userRouter from "routes/user";
import productRouter from "routes/product";
import authRouter from "routes/auth";
import categoryRouter from "routes/category";
import orderRouter from "routes/order";
import colorRouter from "routes/color";
import sizeRouter from "routes/size";
import cartRouter from "routes/cart";
import ratingRouter from "routes/rating";
import uploadRouter from "routes/upload";
import payRouter from "routes/pay";
import voucherRouter from "routes/voucher";
import dashboardRouter from "routes/dashboard";
import notificationRouter from "routes/notification";
import { config } from "dotenv";
import Log from "libraries/log";
import cors from "cors";
import bodyParser from "body-parser";
import helmet from "helmet";
import nocache from "nocache";
import morgan from "morgan";

const app = express();
config();

const port = process.env.PORT || 3000;

/** Connect to Mongo */
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_DB_URL || "", { retryWrites: true, w: "majority" })
  .then(() => {
    Log.success("Mongo connected successfully.");
  })
  .catch((error) => Log.error(error));

app.use(cors());
// Body parser configuration
// Express 4.0
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

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
app.use("/upload", uploadRouter);
app.use("/pay", payRouter);
app.use("/voucher", voucherRouter);
app.use("/dashboard", dashboardRouter);
app.use("/ratings", ratingRouter);
app.use("/notification", notificationRouter);

app.get("/ping", (req, res: Response) => {
  res.status(200).json({
    message: "pong",
  });
});

// catch 404 and forward to error handler
app.use((req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  Log.success(`Server is running on port ${port}`);
});
