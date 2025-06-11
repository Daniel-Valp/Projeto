"use client";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { Eye, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface Video {
  id: number;
  title: string;
  url: string;
  status: string;
  inscritos: number;
  categoria_nome?: string;
  subcategoria_nome?: string;
}

interface VideoCardProps {
  video: Video;
  onEdit?: (video: Video) => void;
  onDelete?: (video: Video) => void;
}

const getYoutubeThumbnail = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : "/placeholder.png";
};

const VideoCard = ({ video, onEdit, onDelete }: VideoCardProps) => {
  const router = useRouter();

  // Atualizado para navegar para a rota correta de visualização do vídeo
  const handleViewVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/teacher/videos/${video.id}/view`);
  };

  return (
    <Card
  className="group flex flex-col h-full cursor-pointer border-2 border-[#25272e] rounded-2xl overflow-hidden bg-[#25272e] text-white shadow-lg transition-all duration-200 hover:bg-[#32353E]"
  style={{ backgroundColor: "#25272e" }}
  onClick={handleViewVideo}
>
  <CardHeader className="p-0 border-none overflow-hidden">
      <div className="w-full h-44 overflow-hidden bg-black">
        <Image
          src={getYoutubeThumbnail(video.url)}
          alt={video.title}
          width={400}
          height={225}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
          unoptimized
        />
      </div>
    </CardHeader>

  <CardContent className="p-4 space-y-3 flex-grow">
    <CardTitle className="text-xl font-bold" style={{ color: "#F3F7F5" }}>
      {video.title.length > 30 ? `${video.title.slice(0, 30)}...` : video.title}
    </CardTitle>

    {/* Status */}
    <div className="flex items-center text-sm gap-2">
      <Eye className="w-4 h-4" style={{ color: "#4FA6A8" }} />
      <span style={{ color: "#F3F7F5" }}>Status:</span>
      <span
        className="px-2 py-0.5 text-xs font-medium rounded-full"
        style={{
          backgroundColor: video.status === "publicado" ? "#DCFCE7" : "#FEE2E2",
          color: video.status === "publicado" ? "#166534" : "#991B1B",
        }}
      >
        {video.status === "publicado" ? "Publicado" : "Rascunho"}
      </span>
    </div>

    {/* Inscritos */}
    <div className="flex items-center text-sm gap-2" style={{ color: "#F3F7F5" }}>
      <Users className="w-4 h-4" />
      <span>Vizualizações: {video.inscritos}</span>
    </div>

    {/* Categoria e Subcategoria */}
    <div className="flex flex-wrap gap-2 pt-2">
      <span
        className="px-3 py-1 text-xs rounded-full"
        style={{
          backgroundColor: "#DBEAFE", // bg-blue-100
          color: "#1E3A8A", // text-blue-800
        }}
      >
        Categoria: {video.categoria_nome || "Sem categoria"}
      </span>
      <span
        className="px-3 py-1 text-xs rounded-full"
        style={{
          backgroundColor: "#DCFCE7", // bg-green-100
          color: "#166534", // text-green-800
        }}
      >
        Subcategoria: {video.subcategoria_nome || "Sem subcategoria"}
      </span>
    </div>
  </CardContent>

  <CardFooter className="p-4 flex items-center justify-between">
    <button
      onClick={handleViewVideo}
      className="text-sm hover:underline"
      style={{ color: "#4FA6A8" }}
    >
      Ver vídeo →
    </button>

    <div className="flex gap-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(video);
        }}
        className="text-sm hover:underline"
        style={{ color: "#c9871f" }}
      >
        Editar
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(video);
        }}
        className="text-sm hover:underline"
        style={{ color: "#C93A1F" }}
      >
        Apagar
      </button>
    </div>
  </CardFooter>
</Card>

  );
};

export default VideoCard;
