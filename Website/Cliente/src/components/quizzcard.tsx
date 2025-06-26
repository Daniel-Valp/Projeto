"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { FileText, Eye, ListChecks } from "lucide-react";
import { useRouter } from "next/navigation";

interface Quiz {
  id: string;  // muda de number para string, porque seu ID é UUID (string)
  titulo: string;
  descricao: string;
  status?: "publicado" | "rascunho";
  perguntasCount?: number | string; // pode até ser string, pois a API envia como "3"
  categoria?: string;
  subcategoria?: string;
}


interface QuizCardProps {
  quiz: Quiz;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
}

const QuizCard = ({ quiz, onEdit, onDelete }: QuizCardProps) => {
  const router = useRouter();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/teacher/quizz/${quiz.id}`);
  };

  return (
    <Card
  className="group flex flex-col h-full cursor-pointer border rounded-2xl transition-all duration-200 shadow-lg bg-[#25272e]"
  onClick={handleView}
>

      <CardContent className="p-4 space-y-3 flex-grow">
        <CardTitle
  className="text-xl font-bold"
  style={{ color: '#F3F7F5' }} // exemplo: #1A202C é um cinza escuro similar ao gray-800
>
  {quiz.titulo.length > 30 ? `${quiz.titulo.slice(0, 30)}...` : quiz.titulo}
</CardTitle>

{/* Status */}
<div className="flex items-center text-sm gap-2">
  <Eye className="w-4 h-4" style={{ color: '#4FA6A8' }} /> {/* gray-500 */}
  <span style={{ color: '#F3F7F5' }}>Status:</span> {/* gray-700 */}
  <span
    className={`px-2 py-0.5 text-xs font-medium rounded-full`}
    style={{
      backgroundColor:
        quiz.status === "publicado" ? '#DCFCE7' : '#FEE2E2', // bg-green-100 or bg-red-100
      color: quiz.status === "publicado" ? '#166534' : '#991B1B', // text-green-800 or text-red-800
    }}
  >
    {quiz.status === "publicado" ? "Publicado" : "Rascunho"}
  </span>
</div>

{/* Perguntas */}
<div className="flex items-center text-sm gap-2" style={{ color: '#F3F7F5' }}>
  <ListChecks className="w-4 h-4" />
  <span>Quantidade de Perguntas: {quiz.perguntasCount ?? 0}</span>
</div>

{/* Descrição */}
<div style={{ color: '#F3F7F5' }} className="text-sm">
  {quiz.descricao.length > 20
    ? `${quiz.descricao.slice(0, 40)}...`
    : quiz.descricao}
</div>


        {/* Categoria e Subcategoria */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 px-3 py-1 text-xs rounded-full">
            Categoria: {quiz.categoria || "Sem categoria"}
          </span>
          <span className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 px-3 py-1 text-xs rounded-full">
            Subcategoria: {quiz.subcategoria || "Sem subcategoria"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex items-center justify-between">
  <button
    onClick={handleView}
    className="text-sm hover:underline flex items-center gap-1"
    style={{ color: "#4FA6A8" }} // text-blue-600
  >
    <FileText className="w-4 h-4" style={{ color: "#4FA6A8" }} />
    Ver Quiz
  </button>

  {onEdit && onDelete && (
    <div className="flex gap-4 ml-auto">
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/teacher/quizz/create?id=${quiz.id}`);
        }}
        className="text-sm hover:underline"
        style={{ color: "#c9871f" }} // text-yellow-600
      >
        Editar
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(quiz);
        }}
        className="text-sm hover:underline"
        style={{ color: "#C93A1F" }} // text-red-600
      >
        Apagar
      </button>
    </div>
  )}
</CardFooter>

    </Card>
  );
};

export default QuizCard;
