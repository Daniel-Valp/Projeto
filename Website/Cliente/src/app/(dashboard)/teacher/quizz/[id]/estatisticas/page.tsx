"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const EstatisticasPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [estatisticas, setEstatisticas] = useState<any>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchEstatisticas = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/quizzes/${id}/estatisticas`);
        if (!res.ok) throw new Error("Erro ao carregar estatísticas");

        const data = await res.json();
        setEstatisticas(data);
      } catch (err) {
        console.error("❌ Erro ao buscar estatísticas:", err);
        setErro(true);
      }
    };

    fetchEstatisticas();
  }, [id]);

  if (erro) return <p className="text-red-600 text-center mt-10">Erro ao carregar estatísticas do quiz</p>;
  if (!estatisticas) return <p className="text-gray-600 text-center mt-10">Carregando estatísticas...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold  mb-4" style={{ color: "#025E69" }}>📊 Estatísticas do Quiz</h1>

      <div className="mb-6 space-y-2">
        <p>
  <strong className="text-gray-700">Total de tentativas:</strong>{" "}
  <span className="text-[#025E69] font-semibold">{estatisticas.totalTentativas}</span>
</p>

<p>
  <strong className="text-gray-700">Média de pontuação:</strong>{" "}
  <span className="text-[#025E69] font-semibold">{estatisticas.mediaPontuacao}</span>
</p>

      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-3">❌ Perguntas com maior taxa de erro</h2>
      <ul className="space-y-4">
        {estatisticas.perguntasMaisErradas.map((p: any) => (
          <li
            key={p.pergunta_id}
            className="bg-red-50 border border-red-200 rounded p-4"
          >
            <p className="text-gray-800 font-medium">{p.pergunta}</p>
            <p className="text-sm text-red-600">Taxa de erro: <strong>{p.taxaErro}%</strong></p>
          </li>
        ))}
      </ul>

      <div className="mt-8">
<button
      className="text-white font-medium py-2 px-4 rounded shadow"
      style={{
        backgroundColor: "#025E69",
        transition: "background-color 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#014952")}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#025E69")}
      onClick={() => router.back()}
    >
      Voltar
    </button>

      </div>
    </div>
  );
};

export default EstatisticasPage;
