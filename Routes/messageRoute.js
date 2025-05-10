const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authMiddleware");
const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const messageQuery = require("../controllers/messageController");
// router.get("/messages/:receiverId", authentication, messageQuery.getMessages);
router.get("/", authentication, messageQuery.getMessages);
router.post("/", authentication, messageQuery.createMessage);
router.get(
  "/:senderId/:receiverId",
  authentication,
  messageQuery.getSpecificMessages
);
router.delete("/:messageId", authentication, messageQuery.deleteMessage);
router.put(
  "/:messageId",
  authentication,
  messageQuery.updateMessage
);

module.exports = router;
