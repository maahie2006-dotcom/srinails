import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// ✅ Send message (from contact page)
router.post("/contact", async (req, res) => {
  try {
    const msg = await Contact.create(req.body);
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all messages (for admin)
router.get("/contact", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Get messages of logged-in user (by email)
router.get("/contact/my-messages/:email", async (req, res) => {
  try {
    const messages = await Contact.find({ email: req.params.email });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Reply to message
router.put("/contact/reply/:id", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { reply: req.body.reply },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;