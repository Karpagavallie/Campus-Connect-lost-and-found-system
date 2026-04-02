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

    // lost or found
    type: {
      type: String,
      enum: ["lost", "found"],
      required: true
    },

    // ✅ updated status enum (FIXED)
    status: {
      type: String,
      enum: ["active", "matched", "closed"],
      default: "active"
    },

    // who posted the item
    userName: {
      type: String,
      required: true
    },

    userEmail: {
      type: String,
      required: true
    },

    // who found the item
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