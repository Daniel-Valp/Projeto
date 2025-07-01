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
import Image from "next/image";
import { useUser } from "@clerk/nextjs";


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

const ManualCardshow = ({ manual }: ManualCardProps) => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const handleViewManual = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      await fetch(`http://localhost:5000/api/manuais/${manual.id}/enlistar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Erro ao incrementar inscritos:", error);
    } finally {
      if (!isLoaded || !user) {
        router.push(`/login`); // ou outra página pública
        return;
      }

      const role = (user.publicMetadata?.userType ?? "").toString().toLowerCase();


      if (role === "teacher" || role === "admin") {
        router.push(`/teacher/manuais/${manual.id}`);
      } else if (role === "student" || role === "aluno") {
        router.push(`/user/manuais/${manual.id}`);  // rota do aluno
      } else {
        // fallback ou admin
        router.push(`/user/cursos`);
      }
    }
  };


  const getImageUrl = () => {
  if (!manual.imagem_capa_url || manual.imagem_capa_url === "") {
    return "/default-cover.jpg";  // caminho relativo para a pasta public
  }

  if (
    manual.imagem_capa_url.startsWith("/images/") ||
    manual.imagem_capa_url.startsWith("/default-cover.jpg")
  ) {
    return manual.imagem_capa_url; // Imagem local na pasta public
  }

  return manual.imagem_capa_url.startsWith("http")
    ? manual.imagem_capa_url
    : `http://localhost:5000${manual.imagem_capa_url}`;
};


  return (

    
<Card
  className="group flex flex-col h-full cursor-pointer border-2 border-[#25272e] rounded-2xl overflow-hidden bg-[#25272e] text-white shadow-lg shadow-[rgba(34,34,34,0.37)] transition-all duration-200 hover:bg-[#32353E]"
  onClick={handleViewManual}
>
<CardHeader className="p-0 border-none overflow-hidden">
  <div className="w-full h-44 relative bg-black">
    <Image
      src={getImageUrl()}
      alt={manual.titulo}
      fill
      className="object-cover transition-transform duration-200 hover:scale-105"
      sizes="(max-width: 768px) 100vw, 33vw"
      priority
      unoptimized={getImageUrl() === "/default-cover.jpg"} // desliga otimização para imagens locais se quiser
    />
  </div>
</CardHeader>




      <CardContent className="p-4 space-y-3 flex-grow">
        <CardTitle className="text-xl font-bold" style={{ color: "#F3F7F5" }}>
          {manual.titulo}
        </CardTitle>
        {/* Status */}
        {/* <div className="flex items-center text-sm gap-2">
          <Eye className="w-4 h-4" style={{ color: "#F3F7F5" }} />
          <span style={{ color: "#F3F7F5" }}>Status:</span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              manual.status === "publicado"
                ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
            }`}
          >
            {manual.status === "publicado" ? "Publicado" : "Rascunho"}
          </span>
        </div> */}
<div className="text-sm" style={{ color: "#F3F7F5" }}>
  {manual.descricao.length > 20
    ? `${manual.descricao.slice(0, 70)}...`
    : manual.descricao}
</div>
        {/* Inscritos */}
        <div className="flex items-center text-sm gap-2" style={{ color: "#4FA6A8" }}>
          <Users className="w-4 h-4" />
          <span>Visualisações: {manual.inscritos ?? 0}</span>
        </div>


        {/* Categoria e Subcategoria */}
        {/* <div className="flex flex-wrap gap-2 pt-2">
          <span className="bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 px-3 py-1 text-xs rounded-full">
            Categoria: {manual.categoria_nome || "Sem categoria"}
          </span>
          <span className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 px-3 py-1 text-xs rounded-full">
            Subcategoria: {manual.subcategoria_nome || "Sem subcategoria"}
          </span>
        </div> */}
      </CardContent>

      
    </Card>
  );
};

export default ManualCardshow;
