"use client";

import { useEffect, useState } from "react";
import VideoCard from "@/components/videocard";
import Toolbar from "@/components/Toolbar";

interface Category {
  nome: string;
}

interface Subcategory {
  nome: string;
}

interface Video {
  id: number;
  title: string;
  url: string;
  status: string;
  inscritos: number;
  categoria?: Category;
  subcategoria?: Subcategory;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");

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

  // Filtros
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || video.categoria?.nome === selectedCategory;
    const matchesSubcategory =
      selectedSubcategory === "all" ||
      video.subcategoria?.nome === selectedSubcategory;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  // Ação para editar vídeo
  const handleEdit = (video: Video) => {
    alert(`Editar vídeo: ${video.title}`);
    // Aqui você pode abrir um modal ou redirecionar para a página de edição
  };

  // Ação para apagar vídeo
  const handleDelete = async (video: Video) => {
    const confirm = window.confirm(`Deseja mesmo apagar o vídeo "${video.title}"?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/videos/${video.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setVideos((prev) => prev.filter((v) => v.id !== video.id));
      } else {
        console.error("Erro ao apagar vídeo.");
      }
    } catch (error) {
      console.error("Erro ao apagar vídeo:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.length === 0 ? (
          <p>Nenhum vídeo disponível.</p>
        ) : (
          filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={{
                ...video,
                categoria_nome: video.categoria?.nome,
                subcategoria_nome: video.subcategoria?.nome,
              }}
              onGoToVideo={() => {
                console.log("Ver vídeo:", video);
              }}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
