const mongoose = require("mongoose");

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI || "mongodb://localhost:27017/smart-helmet";
    await mongoose.connect(uri);
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Schemas
const helmetSchema = new mongoose.Schema({
  helmetId: { type: String, required: true, unique: true },
  connected: { type: Boolean, default: false },
  crash: { type: Boolean, default: false },
  sos: { type: Boolean, default: false },
  location: {
    lat: Number,
    lon: Number
  },
  lastImpactG: Number,
  alcohol: {
    value: Number,
    status: String
  },
  lastUpdated: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  helmetId: { type: String, required: true },
  event: { type: String, required: true },
  impact_g: Number,
  lat: Number,
  lon: Number,
  value: Number,
  status: String,
  timestamp: { type: Date, default: Date.now }
});

const Helmet = mongoose.model("Helmet", helmetSchema);
const Event = mongoose.model("Event", eventSchema);

// DB Methods (Now Asynchronous)
const addEvent = async (eventData) => {
  const event = new Event(eventData);
  return await event.save();
};

const upsertHelmet = async (helmetId, statePatch) => {
  statePatch.lastUpdated = new Date();
  return await Helmet.findOneAndUpdate(
    { helmetId },
    { $set: statePatch },
    { new: true, upsert: true }
  );
};

const getHelmet = async (helmetId) => {
  return await Helmet.findOne({ helmetId });
};

const getAllHelmets = async () => {
  return await Helmet.find({});
};

const getEvents = async (helmetId, limit = 50) => {
  return await Event.find({ helmetId })
    .sort({ timestamp: -1 })
    .limit(limit);
};

module.exports = {
  connectDB,
  addEvent,
  upsertHelmet,
  getHelmet,
  getAllHelmets,
  getEvents
};