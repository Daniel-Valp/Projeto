import express from "express";
import { updateUser } from "../Controllers/userClrekController"

const router = express.Router();

router.put("/:userId", updateUser);

export default router;