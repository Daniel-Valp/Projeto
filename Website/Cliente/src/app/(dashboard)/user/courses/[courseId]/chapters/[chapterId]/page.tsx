"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ReactPlayer from "react-player";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import Loading from "@/components/Loading";
import ChaptersSidebar from "@/components/AppSidebar";

import { Curso } from "@/types/Cursotipos";
import { Secao, Capitulo } from "@/types/Secçõestipo";
import { useGetCursosQuery } from "@/state/api";

const CourseChapterPage = () => {
  const { user } = useUser();
  const { courseId, chapterId } = useParams(); // 👈 corrigido aqui
  const playerRef = useRef<ReactPlayer>(null);

  const { data: cursos, isLoading } = useGetCursosQuery({});
  const [curso, setCurso] = useState<Curso | null>(null);
  const [secaoAtual, setSecaoAtual] = useState<Secao | null>(null);
  const [capituloAtual, setCapituloAtual] = useState<Capitulo | null>(null);

  useEffect(() => {
    //console.log("🚀 Params:", { courseId, chapterId }); // 👈 ajusta o log também
    //console.log("📦 Cursos carregados:", cursos);

    if (!cursos || !courseId || !chapterId) { // 👈 usa courseId aqui também
      //console.warn("⚠️ Faltando dados necessários:", { cursos, courseId, chapterId });
      return;
    }

    const cursoSelecionado = cursos.find((c: Curso) => c.cursoid === courseId); // 👈 aqui também
    if (!cursoSelecionado) {
      //console.error("❌ Curso não encontrado com ID:", courseId);
      return;
    }

    setCurso(cursoSelecionado);
    //console.log("✅ Curso encontrado:", cursoSelecionado);

    const secao = cursoSelecionado.secoes?.find((s: Secao) =>
      s.capitulos?.some((c: Capitulo) => c.capituloid === chapterId)
    ) || null;

    setSecaoAtual(secao);
   // console.log("📂 Seção atual:", secao);

    const capitulo = secao?.capitulos?.find((c) => c.capituloid === chapterId) || null;
    setCapituloAtual(capitulo);
    //console.log("🎬 Capítulo atual:", capitulo);
  }, [cursos, courseId, chapterId]); // 👈 aqui também


  const handleProgress = ({ played }: { played: number }) => {
    if (played >= 0.8) {
      //console.log("✅ Capítulo assistido até 80%");
    }
  };

  if (isLoading || !curso || !capituloAtual) {
   // console.log("⏳ Carregando... isLoading:", isLoading, "curso:", curso, "capituloAtual:", capituloAtual);
    return <Loading />;
  }

  return (
    <div className="course flex min-h-screen">
       
  {/* Só renderiza se o hook já tiver carregado o curso e capítulo */}
  {curso && capituloAtual && (
    <ChaptersSidebar />
  )}



      <main className="flex-1 p-6">
        <div className="course__breadcrumb mb-4">
          <div className="course__path text-sm text-muted-foreground">
            {curso.titulo} / {secaoAtual?.secaotitulo} /{" "}
            <span className="font-semibold">{capituloAtual?.capitulotitulo}</span>
          </div>
          <h2 className="text-2xl font-bold mt-1">{capituloAtual?.capitulotitulo}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage alt={curso.professornome} />
              <AvatarFallback>
                {curso.professornome?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{curso.professornome}</span>
          </div>
        </div>

        {capituloAtual.video ? (
  <Card className="mb-6">
    <CardContent className="aspect-video">
      <ReactPlayer
        ref={playerRef}
        url={typeof capituloAtual.video === "string" ? capituloAtual.video : undefined}
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
) : (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle>Sem video disponivel</CardTitle>
    </CardHeader>
  </Card>
)}


        <Tabs defaultValue="Notes" className="w-full">
          <TabsList>
            <TabsTrigger value="Notes">Notas</TabsTrigger>
            <TabsTrigger value="Resources">Recursos</TabsTrigger>
            <TabsTrigger value="Quiz">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="Notes">
            <Card>
              <CardHeader>
                <CardTitle>Notas do Capítulo</CardTitle>
              </CardHeader>
              <CardContent>
                {capituloAtual.conteudo || "Sem conteúdo disponível."}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Resources">
            <Card>
              <CardHeader>
                <CardTitle>Recursos</CardTitle>
              </CardHeader>
              <CardContent>
                Nenhum recurso disponível.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Quiz">
            <Card>
              <CardHeader>
                <CardTitle>Quiz</CardTitle>
              </CardHeader>
              <CardContent>
                Quiz em breve!
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CourseChapterPage;
