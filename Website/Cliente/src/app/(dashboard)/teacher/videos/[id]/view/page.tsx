"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Users } from "lucide-react";
import Header from "@/components/Header";

interface Video {
  id: number;
  title: string;
  url: string;
  status: string;
  inscritos: number;
  categoria_nome?: string;
  subcategoria_nome?: string;
}

export default function VideoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/videos/${id}`);
        const data = await res.json();
        setVideo(data);
      } catch (error) {
        console.error("Erro ao buscar vídeo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  if (loading) return <p className="p-6 text-white">Carregando vídeo...</p>;
  if (!video) return <p className="p-6 text-white">Vídeo não encontrado.</p>;

  const embedUrl = getYoutubeEmbedUrl(video.url);

  return (
    <div className="p-6 space-y-6 bg-[#F3F7F5] min-h-screen">
      <Header
        title={video.title}
        subtitle="Detalhes do vídeo"
        rightElement={
          <Button
  onClick={() => router.push("/teacher/videos")}
  variant="outline"
className="border border-[#25262f] text-[#25262f] hover:bg-[#4FA6A8] hover:text-white"
>
  Voltar
</Button>

        }
      />

      <div className="space-y-3 text-sm ">
        <div className="flex items-center gap-2 ">
          <Eye className="w-4 h-4 text-[#4FA6A8]" />
          <span className="text-[#4FA6A8]">Status:</span>
          <Badge
            className={
              video.status === "publicado"
                ? "bg-green-700 text-white"
                : "bg-red-700 text-white"
            }
          >
            {video.status}
          </Badge>
        </div>

        <div className="flex items-center gap-2 text-[#4FA6A8]">
          <Users className="w-4 h-4 text-[#4FA6A8]" />
          <span>Vizualizações: {video.inscritos}</span>
        </div>

        <div className="flex flex-wrap gap-2 text-[#4FA6A8]">
          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 px-3 py-1 text-xs rounded-full">
            Categoria: {video.categoria_nome || "Sem categoria"}
          </Badge>
          <Badge variant="outline" className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 px-3 py-1 text-xs rounded-full">
            Subcategoria: {video.subcategoria_nome || "Sem subcategoria"}
          </Badge>
        </div>
      </div>

      {embedUrl ? (
        <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg border border-gray-700">
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title="YouTube video player"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="text-red-500">URL do vídeo inválida.</p>
      )}

      
    </div>
  );
}
