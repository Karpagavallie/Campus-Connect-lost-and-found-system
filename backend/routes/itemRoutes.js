const express = require("express");
const router = express.Router();
const Item = require("../models/Item");


// ================= MATCH FUNCTION =================
function isMatch(lost, found) {
  const lostName = lost.itemName.toLowerCase();
  const foundName = found.itemName.toLowerCase();

  return (
    lostName.includes(foundName) ||
    foundName.includes(lostName)
  );
}


// ================= REPORT LOST ITEM =================
router.post("/lost", async (req, res) => {
  try {
    const {
      itemName,
      category,
      location,
      date,
      description,
      userName,
      userEmail
    } = req.body;

    if (!itemName || !category || !location || !date || !description || !userName || !userEmail) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const item = new Item({
      itemName,
      category,
      location,
      date,
      description,
      userName,
      userEmail,
      type: "lost",
      status: "active"
    });

    await item.save();

    res.status(201).json({
      message: "Lost item reported successfully",
      item
    });
  } catch (error) {
    console.log("LOST ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= REPORT FOUND ITEM =================
router.post("/found", async (req, res) => {
  try {
    const {
      itemName,
      category,
      location,
      date,
      description,
      userName,
      userEmail
    } = req.body;

    if (!itemName || !category || !location || !date || !description || !userName || !userEmail) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const item = new Item({
      itemName,
      category,
      location,
      date,
      description,
      userName,
      userEmail,
      type: "found",
      status: "active"
    });

    await item.save();

    res.status(201).json({
      message: "Found item reported successfully",
      item
    });
  } catch (error) {
    console.log("FOUND ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET ALL ITEMS =================
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.log("GET ITEMS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= FILTER ITEMS =================
router.get("/filter", async (req, res) => {
  try {
    const { type } = req.query;

    let query = {};
    if (type && type !== "all") {
      query.type = type;
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.log("FILTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET USER ITEMS =================
router.get("/my/:email", async (req, res) => {
  try {
    const items = await Item.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    console.log("MY ITEMS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET MATCHES FOR LOST ITEM =================
router.get("/:id/matches", async (req, res) => {
  try {
    const lostItem = await Item.findById(req.params.id);

    if (!lostItem || lostItem.type !== "lost") {
      return res.status(404).json({ message: "Lost item not found" });
    }

    const foundItems = await Item.find({ type: "found" });

    const matches = foundItems.filter(foundItem =>
      isMatch(lostItem, foundItem)
    );

    res.status(200).json(matches);
  } catch (error) {
    console.log("MATCH ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET ITEM BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.log("GET ITEM BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= UPDATE ITEM =================
router.put("/:id", async (req, res) => {
  try {
    const {
      itemName,
      category,
      location,
      date,
      description
    } = req.body;

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        itemName,
        category,
        location,
        date,
        description
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem
    });
  } catch (error) {
    console.log("UPDATE ITEM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= DELETE ITEM =================
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.log("DELETE ITEM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= MARK LOST ITEM AS FOUND =================
router.put("/:id/found", async (req, res) => {
  try {
    const {
      foundByName,
      foundByEmail,
      foundPlace,
      foundMessage
    } = req.body;

    if (!foundByName || !foundByEmail || !foundPlace) {
      return res.status(400).json({ message: "Finder name, email and place are required" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      {
        status: "found",
        foundByName,
        foundByEmail,
        foundPlace,
        foundMessage: foundMessage || ""
      },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({
      message: "Item marked as found successfully",
      item: updatedItem
    });
  } catch (error) {
    console.log("MARK FOUND ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;