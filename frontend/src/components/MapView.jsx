import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

// Create a custom pulsing HTML icon for live location tracking
const createLiveIcon = (alertType) => {
  const isCritical = alertType === "CRASH" || alertType === "SOS";
  const colorClass = isCritical ? "bg-status-critical" : "bg-brand-accent";
  
  return L.divIcon({
    className: "bg-transparent border-none",
    html: `
      <div class="relative flex items-center justify-center w-10 h-10 -ml-5 -mt-5">
        <div class="absolute inset-0 rounded-full animate-ping opacity-60 ${colorClass}" style="animation-duration: 2s;"></div>
        <div class="absolute inset-2 rounded-full opacity-40 ${colorClass}"></div>
        <div class="relative w-4 h-4 rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,0,0,0.3)] ${colorClass}"></div>
      </div>
    `,
    iconSize: [0, 0], // The HTML handles the sizing and centering via negative margins
    iconAnchor: [0, 0],
    popupAnchor: [0, -12]
  });
};

function Recenter({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lon != null) {
      map.setView([lat, lon], map.getZoom(), { animate: true });
    }
  }, [lat, lon]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

export default function MapView({ lat, lon, alert, helmetId }) {
  const hasLocation = lat != null && lon != null;
  const displayLat = hasLocation ? lat : 20.2961;
  const displayLon = hasLocation ? lon : 85.8245;
  const center = [displayLat, displayLon];
  const liveIcon = createLiveIcon(alert);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-brand-surface">
      <div className="absolute top-4 left-4 z-[400] pointer-events-none">
        <div className="bg-brand-surface/90 border border-border-subtle p-3 rounded backdrop-blur-md shadow-sm">
          <div className="font-mono text-[10px] text-text-secondary uppercase mb-2 tracking-widest border-b border-border-subtle pb-1">
            Live Position
          </div>
          <div className="flex flex-col gap-1 font-mono text-xs text-brand-accent">
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">LAT</span>
              <span className="font-bold">{hasLocation ? lat.toFixed(6) : "WAITING"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">LON</span>
              <span className="font-bold">{hasLocation ? lon.toFixed(6) : "WAITING"}</span>
            </div>
          </div>
        </div>
      </div>

      {!hasLocation && (
        <div className="absolute bottom-4 left-4 z-[400] pointer-events-none">
          <div className="bg-brand-surface/90 border border-status-warning/50 p-2 rounded backdrop-blur-md shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-status-warning text-sm animate-spin">radar</span>
            <span className="font-mono text-[9px] text-status-warning font-bold tracking-widest uppercase">Waiting for GPS...</span>
          </div>
        </div>
      )}

      {/* Subtle radar overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-brand-accent/20 rounded-full z-[399] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-brand-accent/10 rounded-full z-[399] pointer-events-none"></div>

      <MapContainer center={center} zoom={15} style={{ height: "100%", width: "100%", zIndex: 1, background: 'transparent' }} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[displayLat, displayLon]} icon={liveIcon}>
          <Popup>
            <div className="font-mono text-xs">
              <div className="font-bold text-text-primary uppercase border-b border-border-subtle pb-1 mb-1">Helmet {helmetId}</div>
              <div className="text-text-secondary">
                {hasLocation ? `${displayLat.toFixed(5)}, ${displayLon.toFixed(5)}` : "DEFAULT LOCATION"}
              </div>
              {alert && <div className="text-status-critical mt-1 font-bold">{alert}</div>}
            </div>
          </Popup>
        </Marker>
        {hasLocation && <Recenter lat={lat} lon={lon} />}
      </MapContainer>
    </div>
  );
}
