import express from "express";
import Contact from "../models/Contact.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();


router.get("/admin/unread-count", protect, adminOnly, async (req, res) => {
  try {
    
    const count = await Contact.countDocuments({ 
      $or: [
        { reply: "" },
        { reply: { $exists: false } }
      ]
    });
    
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const msg = await Contact.create({
      ...req.body,
      email: req.body.email.toLowerCase(),
      seenByAdmin: false,
      reply: "", 
      isReadByUser: true 
    });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    
    
    await Contact.updateMany({ seenByAdmin: false }, { $set: { seenByAdmin: true } });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/my-messages/:email", protect, async (req, res) => {
  try {
    const messages = await Contact.find({ email: req.params.email.toLowerCase() })
                                  .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/reply/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        reply: req.body.reply,
        isReadByUser: false, 
        seenByAdmin: true    
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;