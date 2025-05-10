const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: String,
  description: String,
  password: {
    type: String,
    required: false,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model("Group", GroupSchema);
module.exports = Group;
