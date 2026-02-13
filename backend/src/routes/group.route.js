import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createGroup, getGroups, addMember } from "../controllers/group.controller.js";

const router = express.Router();

router.post("/create", protectRoute, createGroup);
router.get("/all", protectRoute, getGroups);
router.post("/add-member", protectRoute, addMember);

export default router;
