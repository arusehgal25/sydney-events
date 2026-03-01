import React, { useState } from 'react';
import axios from 'axios';

const LeadModal = ({ event, onClose, onRedirect }) => {
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!event) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Please enter a valid email.');
            return;
        }
        if (!consent) {
            setError('Consent must be provided to proceed.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Basic POST request logic (assume proxy setup or API url config)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            await axios.post(`${apiUrl}/leads`, {
                email,
                consent,
                eventId: event._id,
                eventUrl: event.originalUrl
            });

            // Successfully secured the lead, redirect user to the original platform (Eventbrite etc)
            window.localStorage.setItem('hasSubscribed', true);
            onRedirect(event.originalUrl);
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, padding: '20px'
        }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '40px', position: 'relative' }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 20, right: 20,
                    background: 'transparent', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer'
                }}>
                    &times;
                </button>

                <h2 style={{ marginBottom: '10px', fontSize: '1.8rem' }}>Unlock This Event</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', lineHeight: '1.5' }}>
                    Get the link to tickets and receive weekly curated Sydney events tailored to you.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && <div style={{ color: 'var(--accent-coral)', padding: '10px', border: '1px solid var(--accent-coral)', borderRadius: '8px' }}>{error}</div>}

                    <input
                        type="email"
                        placeholder="Enter your best email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '100%', padding: '15px 20px', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)',
                            color: '#fff', outline: 'none', WebkitAppearance: 'none',
                            fontSize: '1.1rem'
                        }}
                    />

                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-secondary)', fontSize: '0.9rem', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            checked={consent}
                            onChange={(e) => setConsent(e.target.checked)}
                            style={{ marginTop: '4px', transform: 'scale(1.2)', accentColor: 'var(--accent-cyan)' }}
                        />
                        I agree to receive event recommendations globally via email and have read the privacy policy. (You can unsubscribe anytime).
                    </label>

                    <button type="submit" disabled={loading} className="btn-primary" style={{ marginTop: '10px', fontSize: '1.1rem', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Processing...' : 'Send me to Tickets'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LeadModal;
