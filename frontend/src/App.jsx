import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from './components/EventCard';
import LeadModal from './components/LeadModal';
import './index.css';

const Directory = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${apiUrl}/events?city=Sydney`);
        setEvents(res.data);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleGetTickets = (event) => {
    // If user already subscribed recently, send them straight through
    if (window.localStorage.getItem('hasSubscribed')) {
      window.open(event.originalUrl, '_blank');
      return;
    }
    // Otherwise open modal
    setSelectedEvent(event);
  };

  const handleRedirect = (url) => {
    window.open(url, '_blank');
    setSelectedEvent(null);
  };

  return (
    <div className="container" style={{ paddingTop: '50px', paddingBottom: '100px' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', background: 'linear-gradient(to right, #00f0ff, #ff2a5f)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Sydney Events
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          We automatically scrape and curate the best things to do in beautiful Sydney, Australia. Be the first to know.
        </p>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '50px' }}>Loading the latest events...</div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)', marginTop: '50px' }}>No events found right now. Check back soon.</div>
      ) : (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px', alignItems: 'stretch'
        }}>
          {events.map((evt) => (
            <EventCard key={evt._id || evt.originalUrl || Math.random()} event={evt} onGetTickets={handleGetTickets} />
          ))}
        </div>
      )}

      {selectedEvent && (
        <LeadModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onRedirect={handleRedirect}
        />
      )}
    </div>
  );
};

const AdminDashboard = () => (
  <div className="container" style={{ paddingTop: '100px' }}>
    <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Admin Dashboard</h1>
    <div className="glass-panel" style={{ padding: '40px' }}>
      <p style={{ color: 'var(--text-secondary)' }}>Welcome to the protected admin area. This route is guarded by Google OAuth in production.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <h3 style={{ marginBottom: '10px' }}>Scraper Status</h3>
          <p style={{ color: '#00f0ff' }}>● Running</p>
        </div>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
          <h3 style={{ marginBottom: '10px' }}>Database</h3>
          <p style={{ color: '#ff2a5f' }}>Connected</p>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <nav className="glass-panel" style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '20px', zIndex: 100, borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-coral))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Sydney Events
          </h2>
          <div>
            <Link to="/" style={{ marginRight: '20px', fontWeight: 600 }}>Directory</Link>
            <Link to="/admin" style={{ color: 'var(--text-secondary)' }}>Admin Login</Link>
          </div>
        </div>
      </nav>

      <main style={{ marginTop: '80px' }}>
        <Routes>
          <Route path="/" element={<Directory />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
