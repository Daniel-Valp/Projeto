import { Request, Response } from "express";
import QuizResposta from "../models/quizzrespostasmodels";
import QuizPergunta from "../models/quizzperguntasmodels";
import Quiz from "../models/quizzmodels"; // ✅

import { sendEmail } from "../utils/sendemail";

export const salvarResposta = async (req: Request, res: Response) => {
  console.log("📩 [salvarResposta] Requisição recebida");
  console.log("📦 Dados recebidos:", req.body);
  console.log("🧾 Body:", req.body);
  console.log("🆔 Quiz ID:", req.params.quiz_id);

  try {
    const { quiz_id } = req.params;
    const { aluno_email, respostas } = req.body;

    if (!aluno_email || !respostas) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const perguntas = await QuizPergunta.findAll({ where: { quiz_id }, raw: true });

    if (perguntas.length === 0) {
      return res.status(404).json({ message: "Quiz sem perguntas." });
    }

    console.log("🔍 Perguntas encontradas:", perguntas.map(p => ({
      id: p.id,
      correta: p.resposta_correta
    })));

    // Calcular pontuação
    let pontuacao = 0;
    perguntas.forEach(pergunta => {
      const perguntaId = pergunta.id.toString();
      const respostaAluno = respostas[perguntaId];
      if (
        respostaAluno &&
        respostaAluno.toLowerCase() === pergunta.resposta_correta.toLowerCase()
      ) {
        pontuacao++;
      }
    });

    console.log(`✅ Pontuação do aluno ${aluno_email}: ${pontuacao} de ${perguntas.length}`);

    // Salvar resposta no banco
    const novaResposta = await QuizResposta.create({
      quiz_id,
      aluno_email,
      respostas,
      pontuacao,
    });

    console.log("📝 Resposta salva no banco:", novaResposta.toJSON());

    // Buscar quiz diretamente com o model principal
    const quiz = await Quiz.findByPk(quiz_id);

    if (!quiz) {
      console.warn("⚠️ Quiz não encontrado para o ID:", quiz_id);
      return res.status(404).json({ message: "Quiz não encontrado." });
    }

    const professor_email = quiz.get('professor_email') as string | undefined;

    if (professor_email) {
      console.log("📧 Professor encontrado:", professor_email);

      console.log("📘 Quiz recuperado:", {
  id: quiz.get("id"),
  titulo: quiz.get("titulo"),
  professor_email: quiz.get("professor_email"),
});


      const html = `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
    <h2 style="color: #2c3e50; text-align: center;">📘 Resultado do Quiz</h2>
    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
    
    <p><strong>Título do Quiz:</strong> ${quiz.get("titulo") || quiz.titulo}</p>
    <p><strong>Aluno:</strong> ${aluno_email}</p>
    <p><strong>Pontuação final:</strong> <span style="color: green; font-weight: bold;">${pontuacao}</span> de ${perguntas.length}</p>
    <p><strong>Data de Finalização:</strong> ${new Date().toLocaleString("pt-PT", { timeZone: "Europe/Lisbon" })}</p>

    
    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 20px;" />
    <h3 style="color: #34495e;">📋 Detalhamento das Perguntas</h3>
    ${perguntas
      .map((p) => {
        const respostaAluno = respostas[p.id];
        const correta = p.resposta_correta;
        const acertou = respostaAluno === correta;

        return `
          <div style="margin-bottom: 15px; padding: 10px; border-radius: 6px; background-color: ${
            acertou ? "#e8f5e9" : "#fdecea"
          }; border: 1px solid ${acertou ? "#2ecc71" : "#e74c3c"};">
            <p><strong>Pergunta:</strong> ${p.pergunta}</p>
            <p><strong>Resposta do Aluno:</strong> ${respostaAluno} ${
          acertou ? "✅" : "❌"
        }</p>
            <p><strong>Resposta Correta:</strong> ${correta}</p>
          </div>
        `;
      })
      .join("")}

    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
    <p style="text-align: center; color: #888;">Esta é uma mensagem automática do sistema de quizzes.</p>
  </div>
`;



      try {
        console.log("✉️ Preparando envio de e-mail...");
        await sendEmail(
          professor_email,
          `Quiz "${quiz.get("titulo") || quiz.titulo}" finalizado por ${aluno_email}`,
          html
        );
        console.log("✅ E-mail enviado com sucesso!");
      } catch (emailError) {
        console.error("❌ Erro ao enviar o e-mail:", emailError);
      }

    } else {
      console.warn("⚠️ Quiz não possui email de professor associado.");
    }

    res.status(201).json(novaResposta);

  } catch (error) {
    console.error("❌ Erro ao salvar resposta:", error);
    res.status(500).json({ message: "Erro interno ao salvar resposta." });
  }
};




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
