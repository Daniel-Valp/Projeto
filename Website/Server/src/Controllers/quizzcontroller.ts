import { Request, Response } from "express";
import Quiz from "../models/quizzmodels";
import { Sequelize } from "sequelize";
import QuizPergunta from "../models/quizzperguntasmodels";

export const createQuiz = async (req: Request, res: Response) => {
  try {
    const {
      titulo,
      descricao,
      categoria_id,
      subcategoria_id,
      professor_email,
      perguntas,
      status = "rascunho",
    } = req.body;

    console.log("📥 Dados recebidos no corpo da requisição:");
    console.log(JSON.stringify(req.body, null, 2));

    if (!titulo || !categoria_id || !subcategoria_id || !professor_email) {
      return res.status(400).json({ message: "Campos obrigatórios em falta." });
    }

    // Criação do quiz
    const quiz = await Quiz.create({
  titulo,
  descricao,
  categoria_id,
  subcategoria_id,
  professor_email,
  status,
});

const quizId = quiz.getDataValue("id");

console.log("📌 Quiz retornado:", quizId, quiz?.toJSON());


    // Se houver perguntas, processar
    if (Array.isArray(perguntas) && perguntas.length > 0) {
      const mapIndiceParaLetra: Record<string, "A" | "B" | "C" | "D"> = {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
        "A": "A",
        "B": "B",
        "C": "C",
        "D": "D",
      };

      const perguntasTransformadas = perguntas.map((p, index) => {
        const letra = mapIndiceParaLetra[p.resposta_correta];

        if (!letra) {
          throw new Error(
            `Resposta correta inválida na pergunta ${index + 1}. Deve ser 1–4 ou A–D.`
          );
        }

        return {
          pergunta: p.pergunta,
          resposta_a: p.resposta_a,
          resposta_b: p.resposta_b,
          resposta_c: p.resposta_c,
          resposta_d: p.resposta_d,
          resposta_correta: letra,
          quiz_id: quizId,
        };
      });

      console.log("📝 Perguntas transformadas para inserção:");
      console.log(JSON.stringify(perguntasTransformadas, null, 2));

      await QuizPergunta.bulkCreate(perguntasTransformadas);

      console.log("✅ Perguntas inseridas no banco de dados.");
    } else {
      console.log("⚠️ Nenhuma pergunta recebida no payload.");
    }

    res.status(201).json({ quiz });
  } catch (error) {
    console.error("❌ Erro ao criar quiz:", error);
    res.status(500).json({ message: "Erro interno ao criar quiz." });
  }
};





export const getQuizzes = async (req: Request, res: Response) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: QuizPergunta,
          as: "perguntas",
          attributes: [], // não retorna os dados das perguntas
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn("COUNT", Sequelize.col("perguntas.id")),
            "perguntasCount",
          ],
        ],
      },
      group: ["Quiz.id"],
    });

    res.json(quizzes);
  } catch (error) {
    console.error("Erro ao buscar quizzes:", error);
    res.status(500).json({ message: "Erro ao buscar quizzes." });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        {
          model: QuizPergunta,
          as: "perguntas",
        },
      ],
    });

    if (!quiz)
      return res.status(404).json({ message: "Quiz não encontrado" });

    res.json(quiz);
  } catch (error) {
    console.error("Erro ao buscar quiz:", error);
    res.status(500).json({ message: "Erro ao buscar quiz" });
  }
};


export const updateQuiz = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const [updated] = await Quiz.update(req.body, { where: { id } });

    if (updated) {
      const quiz = await Quiz.findByPk(id);
      res.json(quiz);
    } else {
      res.status(404).json({ message: "Quiz não encontrado" });
    }
  } catch (error) {
    console.error("Erro ao atualizar quiz:", error);
    res.status(500).json({ message: "Erro ao atualizar quiz" });
  }
};

export const deleteQuiz = async (req: Request, res: Response) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz não encontrado" });

    await quiz.destroy();
    res.status(200).json({ message: "Quiz deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar quiz:", error);
    res.status(500).json({ message: "Erro ao deletar quiz" });
  }
};
