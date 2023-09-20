import express from "express";
import { authenticate } from "./middlewares/authMiddleware.js";
import { rateLimiter } from "./middlewares/rateLimiter.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { login } from "./utils/login.js";
import { registerUser } from "./utils/register.js";
import { getNotes, createNote, getNoteById, updateNote, deleteNote, shareNote, searchNotes } from "./utils/notes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

try {
    const connection = await mongoose.connect(process.env.MONGO_DB);
    console.log(`MongoDB connect: ${connection.connection.host}`);
} catch (error) {
    console.log(error.message);
    process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(rateLimiter);

// SIGN-UP
app.post("/api/auth/signup", (req, res) => {
    registerUser(req, res)
    .then((data) => {
      res.json(data);
    });
});

// LOG-IN
app.post("/api/auth/login", (req, res) => {
    login(req, res)
    .then((data) => {
      res.json(data);
    });
});

// GET ALL NOTES THAT USER CREATED OR HAS READ ACCESS TO
app.get("/api/notes", authenticate, (req, res) => {
    getNotes(req, res)
    .then((data) => {
      res.json(data);
    });
});

// GET NOTE DETAILS THAT USER CREATED OR HAS READ ACCESS TO
app.get("/api/notes/:id", authenticate, (req, res) => {
    getNoteById(req, res)
    .then((data) => {
      res.json(data);
    });
});

// CREATE NOTE
app.post("/api/notes", authenticate, (req, res) => {
    createNote(req, res)
    .then((data) => {
      res.json(data);
    });
});

// UPDATE NOTE DETAILS THAT USER CREATED
app.put("/api/notes/:id", authenticate, (req, res) => {
    updateNote(req, res)
    .then((data) => {
      res.json(data);
    });
});

// DELETE NOTE THAT USER CREATED
app.delete("/api/notes/:id", authenticate, (req, res) => {
    deleteNote(req, res)
    .then((data) => {
      res.json(data);
    });
});

// SHARE NOTE THAT USER CREATED
app.post("/api/notes/:id/share", authenticate, (req, res) => {
    shareNote(req, res)
    .then((data) => {
      res.json(data);
    });
});

// SEARCH FOR TEXT IN NOTES THAT USER CREATED OR HAS READ ACCESS TO
app.get("/api/search", authenticate, (req, res) => {
    searchNotes(req, res)
    .then((data) => {
      res.json(data);
    });
});

app.use((req, res) => {
    res.status(404).send({ message: "Invalid route" });
})

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});