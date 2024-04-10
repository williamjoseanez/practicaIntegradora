const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../dao/controllers/user.controller.js");
const userController = new UserController();

router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/failedregister" }),
  userController.passportRegister.bind(userController)
);

router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/failedregister" }),
  userController.failedregister.bind(userController)
);

router.get("/failedregister", userController.registeFailed);

module.exports = router;
