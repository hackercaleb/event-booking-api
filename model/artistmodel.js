const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  genre: [
    {
      type: String,
      required: true
    }
  ],
  bio: String
  // You can add more artist-related fields here
});
