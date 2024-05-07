import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  addProduct,
  addRating,
  deleteProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controller/productController.js";

export const productRouter = express.Router();

// GET
productRouter.get("/", getAllProduct);
productRouter.get("/:id", getProductById);

// POST
productRouter.post("/", authMiddleware, addProduct);

// PUT
productRouter.put("/rating", authMiddleware, addRating);
productRouter.put("/:id", authMiddleware, updateProduct);

// DELETE
productRouter.delete("/:id", authMiddleware, deleteProduct);
