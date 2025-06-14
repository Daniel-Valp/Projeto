"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import ReactPlayer from "react-player";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import Loading from "@/components/Loading";
import { Curso } from "@/types/Cursotipos";
import { Secao, Capitulo } from "@/types/Secçõestipo";
import { useGetCursosQuery } from "@/state/api";

const CourseChapterPage = () => {
  const { user } = useUser();
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
      // marcar como assistido
    }
  };

  if (isLoading || !curso || !capituloAtual) {
    return <Loading />;
  }

  return (
    <>
      <div className="course__breadcrumb mb-4">
        <div className="course__path text-sm mb-2 text-[#025E69]">
          {curso.titulo} / {secaoAtual?.secaotitulo} /{" "}
          <span className="font-semibold text-[#690202]">{capituloAtual?.capitulotitulo}</span>
        </div>
        <h2 className="text-2xl font-bold mt-1 text-[#025E69]">{capituloAtual?.capitulotitulo}</h2>
        <div className="flex items-center gap-2 mt-2">
          <Avatar className="h-8 w-8">
            <AvatarImage alt={curso.professornome} />
            <AvatarFallback className="bg-[#025E69] text-white">
              {curso.professornome?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-[#025E69]">{curso.professornome}</span>
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
            <CardTitle className="text-[#025E69]">Sem vídeo disponível</CardTitle>
          </CardHeader>
        </Card>
      )}

      <Tabs defaultValue="Notes" className="w-full">
        <TabsList className="border-b border-[#025E69]">
          <TabsTrigger
            value="Notes"
            className="text-[#025E69] data-[state=active]:border-b-2 data-[state=active]:border-[#025E69]"
          >
            Notas
          </TabsTrigger>
          <TabsTrigger
            value="Resources"
            className="text-[#025E69] data-[state=active]:border-b-2 data-[state=active]:border-[#025E69]"
          >
            Recursos
          </TabsTrigger>
          <TabsTrigger
            value="Quiz"
            className="text-[#025E69] data-[state=active]:border-b-2 data-[state=active]:border-[#025E69]"
          >
            Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="Notes">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#025E69]">Notas do Capítulo</CardTitle>
            </CardHeader>
            <CardContent>
              {capituloAtual.conteudo || "Sem conteúdo disponível."}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Resources">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#025E69]">Recursos</CardTitle>
            </CardHeader>
            <CardContent>
              Nenhum recurso disponível.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Quiz">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#025E69]">Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              Quiz em breve!
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default CourseChapterPage;
