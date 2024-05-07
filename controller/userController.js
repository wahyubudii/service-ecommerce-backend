import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import {
  validateMongodbId,
  validateRequestBody,
} from "../middleware/errorHandler.js";
import { generateToken } from "../config/jwtToken.js";

export const signup = expressAsyncHandler(async (req, res, next) => {
  const { firstname, lastname, email, mobile, password, address, role } =
    req.body;
  const requiredFields = [
    "firstname",
    "lastname",
    "email",
    "mobile",
    "password",
    "address",
  ];

  try {
    validateRequestBody(req.body, requiredFields);

    const existingUser = await User.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });

    if (existingUser) throw new Error("User already registered!");

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstname,
      lastname,
      email,
      mobile,
      password: hashPassword,
      address,
      role: role && role,
    });
    await newUser.save();

    const response = {
      status: 1,
      message: "Successfully create account",
      data: newUser,
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export const signin = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const requiredFields = ["email", "password"];

  try {
    validateRequestBody(req.body, requiredFields);

    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found!");

    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) throw new Error("Invalid password!");

    const response = {
      status: 1,
      message: "",
      data: {
        ...user._doc,
        token: generateToken(user._id),
      },
    };

    res.json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export const getAllUser = expressAsyncHandler(async (req, res, next) => {
  try {
    const users = await User.find();
    const response = {
      status: 1,
      message: "",
      data: users,
    };
    res.json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export const getUserById = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("User not found!");

    const response = {
      status: 1,
      message: "",
      data: user,
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

export const updateUser = expressAsyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { firstname, lastname, email, mobile } = req.body;

  try {
    validateMongodbId(_id);

    const user = await User.findByIdAndUpdate(
      _id,
      {
        firstname: firstname && firstname,
        lastname: lastname && lastname,
        email: email && email,
        mobile: mobile && mobile,
      },
      { new: true }
    );

    const response = {
      status: 1,
      message: "",
      data: user,
    };
    res.json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export const deleteUser = expressAsyncHandler(async (req, res, next) => {
  const { _id } = req.body;

  try {
    validateMongodbId(_id);

    await User.findById(_id);

    const response = {
      status: 1,
      message: "Delete user successfully",
      data: null,
    };
    res.json(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
});
