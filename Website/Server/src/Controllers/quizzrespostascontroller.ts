import { Request, Response } from "express";
import QuizResposta from "../models/quizzrespostasmodels";
import QuizPergunta from "../models/quizzperguntasmodels"; // importa o modelo das perguntas


// POST /api/quizzes/:quiz_id/respostas
export const salvarResposta = async (req: Request, res: Response) => {
  try {
    const { quiz_id } = req.params;
    const { aluno_email, respostas } = req.body;

    if (!aluno_email || !respostas) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    // Buscar todas as perguntas do quiz, para pegar as respostas corretas
    const perguntas = await QuizPergunta.findAll({ where: { quiz_id } });

    if (perguntas.length === 0) {
      return res.status(404).json({ message: "Quiz sem perguntas." });
    }

    // Calcular pontuação
    let pontuacao = 0;
    perguntas.forEach((pergunta) => {
      const perguntaId = pergunta.id.toString();
      const respostaAluno = respostas[perguntaId];
      if (respostaAluno && respostaAluno.toLowerCase() === pergunta.resposta_correta.toLowerCase()) {
        pontuacao++;
      }
    });

    // Salvar a resposta com a pontuação calculada
    const novaResposta = await QuizResposta.create({
      quiz_id,
      aluno_email,
      respostas,
      pontuacao,
    });

    res.status(201).json(novaResposta);
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
    res.status(500).json({ message: "Erro interno ao salvar resposta." });
  }
};

// GET /api/quizzes/:quiz_id/respostas
export const listarRespostasPorQuiz = async (req: Request, res: Response) => {
  try {
    const { quiz_id } = req.params;

    const respostas = await QuizResposta.findAll({
      where: { quiz_id },
    });

    res.json(respostas);
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    res.status(500).json({ message: "Erro ao buscar respostas." });
  }
};
