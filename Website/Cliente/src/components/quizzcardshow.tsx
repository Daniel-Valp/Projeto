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
  id: number;
  titulo: string;
  descricao: string;
  status?: "publicado" | "rascunho";
  perguntasCount?: number;
  categoria?: string;
  subcategoria?: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
}

const QuizCardshow = ({ quiz, onEdit, onDelete }: QuizCardProps) => {
  const router = useRouter();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/teacher/quizz/${quiz.id}`);
  };

  return (
    <Card
      className="group flex flex-col h-full cursor-pointer hover:shadow-xl transition-all duration-200 border rounded-2xl"
      onClick={handleView}
    >
      <CardContent className="p-4 space-y-3 flex-grow">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {quiz.titulo}
        </CardTitle>

        {/* Status */}
        <div className="flex items-center text-sm gap-2">
          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">Status:</span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              quiz.status === "publicado"
                ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
            }`}
          >
            {quiz.status === "publicado" ? "Publicado" : "Rascunho"}
          </span>
        </div>

        {/* Perguntas */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
          <ListChecks className="w-4 h-4" />
          <span>Quantidade de Perguntas: {quiz.perguntasCount ?? 0}</span>
        </div>

        {/* Descrição */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {quiz.descricao.length > 20
            ? `${quiz.descricao.slice(0, 20)}...`
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

      
    </Card>
  );
};

export default QuizCardshow;
