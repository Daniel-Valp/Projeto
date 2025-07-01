"use client";

import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { ListChecks } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface Quiz {
  id: number;
  titulo: string;
  descricao: string;
  status?: "publicado" | "rascunho";
  perguntasCount?: number;
  categoria?: string;
  subcategoria?: string;
  professor_email: string;
}

interface QuizCardProps {
  quiz: Quiz;
  onEdit?: (quiz: Quiz) => void;
  onDelete?: (quiz: Quiz) => void;
}

const QuizCardshow = ({ quiz, onEdit, onDelete }: QuizCardProps) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirm = window.confirm(
      "Atenção! Tem a certeza que quer visualizar este quiz? Uma vez iniciado é necessario acaba-lo."
    );
    if (!confirm) return;

    if (!isLoaded || !user) {
      router.push("/login");
      return;
    }

    const role = (user.publicMetadata?.userType ?? "").toString().toLowerCase();


    if (role === "teacher" || role === "admin") {
      router.push(`/teacher/quizz/${quiz.id}`);
    } else if (role === "student" || role === "aluno") {
      router.push(`/user/quizz/${quiz.id}`);
    } else {
      router.push("/user/cursos");
    }
  };

  return (
    <Card
      className="group flex flex-col h-full cursor-pointer border-4 border-[#25272e] rounded-2xl overflow-hidden bg-[#25272e] text-white shadow-lg transition-all duration-200 hover:bg-[#32353E]"
      onClick={handleView}
    >
      <CardContent className="p-4 space-y-3 flex-grow">
        <CardTitle className="text-xl font-bold" style={{ color: "#F3F7F5" }}>
          {quiz.titulo}
        </CardTitle>

        {/* Professor */}
        <div className="flex items-center text-sm gap-2" style={{ color: "#4FA6A8" }}>
          <span>Professor: {quiz.professor_email}</span>
        </div>

        {/* Quantidade de Perguntas */}
        <div className="flex items-center text-sm gap-2" style={{ color: "#F3F7F5" }}>
          <ListChecks className="w-4 h-4" />
          <span>Quantidade de Perguntas: {quiz.perguntasCount ?? 0}</span>
        </div>

        {/* Descrição */}
        <div className="text-sm" style={{ color: "#F3F7F5" }}>
          {quiz.descricao.length > 20
            ? `${quiz.descricao.slice(0, 20)}...`
            : quiz.descricao}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizCardshow;
