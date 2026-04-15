import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// Save message
router.post("/contact", async (req, res) => {
  const newContact = new Contact(req.body);
  await newContact.save();
  res.json({ message: "Message saved" });
});

// Get all messages (for admin)
router.get("/contact", async (req, res) => {
  const data = await Contact.find();
  res.json(data);
});

export default router;