import express from "express";
import { salvarResposta, listarRespostasPorQuiz } from "../Controllers/quizzrespostascontroller";

const router = express.Router();

router.post("/:quiz_id/respostas", salvarResposta);
router.get("/:quiz_id/respostas", listarRespostasPorQuiz);

export default router;
