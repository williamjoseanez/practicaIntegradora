const mongoose = require("mongoose");


const main = async () => {
  mongoose
    .connect(
      "mongodb+srv://williamjoseanez:William17735207@cluster0.fpryakl.mongodb.net/ecommerce?retryWrites=true&w=majority"
    )
    .then(() => console.log("conectado a la base de datos mongoDB"))
    .catch((error) => console.error(error));

};

main();