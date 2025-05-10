const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const messageQuery = {
  getMessages: asyncHandler(async (req, res) => {
    const getMessages = await Message.find();
    res.send(getMessages);
  }),
  createMessage: asyncHandler(async (req, res) => {
    const { senderId, receiverId, text } = req.body;
    const message = await Message.create({
      senderId,
      receiverId,
      text,
    });
    res.status(201).json(message);
  }),
  getSpecificMessages: asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });
    res.status(200).json(messages);
  }),
  deleteMessage: asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findByIdAndDelete(messageId);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    } else {
      res.status(200).json({ message: "Message deleted successfully" });
    }
  }),
  updateMessage: asyncHandler(async (req, res) => {
    const { messageId } = req.params;
    const { text } = req.body;
    const message = await Message.findByIdAndUpdate(
      messageId,
      { text },
      { new: true }
    );
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    } else {
      res.status(200).json(message);
    }
  }),
};

module.exports = messageQuery;
