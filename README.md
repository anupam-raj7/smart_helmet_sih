# Smart Helmet Dashboard — SIH PS-06

Website portion of the "Low-Cost IoT Smart Helmet for Accident Detection & Rider
Safety" hackathon project. The ESP32 (hardware team) POSTs sensor events to
this backend, which stores them and pushes live updates to the React
dashboard over WebSocket.

```
ESP32 --POST--> Express API --> lowdb (JSON) --> Socket.IO --> React dashboard
```

## Project structure

```
smart-helmet/
├── backend/     Express + Socket.IO REST API
└── frontend/    React + Vite dashboard (map, status cards, alerts)
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Runs on `http://localhost:5000`. Health check: `GET /`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Runs on `http://localhost:5173`. Open it in your browser — you'll see the
dashboard with a **Hardware simulator** panel at the bottom. Use those
buttons to fire fake crash/SOS/location/alcohol events and watch the
dashboard update live, without needing the ESP32 at all. This is what you'll
use to test and demo the software side independently of hardware progress.

## API contract (give this to your hardware teammate)

All endpoints are `POST` with `Content-Type: application/json`, base URL
`http://<your-backend-host>:5000/api`.

| Endpoint | When to send |
|---|---|
| `POST /api/crash` | Accelerometer/gyroscope reads a crash-level g-force spike |
| `POST /api/sos` | Rider manually presses the SOS button |
| `POST /api/cancel` | False-alarm cancel button pressed |
| `POST /api/location` | Periodic GPS heartbeat (e.g. every 5–10s), regardless of crash state |
| `POST /api/alcohol` | MQ-3 / air sensor reading (stretch goal) |

### Payload shapes

```json
// POST /api/crash
{ "helmet_id": "H001", "impact_g": 6.8, "lat": 20.2961, "lon": 85.8245, "timestamp": "2026-08-20T22:32:45Z" }

// POST /api/sos
{ "helmet_id": "H001", "lat": 20.2961, "lon": 85.8245, "timestamp": "2026-08-20T22:33:10Z" }

// POST /api/cancel
{ "helmet_id": "H001", "timestamp": "2026-08-20T22:33:40Z" }

// POST /api/location
{ "helmet_id": "H001", "lat": 20.2961, "lon": 85.8245, "timestamp": "2026-08-20T22:32:00Z" }

// POST /api/alcohol
{ "helmet_id": "H001", "value": 320, "status": "normal", "timestamp": "2026-08-20T22:32:00Z" }
```

Notes:
- `timestamp` is optional — the server stamps its own if omitted.
- `status` on `/api/alcohol` should be `"normal"` or `"flagged"` — send it
  pre-computed from the ESP32, or tell us your sensor's raw value range and
  we'll threshold it server-side instead.
- If GPS has no fix yet, decide together whether to omit `lat`/`lon` entirely
  or send `null` — the dashboard already handles both by showing "Waiting for
  GPS fix…" on the map.

### Read endpoints (used by the dashboard, not the ESP32)

- `GET /api/helmet/:id` — latest state snapshot
- `GET /api/helmets` — all known helmets
- `GET /api/events/:id?limit=50` — recent event history

## Data storage

The backend uses `lowdb` (a JSON file at `backend/data/db.json`) instead of a
full database server — zero setup, works instantly for a hackathon demo. If
you want to swap in MongoDB Atlas later, only `backend/db.js` needs to
change; `routes.js` and the frontend don't touch storage directly.

## Deploying for the live demo

- **Backend** → Render or Railway (free tier supports WebSocket)
- **Frontend** → Vercel or Netlify
- After deploying the backend, update `frontend/.env`'s `VITE_API_URL` to
  the deployed backend URL, then rebuild the frontend.
- Give the hardware team the deployed backend URL to hardcode into the
  ESP32's Arduino sketch.

## What's implemented

- [x] REST endpoints for crash, sos, cancel, location, alcohol
- [x] Live dashboard via WebSocket (Socket.IO)
- [x] Status cards (connection, crash, sos, alcohol)
- [x] Alert banner with "mark as false alarm" cancel button
- [x] Live map (Leaflet + OpenStreetMap, no API key needed)
- [x] Recent activity/event log
- [x] Hardware simulator panel for demoing without the ESP32
