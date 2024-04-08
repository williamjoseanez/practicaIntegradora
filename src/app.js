// empezamos importando
const express = require("express");
const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const multer = require("multer");
const exphbs = require("express-handlebars"); // motor de plantilla handlebars
const PUERTO = 8080; // creo  puerto
require("../src/database.js");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/user.router");
const sessionRouter = require("./routes/sessions.router.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

const app = express(); // creamos app

// configuro en moto de plantillas handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views"); // defino el directorio donde se encuentran las vistas

// creo midlewares
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      ttl: parseInt(process.env.SESSION_TTL) || 90,
    }),
  })
);

// configuro multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(multer({ storage }).single("image"));

// routing desde routes handlebars
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// pongo a escuchar al segvidor
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchado http://localhost:${PUERTO}`);
});

//Login
app.get("/login", (req, res) => {
  let user = req.query.user;

  req.session.user = user;
  res.send("Guardamos el User por medio de Query");
});

//Usuario
app.get("/user", (req, res) => {
  if (req.session.user) {
    return res.send(`El usuario registrado es: ${req.session.user}`);
  }
  res.send("No tenemos un usuario registrado");
});

///Websockets:
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);
