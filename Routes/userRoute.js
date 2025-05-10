const express = require("express");
const router = express.Router();
const userQueries = require("../controllers/userController");
const authentication = require("../middlewares/authMiddleware")
router.get("/users", userQueries.getUsers);
router.post("/register", userQueries.registerUser);
router.post("/login", userQueries.loginUser);
router.delete("/delete/:id",authentication, userQueries.deleteUser);
module.exports = router;
