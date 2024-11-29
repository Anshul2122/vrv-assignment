import { Router } from "express";
import {
    getNoteById,
    createNote,
    getUserNotes,
    updateNote,
    deleteNote
    } from "../controllers/note.controller";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {isAdmin, isModerator} from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/note").post(createNote);
router.route("/").get(isAdmin, isModerator,getUserNotes);
router.route("/:noteId").get(getNoteById).delete(isAdmin, isModerator,deleteNote).patch(updateNote);

export default router;