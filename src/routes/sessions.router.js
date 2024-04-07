const express = require("express");
const router = express.Router();
const passport = require("passport");
const SessionController = require("../dao/controllers/session.controller.js");
const sessionController = new SessionController();

// login
router.post("/login", sessionController.login);

//Logout - GET
router.get("/logout", sessionController.logout);

router.get("/faillogin", sessionController.faillogin);

//////////current
router.get("/current", sessionController.current);

///////////////////////////////////////////////VERSION PARA GITHUB

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    //La estrategía de github nos retornará el usuario, entonces lo agregamos a nuestro objeto de session.
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products");
  }
);

// ///////////////////////////VERSION FACEBOOK
router.get("/auth/facebook", passport.authenticate("facebook"));

// callback

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/products",
    failureRedirect: "/login",
  }),
  async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        let { displayName, provider } = req.user;
        res.render("products", { displayName, provider });
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      // Manejo de errores aquí
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
