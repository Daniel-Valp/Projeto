import { Request, Response } from "express";
import QuizPergunta from "../models/quizzperguntasmodels";
import Quiz from "../models/quizzmodels";


export const criarPergunta = async (req: Request, res: Response) => {
  try {
    const {
      quiz_id,
      pergunta,
      resposta_a,
      resposta_b,
      resposta_c,
      resposta_d,
      resposta_correta: respostaCorretaRaw,
    } = req.body;

    // Conversão segura e restrição do tipo
    const resposta_correta = Number(respostaCorretaRaw) as 1 | 2 | 3 | 4;

    if (
      !quiz_id ||
      !pergunta ||
      !resposta_a ||
      !resposta_b ||
      !resposta_c ||
      !resposta_d ||
      !respostaCorretaRaw
    ) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    if (![1, 2, 3, 4].includes(resposta_correta)) {
      return res.status(400).json({
        message: "Resposta correta deve ser um número entre 1 e 4.",
      });
    }

    const opcoes: Record<1 | 2 | 3 | 4, "A" | "B" | "C" | "D"> = {
  1: "A",
  2: "B",
  3: "C",
  4: "D",
};

const letraCorreta = opcoes[resposta_correta]; // Type: "A" | "B" | "C" | "D"


    const novaPergunta = await QuizPergunta.create({
      quiz_id,
      pergunta,
      resposta_a,
      resposta_b,
      resposta_c,
      resposta_d,
      resposta_correta: letraCorreta,
    });

    res.status(201).json(novaPergunta);
  } catch (error) {
    console.error("Erro ao criar pergunta:", error);
    res.status(500).json({ message: "Erro interno ao criar pergunta." });
  }
};

export const listarQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.findAll();

    // Para cada quiz, buscar a contagem de perguntas
    const quizzesComContagem = await Promise.all(
      quizzes.map(async (quiz: any) => {
        const count = await QuizPergunta.count({
          where: { quiz_id: quiz.id },
        });

        return {
          ...quiz.toJSON(),
          perguntasCount: count,
        };
      })
    );

    res.json(quizzesComContagem);
  } catch (error) {
    console.error("Erro ao listar quizzes:", error);
    res.status(500).json({ message: "Erro ao buscar quizzes." });
  }
};


export const listarPerguntasPorQuiz = async (req: Request, res: Response) => {
  try {
    const quiz_id = req.params.quiz_id;

    const perguntas = await QuizPergunta.findAll({
      where: { quiz_id },
      order: [["criado_em", "ASC"]],
    });

    res.json(perguntas);
  } catch (error) {
    console.error("Erro ao listar perguntas:", error);
    res.status(500).json({ message: "Erro ao buscar perguntas." });
  }
};
