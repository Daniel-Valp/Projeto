import { Request, Response } from "express";
import Quiz from "../models/quizzmodels";
import { Sequelize } from "sequelize";
import QuizPergunta from "../models/quizzperguntasmodels";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { getEligibleUsers } from "../utils/getEligibleUsers";
import { sendEmail } from "../utils/sendemail";
import { getAuth } from "@clerk/express";

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
    const updateData = { ...req.body };

    const quiz = await Quiz.findByPk(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz não encontrado" });
    }

const estadoAnterior = quiz.getDataValue("status") as string;
const estadoNovo = updateData.status;


    // Atualiza o quiz
    await quiz.update(updateData);


    // Verifica se mudou para "publicado"
    if (
      typeof estadoNovo === "string" &&
      typeof estadoAnterior === "string" &&
      estadoNovo.toLowerCase() === "publicado" &&
      estadoAnterior.toLowerCase() !== "publicado"
    ) {
      console.log(`🚀 Quiz ${id} publicado, enviando notificações...`);

      // Pega utilizadores que querem notificações de quiz
      const users = await getEligibleUsers("quiz");

      const professorEmail = quiz.getDataValue("professor_email") as string;
let professornome = "Professor desconhecido";

try {
  const professor = await clerkClient.users.getUserList({
    emailAddress: [professorEmail],
  });

  if (professor.length > 0) {
    const user = professor[0];
    professornome = user.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user.username || "Professor";
  }
} catch (e) {
  console.warn(`⚠️ Não foi possível obter nome do professor ${professorEmail}:`, e);
}


      const dataPublicacao = new Date().toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
          <h2 style="color: #2c3e50; text-align: center;">🧠 Novo Quiz Publicado</h2>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />

          <p><strong>📌 Título:</strong> ${quiz.getDataValue("titulo")}</p>
          <p><strong>👤 Criador:</strong> ${professorEmail}</p>
          <p><strong>📅 Publicado em:</strong> ${dataPublicacao}</p>

          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
          <p style="text-align: center; color: #888;">Esta é uma notificação automática sobre novos quizzes disponíveis na plataforma.</p>
          <p style="text-align: center; color: #888;">Para parar de receber emails, desative esta opção nas definições da sua conta.</p>
        </div>
      `;

      await Promise.allSettled(
        users.map(user =>
          sendEmail(
            user.emailAddresses[0].emailAddress,
            "🧠 Novo quiz publicado!",
            emailHtml
          )
        )
      );

      console.log("📧 Notificações de quiz enviadas com sucesso.");
    }

    res.json(quiz);
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

import QuizResposta from "../models/quizzrespostasmodels";

export const getQuizStatistics = async (req: Request, res: Response) => {
  try {
    const quizId = req.params.id;

    // Verifica se o quiz existe
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz não encontrado." });
    }

    // Obter perguntas do quiz
    const perguntas = await QuizPergunta.findAll({
      where: { quiz_id: quizId },
      raw: true,
    });

    const respostas = await QuizResposta.findAll({
      where: { quiz_id: quizId },
      raw: true,
    });

    if (!respostas.length) {
      return res.status(200).json({
        totalTentativas: 0,
        mediaPontuacao: 0,
        perguntasMaisErradas: [],
      });
    }

    const totalTentativas = respostas.length;
    const totalPontuacao = respostas.reduce((acc, r) => acc + (r.pontuacao || 0), 0);
    const mediaPontuacao = totalPontuacao / totalTentativas;

    // Inicializa contadores de erro por pergunta
    const errosPorPergunta: Record<string, { total: number; erradas: number; texto: string }> = {};

    for (const pergunta of perguntas) {
      errosPorPergunta[pergunta.id] = {
        total: 0,
        erradas: 0,
        texto: pergunta.pergunta,
      };
    }

    for (const resposta of respostas) {
      const respostasAluno: Record<string, string> = resposta.respostas || {};


      for (const pergunta of perguntas) {
        const pid = pergunta.id.toString();
        const correta = pergunta.resposta_correta.toLowerCase();
        const respostaAluno = (respostasAluno?.[pid] || "").toLowerCase();

        errosPorPergunta[pid].total += 1;

        if (respostaAluno !== correta) {
          errosPorPergunta[pid].erradas += 1;
        }
      }
    }

    const perguntasMaisErradas = Object.entries(errosPorPergunta)
      .map(([id, dados]) => {
        const taxaErro = Math.round((dados.erradas / dados.total) * 100);
        return {
          pergunta_id: id,
          pergunta: dados.texto,
          taxaErro,
        };
      })
      .sort((a, b) => b.taxaErro - a.taxaErro)
      .slice(0, 5); // Top 5 perguntas com maior erro

    res.json({
      totalTentativas,
      mediaPontuacao: Number(mediaPontuacao.toFixed(2)),
      perguntasMaisErradas,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do quiz:", error);
    res.status(500).json({ message: "Erro ao buscar estatísticas." });
  }
};