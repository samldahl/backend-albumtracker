const express = require('express');
const router = express.Router({ mergeParams: true });

const Song = require('../models/song');
const Album = require('../models/album');
const verifyToken = require('../middleware/verify-token');

// POST /albums/:albumId/songs - Create a new song
router.post('/', verifyToken, async (req, res) => {
  try {
    const { albumId } = req.params;
    const { songName, trackNumber, notes } = req.body;

    // Validate required fields
    if (!songName || trackNumber === undefined) {
      return res.status(400).json({ err: 'Song name and track number are required.' });
    }

    // Verify album exists and belongs to user
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ err: 'Album not found.' });
    }

    if (album.user.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    // Create song
    const song = await Song.create({
      album: albumId,
      user: req.user._id,
      songName,
      trackNumber,
      notes: notes || '',
    });

    res.status(201).json(song);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET /albums/:albumId/songs - Get all songs for an album
router.get('/', verifyToken, async (req, res) => {
  try {
    const { albumId } = req.params;

    // Verify album exists and belongs to user
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ err: 'Album not found.' });
    }

    if (album.user.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    // Get all songs for this album, sorted by track number
    const songs = await Song.find({ album: albumId }).sort({ trackNumber: 1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET /albums/:albumId/songs/:songId - Get a specific song
router.get('/:songId', verifyToken, async (req, res) => {
  try {
    const { albumId, songId } = req.params;

    // Verify album exists and belongs to user
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ err: 'Album not found.' });
    }

    if (album.user.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ err: 'Song not found.' });
    }

    // Verify song belongs to this album
    if (song.album.toString() !== albumId) {
      return res.status(404).json({ err: 'Song not found in this album.' });
    }

    res.json(song);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// PUT /albums/:albumId/songs/:songId - Update a song
router.put('/:songId', verifyToken, async (req, res) => {
  try {
    const { albumId, songId } = req.params;

    // Verify album exists and belongs to user
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ err: 'Album not found.' });
    }

    if (album.user.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ err: 'Song not found.' });
    }

    // Verify song belongs to this album
    if (song.album.toString() !== albumId) {
      return res.status(404).json({ err: 'Song not found in this album.' });
    }

    const { songName, trackNumber, notes } = req.body;

    song.songName = songName || song.songName;
    song.trackNumber = trackNumber !== undefined ? trackNumber : song.trackNumber;
    song.notes = notes !== undefined ? notes : song.notes;

    await song.save();

    res.json(song);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// DELETE /albums/:albumId/songs/:songId - Delete a song
router.delete('/:songId', verifyToken, async (req, res) => {
  try {
    const { albumId, songId } = req.params;

    // Verify album exists and belongs to user
    const album = await Album.findById(albumId);
    if (!album) {
      return res.status(404).json({ err: 'Album not found.' });
    }

    if (album.user.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ err: 'Song not found.' });
    }

    // Verify song belongs to this album
    if (song.album.toString() !== albumId) {
      return res.status(404).json({ err: 'Song not found in this album.' });
    }

    await song.deleteOne();

    res.json({ message: 'Song deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
