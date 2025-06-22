"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ReactPlayer from "react-player";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import Loading from "@/components/Loading";
import ChaptersSidebar from "@/components/AppSidebar";

import { Curso } from "@/types/Cursotipos";
import { Secao, Capitulo } from "@/types/Secçõestipo";
import { useGetCursosQuery } from "@/state/api";

const CourseChapterPage = () => {
  const { user, isLoaded } = useUser();
  const { courseId, chapterId } = useParams();
  const playerRef = useRef<ReactPlayer>(null);

  const { data: cursos, isLoading } = useGetCursosQuery({});
  const [curso, setCurso] = useState<Curso | null>(null);
  const [secaoAtual, setSecaoAtual] = useState<Secao | null>(null);
  const [capituloAtual, setCapituloAtual] = useState<Capitulo | null>(null);

  useEffect(() => {
    if (!cursos || !courseId || !chapterId) return;

    const cursoSelecionado = cursos.find((c: Curso) => c.cursoid === courseId);
    if (!cursoSelecionado) return;

    setCurso(cursoSelecionado);

    const secao = cursoSelecionado.secoes?.find((s: Secao) =>
      s.capitulos?.some((c: Capitulo) => c.capituloid === chapterId)
    ) || null;

    setSecaoAtual(secao);

    const capitulo = secao?.capitulos?.find((c) => c.capituloid === chapterId) || null;
    setCapituloAtual(capitulo);
  }, [cursos, courseId, chapterId]);

  const handleProgress = ({ played }: { played: number }) => {
    if (played >= 0.8) {
      // Capítulo assistido
    }
  };

  const VoltarAosCursos = () => {
    if (!isLoaded || !user) return null;

    const role = String(user.publicMetadata?.userType || "").toLowerCase();
    const isProfessorOuAdmin = role === "professor" || role === "admin";

    const handleRedirect = () => {
      if (isProfessorOuAdmin) {
        window.location.href = "http://localhost:3000/teacher/cursos";
      } else {
        window.location.href = "http://localhost:3000/user/courses";
      }
    };

    return (
      <button
        onClick={handleRedirect}
        className="ml-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#4FA6A8] text-[#FFFFFF] hover:bg-[#3c8f91] transition-colors"
      >
        ← Voltar aos cursos
      </button>
    );
  };

  if (isLoading || !curso || !capituloAtual) {
    return <Loading />;
  }

  return (
    <div className="course flex min-h-screen gap-x-6">
      {curso && capituloAtual && <ChaptersSidebar />}

      <main className="flex-1 p-4 pl-2">
        <div className="course__breadcrumb mb-4">
          <div className="course__path text-sm flex items-center justify-between w-full">
            <div>
              <span className="text-[#2d8e99]">{curso.titulo}</span> / {secaoAtual?.secaotitulo} /{" "}
              <span className="font-semibold text-[#025E69]">{capituloAtual?.capitulotitulo}</span>
            </div>

            <VoltarAosCursos />
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-1 text-[#25272e]">{capituloAtual?.capitulotitulo}</h2>

        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-8 w-8 text-[#25272e]">
            <AvatarImage alt={curso.professornome} />
            <AvatarFallback>
              {curso.professornome?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground text-[#25272e]">{curso.professornome}</span>
        </div>

        {capituloAtual.video ? (
          <Card className="mb-6 mt-4">
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
          <div className="mb-8 p-4 mt-4 rounded-md text-[#2e2525] hover:bg-[#4FA6A8] transition-colors cursor-pointer border">
            Sem vídeo disponível
          </div>
        )}

        <Tabs defaultValue="Notes" className="w-full">
          <TabsList>
            <TabsTrigger value="Notes" className="text-[#25272e]">Notas</TabsTrigger>
            <TabsTrigger value="Resources" className="text-[#25272e]">Recursos</TabsTrigger>
            <TabsTrigger value="Quiz" className="text-[#25272e]">Quiz</TabsTrigger>
          </TabsList>

          <TabsContent value="Notes">
            <div className="mb-4 p-4 rounded-md text-[#25272e] hover:bg-[#4FA6A8] transition-colors border">
              <h3 className="text-lg font-semibold mb-2">Notas do Capítulo</h3>
              {capituloAtual.conteudo || "Sem conteúdo disponível."}
            </div>
          </TabsContent>

          <TabsContent value="Resources">
            <div className="mb-4 p-4 rounded-md text-[#25272e] hover:bg-[#4FA6A8] transition-colors border">
              <h3 className="text-lg font-semibold mb-2">Recursos</h3>
              Nenhum recurso disponível.
            </div>
          </TabsContent>

          <TabsContent value="Quiz">
            <div className="mb-4 p-4 rounded-md text-[#25272e] hover:bg-[#4FA6A8] transition-colors border">
              <h3 className="text-lg font-semibold mb-2">Quiz</h3>
              Quiz em breve!
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CourseChapterPage;
