import express from "express";
import { salvarResposta, listarRespostasPorQuiz } from "../Controllers/quizzrespostascontroller";

const router = express.Router();

router.post("/quizzes/:quiz_id/respostas", salvarResposta);
router.get("/quizzes/:quiz_id/respostas", listarRespostasPorQuiz);

export default router;
