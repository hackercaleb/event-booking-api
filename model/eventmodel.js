const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: String,
  description: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  status: {
    // Don't worry about this for now, we would come back to it later
    type: String,
    enum: ['scheduled', 'cancelled', 'completed'],
    default: 'scheduled'
  }
  // You can add more event-related fields here
});
