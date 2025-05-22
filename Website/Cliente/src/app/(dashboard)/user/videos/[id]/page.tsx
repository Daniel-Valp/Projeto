// app/aluno/videos/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Video = {
  id: number;
  title: string;
  url: string;
};

export default function AssistirVideoPage() {
  const [video, setVideo] = useState<Video | null>(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await fetch(`http://localhost:5000/api/videos/${id}`);
      const data = await res.json();
      setVideo(data);
    };
    fetchVideo();
  }, [id]);

  if (!video) return <p>Carregando...</p>;

  const embedUrl = video.url.replace("watch?v=", "embed/");

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">{video.title}</h1>
      <div className="aspect-video w-full max-w-4xl">
        <iframe
          className="w-full h-full rounded-xl"
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
        />
      </div>
    </div>
  );
}
