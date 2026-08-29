const mongoose = require("mongoose");

// Full history of every crash/sos/cancel/location/alcohol event ever
// received, for the activity log (GET /api/events/:id) and any future
// analytics. Never overwritten - always appended.
const eventSchema = new mongoose.Schema({
  helmetId: { type: String, required: true, index: true },
  event: {
    type: String,
    required: true,
    enum: ["crash", "sos", "cancel", "location", "alcohol"],
  },
  impact_g: { type: Number, default: null },
  lat: { type: Number, default: null },
  lon: { type: Number, default: null },
  value: { type: Number, default: null },
  status: { type: String, default: null },
  timestamp: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model("Event", eventSchema);