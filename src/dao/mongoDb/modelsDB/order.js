const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const orderSchema = mongoose.Schema({
  title: String,
  price: Number,
  cantidad: Number,
});
orderSchema.plugin(mongoosePaginate);

const OrderModel = mongoose.model("orders", orderSchema);
module.exports = OrderModel;
