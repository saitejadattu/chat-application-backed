const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//this is a custom response handler
const sendResponse = (res, status, message) => {
  res.status(status).json({ message });
};
const userQueries = {
  registerUser: asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;
    const isUser = await User.findOne({ email });
    // console.log(isUser);
    if (!isUser) {
      const hashedPass = await bcrypt.hash(password, 10);
      const registerUser = await User({ ...req.body, password: hashedPass });
      const response = await registerUser.save();
      res.status(201).json({
        message: "User created successfully",
        user: response,
      });
    } else {
      res.status(401);
      throw new Error("Email already in use");
    }
  }),
  loginUser: asyncHandler(async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    const isUser = await User.findOne({ email });
    // console.log(isUser);
    if (!isUser) {
      res.status(404);
      throw new Error("incorrect password or email or not found:)");
    }

    const isPassword = await bcrypt.compare(password, isUser.password);
    if (!isPassword) {
      res.status(401);
      throw new Error("incorrect password or email :)");
    }
    const payload = { email: isUser.email, id: isUser._id };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET_KEY);
    sendResponse(res, 200, jwtToken);
  }),
  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);
    if (deleteUser) {
      sendResponse(res, 200, "deleted successful");
    } else {
      res.status(401);
      throw new Error("Your not Authorized to do this action");
    }
  }),
  getUsers: async (req, res) => {
    const users = await User.find();
    res.send(users);
  },
};

module.exports = userQueries;
