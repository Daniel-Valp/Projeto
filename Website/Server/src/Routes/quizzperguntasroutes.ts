import express from "express";
import {
  criarPergunta,
  listarPerguntasPorQuiz,
} from "../Controllers/quizzperguntascontroller";

const router = express.Router();

// Criar nova pergunta
router.post("/:quiz_id/perguntas", criarPergunta);

// Listar perguntas de um quiz
router.get("/:quiz_id/perguntas", listarPerguntasPorQuiz);

export default router;
