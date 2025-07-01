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

  const handleViewManual = async (e: React.MouseEvent) => {
  e.stopPropagation();

  try {
    await fetch(`http://localhost:5000/api/manuais/${manual.id}/enlistar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Atualiza localmente o número de inscritos (somente visual)
    if (manual.inscritos !== undefined) {
      manual.inscritos += 1;
    }
  } catch (error) {
    console.error("Erro ao incrementar inscritos:", error);
  } finally {
    router.push(`/teacher/manuais?id=${manual.id}`);

  }
};


  const getImageUrl = () => {
  if (!manual.imagem_capa_url) return "/default-cover.jpg";

  if (
    manual.imagem_capa_url === "/images/sem-imagem.png" ||
    manual.imagem_capa_url.startsWith("/images/")
  ) {
    return manual.imagem_capa_url; // usa do frontend/public
  }

  return manual.imagem_capa_url.startsWith("http")
    ? manual.imagem_capa_url
    : `http://localhost:5000${manual.imagem_capa_url}`;
};


  return (
    <Card
  className="group flex flex-col h-full cursor-pointer border-2 border-[#25272e] rounded-2xl overflow-hidden bg-[#25272e] text-white shadow-lg shadow-[rgba(34,34,34,0.37)] transition-all duration-200 hover:bg-[#32353E]"
  style={{ backgroundColor: "#25272e" }}
  onClick={handleViewManual}
>
  <CardHeader className="p-0 border-none overflow-hidden">
  <div className="w-full h-44 overflow-hidden bg-black">
    <img
      src={getImageUrl()}
      alt={manual.titulo}
      className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
    />
  </div>
</CardHeader>


  <CardContent className="p-4 space-y-3 flex-grow">
    <CardTitle className="text-xl font-bold" style={{ color: "#F3F7F5" }}>
      {manual.titulo.length > 30 ? `${manual.titulo.slice(0, 30)}...` : manual.titulo}
    </CardTitle>

    {/* Status */}
    <div className="flex items-center text-sm gap-2">
      <Eye className="w-4 h-4" style={{ color: "#4FA6A8" }} />
      <span style={{ color: "#F3F7F5" }}>Status:</span>
      <span
        className="px-2 py-0.5 text-xs font-medium rounded-full"
        style={{
          backgroundColor: manual.status === "publicado" ? "#DCFCE7" : "#FEE2E2",
          color: manual.status === "publicado" ? "#166534" : "#991B1B",
        }}
      >
        {manual.status === "publicado" ? "Publicado" : "Rascunho"}
      </span>
    </div>

    {/* Inscritos */}
    <div className="flex items-center text-sm gap-2" style={{ color: "#F3F7F5" }}>
      <Users className="w-4 h-4" />
      <span>Visualisações: {manual.inscritos ?? 0}</span>
    </div>

    {/* Descrição */}
    <div className="text-sm" style={{ color: "#F3F7F5" }}>
      {manual.descricao.length > 40
        ? `${manual.descricao.slice(0, 40)}...`
        : manual.descricao}
    </div>

    {/* Categoria e Subcategoria */}
    <div className="flex flex-wrap gap-2 pt-2">
      <span
        className="px-3 py-1 text-xs rounded-full"
        style={{
          backgroundColor: "#DBEAFE",
          color: "#1E3A8A",
        }}
      >
        Categoria: {manual.categoria_nome || "Sem categoria"}
      </span>
      <span
        className="px-3 py-1 text-xs rounded-full"
        style={{
          backgroundColor: "#DCFCE7",
          color: "#166534",
        }}
      >
        Subcategoria: {manual.subcategoria_nome || "Sem subcategoria"}
      </span>
    </div>
  </CardContent>

  <CardFooter className="p-4 flex items-center justify-between">
    <button
  onClick={(e) => {
    e.stopPropagation();
    router.push(`/user/manuais/${manual.id}`);
  }}
  className="text-sm hover:underline flex items-center gap-1"
  style={{ color: "#4FA6A8" }}
>
  <FileText className="w-4 h-4" style={{ color: "#4FA6A8" }} />
  Ver Manual
</button>


    {onEdit && onDelete && (
      <div className="flex gap-4 ml-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/teacher/manuais/create?id=${manual.id}`);
          }}
          className="text-sm hover:underline"
          style={{ color: "#c9871f" }}
        >
          Editar
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(manual);
          }}
          className="text-sm hover:underline"
          style={{ color: "#C93A1F" }}
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
