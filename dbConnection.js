const mongoose = require("mongoose");

const createConnection = () => {
  mongoose
    .connect(process.env.URI)
    .then(() => console.log("mongoDB connected successfully"))
    .catch((err) => console.log("error connecting to db", err.message));
};

module.exports = createConnection;
