const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: ["lost", "found"],
      required: true
    },

    status: {
      type: String,
      enum: ["active", "found", "closed"],
      default: "active"
    },

    // 🔥 who posted the item
    userName: {
      type: String,
      required: true
    },

    userEmail: {
      type: String,
      required: true
    },

    // 🔥 NEW: who found the item
    foundByName: {
      type: String,
      default: ""
    },

    foundByEmail: {
      type: String,
      default: ""
    },

    foundPlace: {
      type: String,
      default: ""
    },

    foundMessage: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Item", itemSchema);