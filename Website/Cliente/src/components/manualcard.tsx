"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { FileText, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface Manual {
  id: number;
  titulo: string;
  descricao: string;
  imagem_capa_url: string;
  arquivo_pdf_url: string;
  categoria_nome?: string;
  subcategoria_nome?: string;
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


  const getDownloadUrl = () => {
    if (!manual.arquivo_pdf_url) return "";

    if (manual.arquivo_pdf_url.startsWith("http")) {
      console.log("arquivo_pdf_url é URL absoluta:", manual.arquivo_pdf_url);
      return manual.arquivo_pdf_url;
    } else {
      const backendBaseUrl = "http://localhost:5000";
      const url = `${backendBaseUrl}${manual.arquivo_pdf_url}`;
      console.log("arquivo_pdf_url é caminho relativo. URL gerada:", url);
      return url;
    }
  };

  console.log("ManualCard renderizado com manual:", manual);

  return (
    <Card
      className="group flex flex-col h-full cursor-pointer hover:shadow-xl transition-all duration-200 border rounded-2xl overflow-hidden"
      onClick={handleViewManual}
    >
      <CardHeader className="p-0">
        <div className="w-full h-44 overflow-hidden">
          <Image
            src={manual.imagem_capa_url || "/placeholder.png"}
            alt={manual.titulo}
            width={400}
            height={225}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 flex-grow">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {manual.titulo}
        </CardTitle>

        <div className="text-sm text-gray-600 dark:text-gray-300">
          {manual.descricao}
        </div>

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

  {/* Botão para abrir visualização do manual na rota /manuais/:id */}
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



  {/* botões de editar e apagar (se existirem) */}
  {onEdit && onDelete && (
    <div className="flex gap-4 ml-auto">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(manual);
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
