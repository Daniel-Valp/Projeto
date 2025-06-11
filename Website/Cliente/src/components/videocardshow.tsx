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

const VideoCardshow = ({ video, onEdit, onDelete }: VideoCardProps) => {
  const router = useRouter();

  // Atualizado para navegar para a rota correta de visualização do vídeo
  const handleViewVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/teacher/videos/${video.id}/view`);
  };

  return (
    <Card
  className="group flex flex-col h-full cursor-pointer border-2 border-[#25272e] rounded-2xl overflow-hidden bg-[#25272e] text-white shadow-lg transition-all duration-200 hover:bg-[#32353E]"
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
      {video.title}
    </CardTitle>

    <div className="flex items-center text-sm gap-2" style={{ color: "#4FA6A8" }}>
      <Users className="w-4 h-4" />
      <span>Inscritos: {video.inscritos}</span>
    </div>
  </CardContent>
</Card>

  );
};

export default VideoCardshow;
