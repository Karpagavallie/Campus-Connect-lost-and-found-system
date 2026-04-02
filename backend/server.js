const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================= MongoDB =================
mongoose
  .connect("mongodb://127.0.0.1:27017/lostfoundDB")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ================= Model =================
const Item = require("./models/Item");

// ================= Routes =================
const userRoutes = require("./routes/userRoutes");
const itemRoutes = require("./routes/itemRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/user", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/admin", adminRoutes);

// ================= Test Route =================
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ================= Get Lost Items =================
app.get("/api/lost", async (req, res) => {
  const data = await Item.find({ type: "lost" });
  res.json(data);
});

// ================= Get Found Items =================
app.get("/api/found", async (req, res) => {
  const data = await Item.find({ type: "found" });
  res.json(data);
});

// ================= Match Logic =================
function isMatch(lost, found) {
  return (
    lost.itemName?.toLowerCase() === found.itemName?.toLowerCase()
  );
}

// ================= Get Matches =================
app.get("/api/match", async (req, res) => {
  const lostItems = await Item.find({ type: "lost", status: { $ne: "matched" } });
  const foundItems = await Item.find({ type: "found", status: { $ne: "matched" } });

  let matches = [];

  lostItems.forEach(lost => {
    foundItems.forEach(found => {
      if (isMatch(lost, found)) {
        matches.push({ lost, found });
      }
    });
  });

  res.json(matches);
});

// ================= Email Config =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "karmegammarappan@gmail.com",        // replace
    pass: "xtlv yhky cdpz bfgd"       // replace
  }
});

async function sendEmail(to, subject, text) {
  await transporter.sendMail({
    from: "admin@gmail.com",
    to,
    subject,
    text
  });
}

// ================= Approve Match =================
app.post("/api/approve-match", async (req, res) => {
  try {
    const { lostId, foundId } = req.body;

    const lost = await Item.findById(lostId);
    const found = await Item.findById(foundId);

    if (!lost || !found) {
      return res.status(404).json({ message: "Items not found" });
    }

    lost.status = "matched";
    found.status = "matched";

    await lost.save();
    await found.save();

    // Send emails
    await sendEmail(
      lost.userEmail,
      "Lost Item Found",
      `Your lost item "${lost.itemName}" has been matched.`
    );

    await sendEmail(
      found.userEmail,
      "Found Item Matched",
      `The item you found "${found.itemName}" has been matched.`
    );

    res.json({ message: "Match approved and emails sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= Start Server =================
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});