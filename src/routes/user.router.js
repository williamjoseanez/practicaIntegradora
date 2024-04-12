const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../dao/controllers/user.controller.js");
const userController = new UserController();



router.post(
  "/",
  passport.authenticate("register", { failureRedirect: "/failedregister" }),
  userController.register.bind(userController)
);

// router.post(
//   "/",
//   passport.authenticate("register", { failureRedirect: "/failedregister" }),
//   userController.failedregister.bind(userController)
// );

// router.get("/failedregister", userController.registeFailed);



// router.post(
//   '/',
//   passport.authenticate('register', {
//     failureRedirect: '/failedregister',
//   }),
//   async (req, res) => {
//     if (!req.user)
//       return res
//         .status(400)
//         .send({ status: 'error', message: 'Credenciales invalidas' });

//     req.session.user = {
//       first_name: req.user.first_name,
//       last_name: req.user.last_name,
//       age: req.user.age,
//       email: req.user.email,
//       role: req.user.role,
//       cart: req.user.cart,
//     };

//     req.session.login = true;

//     res.redirect('/profile');
//   }
// );

// router.get("failedregister", (req,res)=>{
//   res.json({message: "Registro Fallido"})
// });
router.get("/failedregister", (req, res) => {
  res.status(400).send({ error: "Registro fallido" });
});


module.exports = router;
