import express from "express";
import {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from "../Controllers/quizzcontroller";

const router = express.Router();

router.post("/", createQuiz);
router.get("/", getQuizzes);
router.get("/:id", getQuizById);
router.put("/:id", updateQuiz);
router.delete("/:id", deleteQuiz);

import { getQuizStatistics } from "../Controllers/quizzcontroller";

router.get("/:id/estatisticas", getQuizStatistics);


export default router;
