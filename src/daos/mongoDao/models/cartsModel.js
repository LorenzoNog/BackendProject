import mongoose from "mongoose";

const CartsSchema = mongoose.Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      price: {
        type: Number,
        default: 1,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

CartsSchema.pre("findOne", function (next) {
  this.populate("products._id");
  next();
});

CartsSchema.pre("find", function (next) {
  this.populate("products._id");
  next();
});

export const CartsModel = mongoose.model('Cart', CartsSchema)