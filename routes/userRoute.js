import express from "express";
import {
  deleteUser,
  getAllUser,
  getUserById,
  signin,
  signup,
  updateUser,
} from "../controller/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

export const userRouter = express.Router();

// GET
userRouter.get("/", authMiddleware, getAllUser);
// userRoute.js
userRouter.get("/:id", authMiddleware, getUserById);

// POST
userRouter.post("/signup", signup);
userRouter.post("/signin", signin);

// PUT
userRouter.put("/edit", authMiddleware, updateUser);

// DELETE
userRouter.delete("/", authMiddleware, deleteUser);
