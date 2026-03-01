import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
    email: { type: String, required: true },
    consent: { type: Boolean, required: true },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    eventUrl: { type: String }
}, { timestamps: true });

export default mongoose.model('Lead', LeadSchema);
