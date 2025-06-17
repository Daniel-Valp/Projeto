"use client";

import { useEffect, useState } from "react";
import VideoCard from "@/components/videocard";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface Category {
  id: string | number;
  nome: string;
}

interface Subcategory {
  id: string | number;
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
  professor_id?: string; // importante
}

interface FlatVideo extends Video {
  categoria_id?: string;
  subcategoria_id?: string;
  category_id?: string;
  subcategory_id?: string | number;
}

export default function VideosPage() {
  const { user } = useUser();
  const professorIdLogado = user?.id;

  const [videos, setVideos] = useState<FlatVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const router = useRouter();

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

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category_id === selectedCategory;
    const selectedSubcategoryNumber = selectedSubcategory === "all" ? "all" : Number(selectedSubcategory);
    const videoSubcategoryNumber = video.subcategory_id ? Number(video.subcategory_id) : undefined;
    const matchesSubcategory =
      selectedSubcategoryNumber === "all" ||
      (videoSubcategoryNumber !== undefined && videoSubcategoryNumber === selectedSubcategoryNumber);

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const handleEdit = (video: FlatVideo) => {
    router.push(`/teacher/videos/${video.id}`);
  };

  const handleDelete = async (video: FlatVideo) => {
    if (!window.confirm(`Deseja mesmo apagar o vídeo "${video.title}"?`)) return;

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

  const handleCreateCourse = () => {
    router.push("/teacher/videos/create");
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Videos"
        subtitle="Veja todos os vídeos existentes"
        rightElement={
          <Button onClick={handleCreateCourse} className="teacher-courses__header">
            Criar vídeos
          </Button>
        }
      />

      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos.map((video) => {
          const isOwner = video.professor_id === professorIdLogado;

          return (
            <VideoCard
              key={video.id}
              video={video}
              onEdit={isOwner ? () => handleEdit(video) : undefined}
              onDelete={isOwner ? () => handleDelete(video) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
