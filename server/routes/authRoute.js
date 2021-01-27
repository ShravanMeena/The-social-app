const express = require("express");
const router = express.Router();
const {
  registerController,
  activationController,
  signinController,
  forgotPasswordController,
  resetPasswordController,
  googleController,
  facebookController,
  getSingleUserInfoController,
  followUserController,
  unFollowUserController,
  subscribePostController,
  getAllUsersController,
} = require("../controller/authController");

const {
  userController,
  getUserInfoController,
} = require("../controller/userController");

const {
  validSign,
  validLogin,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../helpers/valid");
const requireLogin = require("../middleware/requireLogin");

router.post("/register", validSign, registerController);
router.post("/activation", activationController);
router.post("/login", validLogin, signinController);
router.post(
  "/password/forget",
  forgotPasswordValidator,
  forgotPasswordController
);
router.post("/password/reset", resetPasswordValidator, resetPasswordController);

router.get("/user/:id", requireLogin, getSingleUserInfoController);
router.get("/user", getAllUsersController);
router.put("/user/follow", requireLogin, followUserController);
router.put("/user/unfollow", requireLogin, unFollowUserController);
router.get("/getsubscriptionpost", requireLogin, subscribePostController);

router.post("/googlelogin", googleController);
router.post("/facebooklogin", facebookController);

router.post("/user", userController);

module.exports = router;
