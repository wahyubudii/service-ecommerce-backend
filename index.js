import express from "express";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import { dbConnect } from "./config/dbConnect.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { userRouter } from "./routes/userRoute.js";
import { productRouter } from "./routes/productRoute.js";

// PORT
const port = process.env.PORT || 5000;

// EXPRESS INIT
const app = express();

app.use(cors());
app.options("*", cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// DATABASE CONNECT
dbConnect();

// API ROUTE HANDLER
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/", (req, res) => {
  res.json({ message: "Hello ECOMMERCE DEMO" });
});

// ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

// LISTENING SERVER
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
