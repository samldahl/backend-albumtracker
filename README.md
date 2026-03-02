# Backend Album Tracker

A RESTful API backend for managing music albums and songs with user authentication.

## Features

- User authentication with JWT tokens
- User registration and login
- Album management (CRUD operations)
- Song tracking per album with track numbers
- Protected routes requiring authentication
- MongoDB database with Mongoose ODM

## Data Models

### User
- `email` (unique, required)
- `name` (required)
- `hashedPassword` (required, hidden from JSON responses)

### Album
- `user` (reference to User, required)
- `type` (String, required)
- `albumName` (required)
- `date` (Date, required)
- `description` (optional)
- Timestamps (createdAt, updatedAt)

### Song
- `album` (reference to Album, required)
- `user` (reference to User, required)
- `songName` (required)
- `trackNumber` (required, unique per album)
- `notes` (optional)
- Timestamps (createdAt, updatedAt)

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```plaintext
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/albumtracker?retryWrites=true
JWT_SECRET=your_secret_key_here
```

4. Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3001`
