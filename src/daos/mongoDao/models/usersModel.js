import mongoose from "mongoose";

const UsersSchema = mongoose.Schema({
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
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    default: 0,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
    unique: true,
    required: true,
  },
  role: {
    type: String,
    default: "User",
  },
  tickets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tickets",
    },
  ],
  last_connection: {
    type: Date,
    default: Date.now(),
  },
});

export const UsersModel = mongoose.model('Users', UsersSchema)