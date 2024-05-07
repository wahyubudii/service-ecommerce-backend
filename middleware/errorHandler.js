import mongoose from "mongoose";

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found : ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: "failed",
    message: err?.message,
    // stack: err?.stack,
  });
};

export const validateMongodbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error("ID not valid or not found");
};

export const validateRequestBody = (reqBody, requiredFields) => {
  const missingFields = [];
  requiredFields.forEach((field) => {
    if (!reqBody.hasOwnProperty(field) || !reqBody[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    const errorMessage = missingFields.join(", ") + " is required";
    throw new Error(errorMessage);
  }
};
