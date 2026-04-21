import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// 1. Define the Schema
const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

// 2. Create the Model
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

// --- ROUTES ---

// @route   POST /api/newsletter/subscribe
// @desc    Public route to join the newsletter (Home Page)
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required 💅" });
  }

  try {
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ message: "You're already a part of the family! 💅" });
    }

    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    res.status(201).json({ message: "Subscribed successfully! ✨" });
  } catch (error) {
    console.error("Newsletter Error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// @route   GET /api/newsletter/subscribers
// @desc    Admin route to see all subscribers for the list
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ subscribedAt: -1 });
    res.status(200).json(subscribers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch subscribers" });
  }
});

// @route   DELETE /api/newsletter/subscribers/:id
// @desc    Admin route to remove a subscriber from the list
router.delete('/subscribers/:id', async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscriber not found" });
    }
    res.status(200).json({ message: "Subscriber removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subscriber" });
  }
});

// @route   POST /api/newsletter/toggle-subscription
// @desc    Sync route for User Account page toggle
router.post('/toggle-subscription', async (req, res) => {
  const { email, isSubscribed } = req.body;

  try {
    if (isSubscribed) {
      // Add to list if not already there
      const existing = await Subscriber.findOne({ email });
      if (!existing) {
        const newSub = new Subscriber({ email });
        await newSub.save();
      }
    } else {
      // Remove from list if they unsubscribed
      await Subscriber.findOneAndDelete({ email });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to sync subscription" });
  }
});

export default router;