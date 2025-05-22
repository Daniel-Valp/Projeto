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
  onGoToVideo?: (video: Video) => void;
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

const VideoCard = ({ video, onGoToVideo, onEdit, onDelete }: VideoCardProps) => {
  return (
    <Card
      className="group cursor-pointer hover:shadow-xl transition-all duration-200 border rounded-2xl overflow-hidden"
      onClick={() => onGoToVideo?.(video)}
    >
      <CardHeader className="p-0">
        <Image
          src={getYoutubeThumbnail(video.url)}
          alt={video.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
          unoptimized
        />
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {video.title}
        </CardTitle>

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-2">
          <Eye className="w-4 h-4" />
          <span>Status: {video.status}</span>
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
          onClick={(e) => {
            e.stopPropagation();
            onGoToVideo?.(video);
          }}
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
