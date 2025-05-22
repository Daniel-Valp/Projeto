"use client";

import { useEffect, useState } from "react";
import VideoCard from "@/components/videocard";

interface Video {
  id: number;
  title: string;
  url: string;
  category_id: string;
  subcategory_id: number;
  status: string;
  inscritos: number;
  created_at: string;
  updated_at: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/videos");
        const data = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.length === 0 ? (
        <p>Nenhum vídeo disponível.</p>
      ) : (
        videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            onGoToVideo={() => {
              // Podes redirecionar para `/videos/[id]` aqui se quiseres
              console.log("Ver vídeo:", video);
            }}
          />
        ))
      )}
    </div>
  );
}
