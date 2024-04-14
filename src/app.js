const express = require("express");
const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const multer = require("multer");
const exphbs = require("express-handlebars");
const PUERTO = 8080;
require("../src/database.js");

const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/user.router");
const sessionRouter = require("./routes/sessions.router.js");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");

const app = express();

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Middleware para servir archivos estáticos (CSS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Middleware para servir archivos CSS con el tipo MIME correcto
app.use(
  ["/carts/css", "/api/users/profile"],
  express.static(path.join(__dirname, "public", "css"), {
    setHeaders: (res, path, stat) => {
      // Establecer el tipo MIME de los archivos CSS como text/css
      if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
    },
  })
);

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(multer({ storage }).single("image"));

app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchado http://localhost:${PUERTO}`);
});

const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);
