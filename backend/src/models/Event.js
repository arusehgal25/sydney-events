import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dateTime: { type: Date, required: true },
    venueName: { type: String, required: true },
    address: { type: String, default: null },
    city: { type: String, required: true, index: true },
    description: { type: String },
    categories: [{ type: String }],
    imageUrl: { type: String },
    sourceWebsite: { type: String, required: true },
    originalUrl: { type: String, required: true, unique: true },
    dataHash: { type: String, required: true },
    status: {
        type: String,
        enum: ['new', 'updated', 'inactive', 'imported'],
        default: 'new'
    },
    lastScrapedAt: { type: Date, default: Date.now },
    importedAt: { type: Date },
    importedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    importNotes: { type: String }
}, { timestamps: true });

EventSchema.index({ city: 1, status: 1, dateTime: 1 });
EventSchema.index({ title: 'text', description: 'text', venueName: 'text' });

export default mongoose.model('Event', EventSchema);
