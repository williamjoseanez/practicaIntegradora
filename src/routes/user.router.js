const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../dao/controllers/user.controller.js");
const userController = new UserController();


router.post("/login", userController.login);

router.get("/profile", passport.authenticate("jwt", { session: false }), userController.profile);

router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/failedregister" }),
  userController.register.bind(userController)
);

router.get("/failedregister", (req, res) => {
  res.status(400).send({ error: "Registro fallido" });
});


module.exports = router;
