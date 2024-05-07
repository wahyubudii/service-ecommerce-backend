import expressAsyncHandler from "express-async-handler";
import slugify from "slugify";
import Product from "../models/Product.js";
import {
  validateMongodbId,
  validateRequestBody,
} from "../middleware/errorHandler.js";

export const addProduct = expressAsyncHandler(async (req, res, next) => {
  const { title, description, price, category, brand, quantity, color } =
    req.body;
  const requiredFields = [
    "title",
    "description",
    "price",
    "category",
    "brand",
    "quantity",
    "color",
  ];

  try {
    validateRequestBody(req.body, requiredFields);

    req.body.slug = slugify(title);

    const newProduct = await Product.create({
      title,
      description,
      price,
      category,
      brand,
      quantity,
      color,
      slug: req.body.slug,
    });

    const response = {
      status: 1,
      message: "Successfully create product",
      data: newProduct,
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export const getAllProduct = expressAsyncHandler(async (req, res, next) => {
  try {
    const products = await Product.find().populate({
      path: "ratings.postedby",
      select: "email",
    });

    const response = {
      status: 1,
      message: "",
      data: products,
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export const getProductById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    const product = await Product.findById(id).populate({
      path: "ratings.postedby",
      select: "email",
    });

    const response = {
      status: 1,
      message: "",
      data: product,
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export const addRating = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, prodId, comment } = req.body;

  try {
    const product = await Product.findById(prodId);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        {
          ratings: { $elemMatch: alreadyRated },
        },
        {
          $set: { "ratings.$.star": star, "ratings.$.comment": comment },
        },
        { new: true }
      );
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        prodId,
        {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedby: _id,
            },
          },
        },
        { new: true }
      );
    }
    const getAllRatings = await Product.findById(prodId);
    let totalRating = getAllRatings.ratings.length;
    let ratingSum = getAllRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    let actualRating = Math.round(ratingSum / totalRating);
    let finalProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRating: actualRating,
      },
      {
        new: true,
      }
    );

    const response = {
      status: 1,
      message: "",
      data: finalProduct,
    };

    res.json(response);
  } catch (err) {
    throw new Error(err);
  }
});

export const updateProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    let product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    const response = {
      status: 1,
      message: "Successfully update product",
      data: product,
    };

    res.json(response);
  } catch (err) {
    throw new Error(err);
  }
});

export const deleteProduct = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);

  try {
    let product = await Product.findByIdAndDelete(id);
    const response = {
      status: 1,
      message: "Successfully delete product",
      data: null,
    };

    res.json(response);
  } catch (err) {
    throw new Error(err);
  }
});
