import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, toggleReaction, deleteMessage, markAsSeen } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);
router.patch("/react/:id", protectRoute, toggleReaction);
router.patch("/delete/:id", protectRoute, deleteMessage);
router.patch("/read/:id", protectRoute, markAsSeen);

export default router;
