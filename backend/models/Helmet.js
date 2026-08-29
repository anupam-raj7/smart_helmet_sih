const mongoose = require("mongoose");

// Stores the "latest state" of a single helmet - overwritten on every
// event, so the dashboard can load a snapshot instantly (GET /api/helmet/:id)
// instead of replaying the full event history every time.
const helmetSchema = new mongoose.Schema(
  {
    helmetId: { type: String, required: true, unique: true, index: true },
    connected: { type: Boolean, default: true },
    crash: { type: Boolean, default: false },
    sos: { type: Boolean, default: false },
    lastImpactG: { type: Number, default: null },
    alcohol: {
      value: { type: Number, default: null },
      status: { type: String, default: "unknown" },
    },
    location: {
      lat: { type: Number, default: null },
      lon: { type: Number, default: null },
    },
    lastUpdate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Helmet", helmetSchema);