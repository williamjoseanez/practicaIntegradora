const mongoose = require("mongoose");

// Creamos el esquema del Usuario
const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true, // Ahora este campo es requerido
    index: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true, // Ahora este campo es requerido
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  age: {
    type: Number,
    required: true, // Ahora este campo es requerido
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    // required: true, // Ahora este campo es requerido
  },
  provider: {
    type: String,
    // required: true
  },
  accountId: {
    type: String,
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
