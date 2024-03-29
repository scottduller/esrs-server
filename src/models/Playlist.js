const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  levels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Level',
      required: true,
    },
  ],
},
{ timestamps: true });

// Export the model
module.exports = mongoose.model('Playlist', playlistSchema);
