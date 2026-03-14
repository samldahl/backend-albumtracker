// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 3001
const logger = require('morgan');

// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./middleware/test-jwt');
const usersRouter = require('./controllers/users');
const albumsRouter = require('./controllers/albums');
const songsRouter = require('./controllers/songs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/users', usersRouter);
app.use('/albums/:albumId/songs', songsRouter);
app.use('/albums', albumsRouter);

// Start the server and listen on port 3000
app.listen(process.env.PORT, () => {
  console.log('The express app is ready!');
});


app.listen( || 3001, ...)
