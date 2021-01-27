const express = require("express");
const router = express.Router();
const {
  userController,
  getUserInfoController,
} = require("../controller/userController");

router.post("/user", userController);
router.get("/user", getUserInfoController);

module.exports = router;
