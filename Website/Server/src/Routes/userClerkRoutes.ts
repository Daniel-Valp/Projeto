import express from "express";
import { updateuser } from "../Controllers/userClrekController.js"

const router = express.Router();

router.patch("/:userId", updateuser)

export default router;