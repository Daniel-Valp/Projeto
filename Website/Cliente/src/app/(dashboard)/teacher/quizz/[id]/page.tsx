"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { useUser } from "@clerk/nextjs";


interface Pergunta {
  id: string;
  pergunta: string;
  resposta_a: string;
  resposta_b: string;
  resposta_c: string;
  resposta_d: string;
  resposta_correta: string;
}

interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  perguntas: Pergunta[];
}

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();


  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      console.log("🔄 Iniciando fetch do quiz com id:", id);
      try {
        const res = await fetch(`http://localhost:5000/api/quizzes/${id}`);
        console.log("📥 Resposta do fetch status:", res.status);

        const data = await res.json();
        console.log("📊 Dados recebidos do backend:", data);

        setQuiz(data);
        console.log("✅ Quiz armazenado no estado:", data);
      } catch (error) {
        console.error("❌ Erro ao buscar quiz:", error);
      } finally {
        setLoading(false);
        console.log("⏳ Loading setado para false");
      }
    };

    fetchQuiz();
  }, [id]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (resultado === null) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [resultado]);

  const handleResposta = (perguntaId: string, letra: string) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaId]: letra,
    }));
  };

  const verificarResultado = async () => {
      console.log("📌 verificarResultado chamada"); // <--- AQUI

  if (!quiz) return;

  let corretas = 0;

  quiz.perguntas.forEach((p) => {
    if (respostas[p.id] === p.resposta_correta) {
      corretas++;
    }
  });

  setResultado(corretas);

  // Enviar resultado para o backend
  try {
  const response = await fetch(`http://localhost:5000/api/quizzes/${quiz.id}/respostas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      aluno_email: user?.emailAddresses?.[0]?.emailAddress || "aluno@anonimo.com",
      respostas,
      resultado: {
        acertos: corretas,
        total: quiz.perguntas.length,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar resultado. Status: ${response.status}`);
  }

  console.log("📨 Resultado enviado com sucesso");
} catch (error) {
  console.error("❌ Erro ao enviar resultado:", error);
}

};


  if (loading) return <p className="p-6 text-white">Carregando quiz...</p>;
  if (!quiz) return <p className="p-6 text-white">Quiz não encontrado.</p>;

  const quizConcluido = resultado !== null;

  return (
    <div className="p-6 bg-[#F3F7F5] min-h-screen space-y-6 text-white">
      <Header
        title={quiz.titulo}
        subtitle="Responda ao Quiz"
        rightElement={
          <Button
  variant="outline"
className="border border-[#25262f] text-[#25262f] hover:bg-[#4FA6A8] hover:text-white"
  disabled={!quizConcluido}
  onClick={() => {
    if (quizConcluido) router.push("/teacher/quizz");
  }}
>
  Voltar
</Button>

        }
      />

      <p className="text-[#24272f]">{quiz.descricao}</p>

      <div className="space-y-6">
        {quiz.perguntas?.map((p, index) => {
          const respostaSelecionada = respostas[p.id];
          const correta = p.resposta_correta;

          return (
            <div key={p.id} className="bg-gray-800 p-4 rounded-lg">
              <p className="font-semibold mb-2">
                {index + 1}. {p.pergunta}
              </p>
              <div className="space-y-2">
                {(["A", "B", "C", "D"] as const).map((letra) => {
                  const texto =
                    p[`resposta_${letra.toLowerCase()}` as keyof Pergunta];
                  const isSelecionada = respostaSelecionada === letra;
                  const isCorreta = correta === letra;

                  let icone = null;
                  let estiloTexto = "";

                  if (quizConcluido) {
                    if (isCorreta) {
                      icone = <span className="ml-2 text-green-400">✅</span>;
                      estiloTexto = "text-green-400";
                    } else if (isSelecionada && !isCorreta) {
                      icone = <span className="ml-2 text-red-500">❌</span>;
                      estiloTexto = "text-red-400";
                    }
                  }

                  return (
                    <label
                      key={letra}
                      className={`block flex items-center ${
                        quizConcluido && isCorreta
                          ? "bg-green-900"
                          : quizConcluido && isSelecionada && !isCorreta
                          ? "bg-red-900"
                          : ""
                      } p-2 rounded-md`}
                    >
                      <input
                        type="radio"
                        name={p.id}
                        value={letra}
                        checked={respostaSelecionada === letra}
                        onChange={() => handleResposta(p.id, letra)}
                        className="mr-2"
                        disabled={quizConcluido}
                      />
                      <span className={estiloTexto}>
                        {letra} {texto}
                      </span>
                      {icone}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!quizConcluido && (
  <Button
  onClick={verificarResultado}
  className="mt-6 bg-[#025E69] hover:bg-[#4FA6A8] text-[#FFFFFF]"
>
  Ver Resultado
</Button>

)}


      {quizConcluido && (
        <p className="text-lg font-bold mt-4 text-[#25262f]">
          ✅ Acertou {resultado} de {quiz.perguntas.length} perguntas.
        </p>
      )}
    </div>
  );
}
