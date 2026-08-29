import { useEffect, useState } from "react";
import { socket, getHelmet, getEvents } from "./api";
import SystemStatus from "./components/SystemStatus";
import AlcoholDetection from "./components/AlcoholDetection";
import CrashDetection from "./components/CrashDetection";
import MapView from "./components/MapView";
import EventLog from "./components/EventLog";
import LiveLocation from "./components/LiveLocation";
import TechBackground from "./components/TechBackground";
import HeroVisual from "./components/HeroVisual";

const HELMET_ID = "H001";

export default function App() {
  const [helmet, setHelmet] = useState(null);
  const [events, setEvents] = useState([]);
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [mobileTab, setMobileTab] = useState("dashboard"); // "dashboard" or "logs"

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Load initial state on mount
  useEffect(() => {
    getHelmet(HELMET_ID)
      .then(setHelmet)
      .catch(() => setHelmet(null)); 
    getEvents(HELMET_ID)
      .then(setEvents)
      .catch(() => setEvents([]));
  }, []);

  // Live updates over WebSocket
  useEffect(() => {
    function onConnect() {
      setSocketConnected(true);
    }
    function onDisconnect() {
      setSocketConnected(false);
    }
    function onState(updatedHelmet) {
      if (updatedHelmet.helmetId === HELMET_ID) setHelmet(updatedHelmet);
    }
    function onEvent(event) {
      if (event.helmetId === HELMET_ID) {
        setEvents((prev) => [event, ...prev].slice(0, 50));
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("helmet:state", onState);
    socket.on("helmet:event", onEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("helmet:state", onState);
      socket.off("helmet:event", onEvent);
    };
  }, []);

  return (
    <div className="h-[100vh] w-screen overflow-hidden flex flex-col">
      <TechBackground />

      {/* Header */}
      <header className="bg-brand-bg/80 backdrop-blur-md border-b border-border-subtle flex justify-between items-center px-4 h-14 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-brand-accent text-2xl">policy</span>
          <div className="flex flex-col">
            <h1 className="font-sans text-m sm:text-base font-bold text-text-primary tracking-widest uppercase leading-none">
              Smart Helmet
            </h1>
            <h2 className="font-mono text-m text-brand-accent tracking-widest uppercase mt-1 leading-none">
              IoT Dashboard
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="font-mono text-xs tracking-widest text-text-primary opacity-80 hidden sm:block">
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </div>
          <div className="w-7 h-7 rounded-full bg-brand-surface border border-border-subtle flex items-center justify-center">
            <span className="material-symbols-outlined text-xs text-brand-accent">person</span>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Tabs (Hidden on Desktop) */}
      <div className="lg:hidden flex border-b border-border-subtle bg-brand-surface/80 backdrop-blur-md shrink-0 z-40">
        <button 
          onClick={() => setMobileTab('dashboard')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${mobileTab === 'dashboard' ? 'text-brand-accent border-b-2 border-brand-accent bg-brand-accent/5' : 'text-text-secondary'}`}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setMobileTab('logs')}
          className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 ${mobileTab === 'logs' ? 'text-brand-accent border-b-2 border-brand-accent bg-brand-accent/5' : 'text-text-secondary'}`}
        >
          Event Logs
          {events.length > 0 && <span className="bg-status-critical text-white rounded-full px-1.5 py-0.5 text-[8px]">{events.length}</span>}
        </button>
      </div>

      {/* Main Content - Flex column on mobile, Grid on desktop */}
      <main className="w-full max-w-[1920px] mx-auto flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 p-2 lg:p-4 relative z-10 overflow-hidden h-full">
        
        {/* TOP/LEFT: Stats panels */}
        <div className={`lg:col-span-3 lg:flex-col gap-3 lg:gap-4 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto shrink-0 lg:h-full lg:pr-1 pb-2 lg:pb-0 custom-scrollbar w-full ${mobileTab === 'logs' ? 'hidden lg:flex' : 'flex'}`}>
          {/* <div className="shrink-0 w-[240px] lg:w-auto"><HeroVisual /></div> */}
          <div className="shrink-0 w-[260px] lg:w-auto"><CrashDetection helmet={helmet} /></div>
          <div className="shrink-0 w-[240px] lg:w-auto"><SystemStatus helmet={helmet} socketConnected={socketConnected} /></div>
          <div className="shrink-0 w-[240px] lg:w-auto"><AlcoholDetection alcohol={helmet?.alcohol} /></div>
          <div className="shrink-0 w-[240px] lg:w-auto"><LiveLocation helmet={helmet} /></div>
        </div>

        {/* CENTER: Map */}
        <div className={`lg:col-span-6 flex-1 lg:h-full w-full rounded-2xl overflow-hidden relative min-h-[250px] shadow-sm ${mobileTab === 'logs' ? 'hidden lg:block' : 'block'}`}>
          <MapView
            lat={helmet?.location?.lat}
            lon={helmet?.location?.lon}
            alert={helmet?.crash ? "CRASH" : helmet?.sos ? "SOS" : null}
            helmetId={HELMET_ID}
          />
        </div>

        {/* BOTTOM/RIGHT: Event Log */}
        <div className={`lg:col-span-3 h-full lg:h-full flex-col overflow-hidden w-full ${mobileTab === 'dashboard' ? 'hidden lg:flex' : 'flex'}`}>
          <EventLog events={events} />
        </div>

      </main>
    </div>
  );
}
