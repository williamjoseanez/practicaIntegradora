
class SessionController {
  //////////current
 async current(req, res) {
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ status: "error", message: "sin sesion activa" });
  }
}
  //Logout - GET
  async logout(req, res) {
    try {
      if (req.session.login) {
        req.session.destroy();
      }
      res.redirect("/login");
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async faillogin(req, res) {
    res.json({ message: "fallo la estrategia" });
  }

 
}

module.exports = SessionController;
