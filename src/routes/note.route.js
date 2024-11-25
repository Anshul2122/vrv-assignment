import { Router } from "express";
import {
    getNoteById,
    createNote,
    getUserNotes,
    updateNote,
    deleteNote
    } from "../controllers/note.controller";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/note").post(createNote);
router.route("/").get(getUserNotes);
router.route("/:noteId").get(getNoteById).delete(deleteNote).patch(updateNote);