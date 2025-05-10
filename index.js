const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const asyncHandler = require("express-async-handler");
const errorHandler = require("./middlewares/errorHandler");
const port = process.env.PORT || 5000;
const Group = require("./models/groupModel");
const GroupMessage = require("./models/groupMessageModel");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
const createConnection = require("./dbConnection");
const userRouter = require("./Routes/userRoute");
const messageRouter = require("./Routes/messageRoute");
const authentication = require("./middlewares/authMiddleware");
createConnection();
app.use("/user", userRouter);
app.use("/messages", messageRouter);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  console.log("user Connected", socket.id);
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });
  socket.on("send_group_created", (data) => {
    io.emit("receive_group_created", data);
  });
  socket.on("send_group_message", (groupMessage) => {
    io.emit("receive_group_message", groupMessage);
  });
  socket.on("disconnect", () => {
    console.log("user Disconnected", socket.id);
  });
});

app.use(errorHandler);

app.get(
  "/groups",
  asyncHandler(async (req, res) => {
    const groups = await Group.find();
    res.status(200).json({ groups });
  })
);
app.post(
  "/groups",
  authentication,
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, description, password } = req.body;
    const group = await Group.create({
      name,
      description,
      password,
      createdBy: res.payload._id,
    });
    res.status(201).json({ group });
  })
);
app.get(
  "/group/:groupId",
  asyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const groupMessages = await GroupMessage.find({ groupId }).populate(
      "senderId",
      "name"
    );
    res.status(200).json({ groupMessages });
  })
);
app.post(
  "/group/:groupId",
  authentication,
  asyncHandler(async (req, res) => {
    const groupId = req.params.groupId;
    const { text } = req.body;
    const groupMessage = await GroupMessage({
      text,
      groupId,
      senderId: res.payload.id,
    }).populate("senderId", "name");
    await groupMessage.save();
    res.status(201).json({ groupMessage });
  })
);
server.listen(port, () => console.log("server is running at port " + port));
