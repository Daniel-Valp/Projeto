"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import Loading from "@/components/Loading";

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



export default function VideoPage() {
  const { id } = useParams();
  const playerRef = useRef<ReactPlayer>(null);

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/videos/${id}`);
        const data = await res.json();
        setVideo(data);
      } catch (error) {
        console.error("Erro ao carregar vídeo:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchVideo();
  }, [id]);

  const handleProgress = ({ played }: { played: number }) => {
    if (played >= 0.8) {
      console.log("✅ Vídeo assistido até 80%");
    }
  };

  if (loading || !video) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-6 space-y-6">
        <div>
          <div className="text-sm text-muted-foreground">
            Categoria: {video.categoria_nome || "Sem categoria"} / Subcategoria: {video.subcategoria_nome || "Sem subcategoria"}
          </div>
          <h2 className="text-2xl font-bold">{video.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage alt={video.professor_nome || "Professor"} /> */}
              <AvatarFallback>
                {/* {video.professor_nome?.charAt(0).toUpperCase() || "P"} */}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {/* {video.professor_nome || "Professor Desconhecido"} */}
            </span>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="aspect-video">
            <ReactPlayer
              ref={playerRef}
              url={video.url}
              controls
              width="100%"
              height="100%"
              onProgress={handleProgress}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="Notes" className="w-full">
          <TabsList>
            <TabsTrigger value="Notes">Notas</TabsTrigger>
            <TabsTrigger value="Status">Status</TabsTrigger>
            <TabsTrigger value="Extras">Extras</TabsTrigger>
          </TabsList>

          <TabsContent value="Notes">
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                {/* {video.conteudo || "Sem conteúdo disponível."} */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Status">
            <Card>
              <CardHeader>
                <CardTitle>Estado do Vídeo</CardTitle>
              </CardHeader>
              <CardContent>
                Status: <strong>{video.status}</strong>
                <br />
                Inscritos: <strong>{video.inscritos}</strong>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Extras">
            <Card>
              <CardHeader>
                <CardTitle>Extras</CardTitle>
              </CardHeader>
              <CardContent>
                Nenhum extra disponível no momento.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
