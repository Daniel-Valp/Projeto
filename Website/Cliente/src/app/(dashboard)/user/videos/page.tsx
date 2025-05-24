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
  categoria_nome?: string;
  subcategoria_nome?: string;
}


export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);

  // Supondo que você já buscou categorias e subcategorias antes
useEffect(() => {
  const fetchVideos = async () => {
    try {
      const [videoRes, catRes, subcatRes] = await Promise.all([
        fetch("http://localhost:5000/api/videos"),
        fetch("http://localhost:5000/api/categories"),
        fetch("http://localhost:5000/api/subcategories"),
      ]);

      const [videos, categories, subcategories] = await Promise.all([
        videoRes.json(),
        catRes.json(),
        subcatRes.json(),
      ]);

      const enrichedVideos = videos.map((video: any) => ({
        ...video,
        categoria_nome:
          video.categoria_nome ||
          categories.find((c: any) => c.id === video.category_id)?.nome ||
          "Sem categoria",
        subcategoria_nome:
          video.subcategoria_nome ||
          subcategories.find((s: any) => s.id === video.subcategory_id)?.nome ||
          "Sem subcategoria",
      }));

      console.log("✅ Vídeos enriquecidos:", enrichedVideos);
      setVideos(enrichedVideos);
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
        // ❌ Remover onGoToVideo, já não é necessário
      />
    ))
  )}
</div>

  );
}
