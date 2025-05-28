"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { FileText, Eye, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Manual {
  id: number;
  titulo: string;
  descricao: string;
  imagem_capa_url: string;
  arquivo_pdf_url: string;
  categoria_nome?: string;
  subcategoria_nome?: string;
  status?: "publicado" | "rascunho";
  inscritos?: number;
}

interface ManualCardProps {
  manual: Manual;
  onEdit?: (manual: Manual) => void;
  onDelete?: (manual: Manual) => void;
}

const ManualCard = ({ manual, onEdit, onDelete }: ManualCardProps) => {
  const router = useRouter();

  const handleViewManual = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/teacher/manuais/${manual.id}`);
  };

  const getImageUrl = () => {
    if (!manual.imagem_capa_url) return "/default-cover.jpg";
    return manual.imagem_capa_url.startsWith("http")
      ? manual.imagem_capa_url
      : `http://localhost:5000${manual.imagem_capa_url}`;
  };

  return (
    <Card
      className="group flex flex-col h-full cursor-pointer hover:shadow-xl transition-all duration-200 border rounded-2xl overflow-hidden"
      onClick={handleViewManual}
    >
      <CardHeader className="p-0">
        <div className="w-full h-44 overflow-hidden bg-gray-200">
          <img
            src={getImageUrl()}
            alt={manual.titulo}
            className="w-full h-full object-cover"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 flex-grow">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {manual.titulo}
        </CardTitle>

        {/* Status */}
        <div className="flex items-center text-sm gap-2">
          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">Status:</span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              manual.status === "publicado"
                ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
            }`}
          >
            {manual.status === "publicado" ? "Publicado" : "Rascunho"}
          </span>
        </div>

        {/* Inscritos */}
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
          <Users className="w-4 h-4" />
          <span>Inscritos: {manual.inscritos ?? 0}</span>
        </div>
<div className="text-sm text-gray-600 dark:text-gray-300">
  {manual.descricao.length > 20
    ? `${manual.descricao.slice(0, 20)}...`
    : manual.descricao}
</div>

        {/* Categoria e Subcategoria */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 px-3 py-1 text-xs rounded-full">
            Categoria: {manual.categoria_nome || "Sem categoria"}
          </span>
          <span className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 px-3 py-1 text-xs rounded-full">
            Subcategoria: {manual.subcategoria_nome || "Sem subcategoria"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex items-center justify-between">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/teacher/manuais/${manual.id}`);
          }}
          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
        >
          <FileText className="w-4 h-4" />
          Ver Manual
        </button>

        {onEdit && onDelete && (
          <div className="flex gap-4 ml-auto">
            <button
  onClick={(e) => {
    e.stopPropagation();
    router.push(`/teacher/manuais/create?id=${manual.id}`);
  }}
  className="text-sm text-yellow-600 hover:underline"
>
  Editar
</button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(manual);
              }}
              className="text-sm text-red-600 hover:underline"
            >
              Apagar
            </button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ManualCard;
