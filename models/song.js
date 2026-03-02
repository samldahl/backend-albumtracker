const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  songName: {
    type: String,
    required: true,
  },
  trackNumber: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    default: '',
    trim: true,
  },
}, { timestamps: true });

songSchema.index({ album: 1, trackNumber: 1 }, { unique: true });

module.exports = mongoose.model('Song', songSchema);
