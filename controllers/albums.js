const express = require('express');
const router = express.Router();

const Album = require('../models/album');
const verifyToken = require('../middleware/verify-token');

// POST /albums - Create a new album
router.post('/', verifyToken, async (req, res) => {
  try {
    const { type, albumName, date, description } = req.body;

    // Validate required fields
    if (!type || !albumName || !date) {
      return res.status(400).json({ err: 'Type, album name, and date are required.' });
    }

    // Create album with authenticated user's ID
    const album = await Album.create({
      user: req.user._id,
      type,
      albumName,
      date,
      description: description || '',
    });

    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET /albums Get all albums for authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const albums = await Album.find({ user: req.user._id }).sort({ date: -1 });
    res.json(albums);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET /albums/:albumId Get a specific album
router.get('/:albumId', verifyToken, async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);

    if (!album) {
      return res.status(404).json({ err: 'Album not found.' });
    }

    // Verify the album belongs to the authenticated user
    if (album.user.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    res.json(album);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// PUT /albums/:albumId Update an album
router.put('/:albumId', verifyToken, async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);

    if (!album) {
      return res.status(404).json({ err: 'Album not found.' });
    }

    // Verify the album belongs to the authenticated user
    if (album.user.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    const { type, albumName, date, description } = req.body;

    album.type = type || album.type;
    album.albumName = albumName || album.albumName;
    album.date = date || album.date;
    album.description = description !== undefined ? description : album.description;

    await album.save();

    res.json(album);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// DELETE /albums/:albumId Delete an album
router.delete('/:albumId', verifyToken, async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);

    if (!album) {
      return res.status(404).json({ err: 'Album not found.' });
    }

    // Verify the album belongs to the authenticated user
    if (album.user.toString() !== req.user._id) {
      return res.status(403).json({ err: 'Unauthorized' });
    }

    await album.deleteOne();

    res.json({ message: 'Album deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
