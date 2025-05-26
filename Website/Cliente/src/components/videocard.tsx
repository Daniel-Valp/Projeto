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
      className="group flex flex-col h-full cursor-pointer hover:shadow-xl transition-all duration-200 border rounded-2xl overflow-hidden"
      onClick={handleViewVideo}
    >
      <CardHeader className="p-0">
        <div className="w-full h-44 overflow-hidden">
          <Image
            src={getYoutubeThumbnail(video.url)}
            alt={video.title}
            width={400}
            height={225}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3 flex-grow">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {video.title}
        </CardTitle>

        <div className="flex items-center text-sm gap-2">
          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">Status:</span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full
            ${
              video.status === "publicado"
                ? "bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300"
            }`}
          >
            {video.status === "publicado" ? "Publicado" : "Rascunho"}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
          <Users className="w-4 h-4" />
          <span>Inscritos: {video.inscritos}</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 px-3 py-1 text-xs rounded-full">
            Categoria: {video.categoria_nome || "Sem categoria"}
          </span>
          <span className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 px-3 py-1 text-xs rounded-full">
            Subcategoria: {video.subcategoria_nome || "Sem subcategoria"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 flex items-center justify-between">
        <button
          onClick={handleViewVideo}
          className="text-sm text-blue-600 hover:underline"
        >
          Ver vídeo →
        </button>

        <div className="flex gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(video);
            }}
            className="text-sm text-yellow-600 hover:underline"
          >
            Editar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(video);
            }}
            className="text-sm text-red-600 hover:underline"
          >
            Apagar
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VideoCard;
