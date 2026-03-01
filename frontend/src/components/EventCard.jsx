import React from 'react';

const EventCard = ({ event, onGetTickets }) => {
    const { title, dateString, venueName, sourceWebsite, description, imageUrl, status } = event;

    // Modern Date Formatting (If it maps perfectly to an ISO string, else we rely on string)
    const displayDate = new Date(dateString).toString() !== 'Invalid Date'
        ? new Date(dateString).toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : dateString;

    return (
        <div className="glass-panel" style={{
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer',
            height: '100%'
        }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 240, 255, 0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

            {/* Event Image */}
            <div style={{ width: '100%', height: '200px', backgroundColor: '#1a1f33', position: 'relative' }}>
                {imageUrl ? (
                    <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                        No Image
                    </div>
                )}
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                    {sourceWebsite}
                </div>
                {status === 'new' && (
                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'var(--accent-coral)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', color: '#fff', fontWeight: 'bold' }}>
                        NEW
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: '1.4' }}>{title}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-cyan)', fontSize: '0.9rem' }}>
                    <span>📅</span> <span>{displayDate}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>📍</span> <span>{venueName}</span>
                </div>

                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '20px', flexGrow: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {description || 'Join us for this amazing event in Sydney! Connect, enjoy, and experience the best vibes the city has to offer.'}
                </p>

                <button className="btn-primary" style={{ width: '100%' }} onClick={() => onGetTickets(event)}>
                    GET TICKETS
                </button>
            </div>
        </div>
    );
};

export default EventCard;
