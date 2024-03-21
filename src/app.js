// empezamos importando
const express = require("express");
const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const socket = require("socket.io");
const ProductManager = require("./dao/fyleSistem/controlles/product-Manager.js");
const products = new ProductManager(
  "./src/dao/fyleSistem/models/products.json"
);
const multer = require("multer");
const MessageModel = require("./dao/mongoDb/modelsDB/message.model.js");
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
const jwt = require("jsonwebtoken");

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
    secret: "secretCoder",
    resave: true,
    saveUninitilized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://williamjoseanez:William17735207@cluster0.fpryakl.mongodb.net/ecommerce?retryWrites=true&w=majority",
      ttl: 90,
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

const io = new socket.Server(httpServer);

// configuro los eventos de socket.io (conection)

io.on("connection", async (socket) => {
  // Envío la lista de productos cuando un cliente se conecta

  //Guardo el Msj en Mongo DB
  socket.on("message", async (data) => {
    await MessageModel.create(data);

    //Obtengo los msj Mongo DB y se los paso al cliente:
    const messages = await MessageModel.find();
    // console.log(messages);

    io.sockets.emit("message", messages);
  });

  const productList = await products.getProducts();
  if (Array.isArray(productList) && productList.length > 0) {
    socket.emit("products", productList);
  } else {
    console.error("Invalid product data:", productList);
  }

  socket.emit("products", productList);

  //Recibo el evento "eliminarProducto"
  socket.on("eliminarProducto", async (id) => {
    await products.deletproduct(id);
    io.sockets.emit("products", products.getProducts());
  });

  //Recibo el evento "agregarProducto"
  socket.on("agregarProducto", async (product) => {
    await products.addProduct(product);
    io.sockets.emit("products", products.getProducts());
  });
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
