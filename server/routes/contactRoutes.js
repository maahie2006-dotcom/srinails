import express from "express";
import Contact from "../models/Contact.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// 1. Get unread count for Admin Dashboard
// URL: /api/contacts/admin/unread-count
// backend/routes/contactRoutes.js
// URL: /api/contacts/admin/unread-count
// URL: /api/contacts/admin/unread-count
router.get("/admin/unread-count", protect, adminOnly, async (req, res) => {
  try {
    // 🔥 THE FIX: Count every document where 'reply' is an empty string OR doesn't exist
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
// 2. Send message (Public - from contact page)
router.post("/", async (req, res) => {
  try {
    const msg = await Contact.create({
      ...req.body,
      email: req.body.email.toLowerCase(),
      seenByAdmin: false,
      reply: "", // Ensure it starts empty
      isReadByUser: true 
    });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Get all messages (Admin Only)
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    
    // We mark as seen for the Inbox UI, but Route 1 will still 
    // count them for the Dashboard because reply is still ""
    await Contact.updateMany({ seenByAdmin: false }, { $set: { seenByAdmin: true } });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get messages of logged-in user
router.get("/my-messages/:email", protect, async (req, res) => {
  try {
    const messages = await Contact.find({ email: req.params.email.toLowerCase() })
                                  .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Reply to message (Admin Only)
// ✅ THIS is the only thing that will clear the Dashboard count now
router.put("/reply/:id", protect, adminOnly, async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { 
        reply: req.body.reply,
        isReadByUser: false, // Notifies the customer
        seenByAdmin: true    
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Delete message (Admin Only)
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Inquiry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;