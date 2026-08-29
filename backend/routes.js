const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("./db");

module.exports = function (io) {
  const router = express.Router();

  // Make this function async
  async function recordAndBroadcast(helmetId, eventType, payload) {
    const event = {
      id: uuidv4(),
      helmetId,
      event: eventType,
      ...payload,
      timestamp: payload.timestamp || new Date(),
    };
    
    const shouldLog = eventType === "crash" || eventType === "sos" || (eventType === "alcohol" && payload.status === "flagged");
    
    if (shouldLog) {
      await db.addEvent(event); // <-- Add await
    }

    const statePatch = { connected: true };
    if (eventType === "crash") {
      statePatch.crash = true;
      if (payload.lat != null && payload.lon != null) {
        statePatch.location = { lat: payload.lat, lon: payload.lon };
      }
      if (payload.impact_g != null) statePatch.lastImpactG = payload.impact_g;
    }
    if (eventType === "sos") {
      statePatch.sos = true;
      if (payload.lat != null && payload.lon != null) {
        statePatch.location = { lat: payload.lat, lon: payload.lon };
      }
    }
    if (eventType === "cancel") {
      statePatch.crash = false;
      statePatch.sos = false;
    }
    if (eventType === "location") {
      statePatch.location = { lat: payload.lat, lon: payload.lon };
    }
    if (eventType === "alcohol") {
      statePatch.alcohol = {
        value: payload.value,
        status: payload.status || "unknown",
      };
    }

    const helmet = await db.upsertHelmet(helmetId, statePatch); // <-- Add await

    if (shouldLog) {
      io.emit("helmet:event", event);
    }
    io.emit("helmet:state", helmet);

    return { event, helmet };
  }

  function requireHelmetId(req, res) {
    const { helmet_id } = req.body;
    if (!helmet_id) {
      res.status(400).json({ error: "helmet_id is required" });
      return null;
    }
    return helmet_id;
  }

  // Add async to all route handlers
  router.post("/crash", async (req, res) => {
    const helmetId = requireHelmetId(req, res);
    if (!helmetId) return;

    const { impact_g, lat, lon, timestamp } = req.body;
    const { event, helmet } = await recordAndBroadcast(helmetId, "crash", { // <-- Add await
      impact_g,
      lat,
      lon,
      timestamp,
    });
    res.status(201).json({ ok: true, event, helmet });
  });

  router.post("/sos", async (req, res) => {
    const helmetId = requireHelmetId(req, res);
    if (!helmetId) return;

    const { lat, lon, timestamp } = req.body;
    const { event, helmet } = await recordAndBroadcast(helmetId, "sos", { // <-- Add await
      lat,
      lon,
      timestamp,
    });
    res.status(201).json({ ok: true, event, helmet });
  });

  router.post("/cancel", async (req, res) => {
    const helmetId = requireHelmetId(req, res);
    if (!helmetId) return;

    const { timestamp } = req.body;
    const { event, helmet } = await recordAndBroadcast(helmetId, "cancel", { // <-- Add await
      timestamp,
    });
    res.status(201).json({ ok: true, event, helmet });
  });

  router.post("/location", async (req, res) => {
    const helmetId = requireHelmetId(req, res);
    if (!helmetId) return;

    const { lat, lon, timestamp } = req.body;
    if (lat == null || lon == null) {
      return res.status(400).json({ error: "lat and lon are required" });
    }
    const { event, helmet } = await recordAndBroadcast(helmetId, "location", { // <-- Add await
      lat,
      lon,
      timestamp,
    });
    res.status(201).json({ ok: true, event, helmet });
  });

  router.post("/alcohol", async (req, res) => {
    const helmetId = requireHelmetId(req, res);
    if (!helmetId) return;

    const { value, status, timestamp } = req.body;
    const { event, helmet } = await recordAndBroadcast(helmetId, "alcohol", { // <-- Add await
      value,
      status,
      timestamp,
    });
    res.status(201).json({ ok: true, event, helmet });
  });

  // GET endpoints must also be async
  router.get("/helmet/:id", async (req, res) => {
    const helmet = await db.getHelmet(req.params.id);
    if (!helmet) return res.status(404).json({ error: "helmet not found" });
    res.json(helmet);
  });

  router.get("/helmets", async (req, res) => {
    const helmets = await db.getAllHelmets();
    res.json(helmets);
  });

  router.get("/events/:id", async (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 50;
    const events = await db.getEvents(req.params.id, limit);
    res.json(events);
  });

  return router;
};