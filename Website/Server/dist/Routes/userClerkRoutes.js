import express from "express";
import { updateUser } from "../Controllers/userClrekController.js";
const router = express.Router();
router.put("/:userId", updateUser);
export default router;
