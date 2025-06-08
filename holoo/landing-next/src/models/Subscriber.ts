import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'unsubscribed'],
    default: 'pending'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'landing_page'
  },
  metadata: {
    ip: String,
    userAgent: String
  }
});

// Update lastUpdatedAt on save
subscriberSchema.pre('save', function(next) {
  this.lastUpdatedAt = new Date();
  next();
});

// Prevent mongoose from creating a new model if one already exists
export default mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema); 