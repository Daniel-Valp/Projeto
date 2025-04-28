import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetCursoQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
} from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { Curso } from "@/types/Cursotipos";
import { Secao, Capitulo } from "@/types/Secçõestipo";
import { UserCourseProgress } from "@/types/progressostipo";

export const useCourseProgressData = () => {
  const params = useParams();
  const courseId = params?.cursoId as string;
  const chapterId = params?.chapterId as string;

  
  const { user, isLoaded } = useUser();

  const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
  const [currentSection, setCurrentSection] = useState<Secao | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Capitulo | null>(null);

  const [updateProgress] = useUpdateUserCourseProgressMutation();

  const { data: course, isLoading: courseLoading } = useGetCursoQuery(courseId, {
    skip: !courseId,
  });

  const { data: userProgress, isLoading: progressLoading } =
    useGetUserCourseProgressQuery(
      {
        userId: user?.id ?? "",
        courseId: courseId ?? "",
      },
      {
        skip: !isLoaded || !user || !courseId,
      }
    ) as { data: UserCourseProgress | undefined; isLoading: boolean };

  const isLoading = !isLoaded || courseLoading || progressLoading;

  useEffect(() => {
    console.log("user:ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss");
    console.log("user:", user);
    console.log("isLoaded:", isLoaded);
    console.log("courseId:", courseId);
    console.log("chapterId:", chapterId);
    console.log("course:", course);
    console.log("userProgress:", userProgress);
    console.log("courseLoading:", courseLoading);
    console.log("progressLoading:", progressLoading);
    console.log("isLoading:", isLoading);
  }, [
    user,
    isLoaded,
    courseId,
    chapterId,
    course,
    userProgress,
    courseLoading,
    progressLoading,
    isLoading,
  ]);

  // Atualiza secao/capitulo atual
  useEffect(() => {
    if (!course || !chapterId) return;

    const secao = course.secoes?.find((s: Secao) =>
      s.capitulos?.some((c: Capitulo) => c.capituloid === chapterId)
    ) ?? null;

    setCurrentSection(secao);

    const capitulo = secao?.capitulos?.find((c) => c.capituloid === chapterId) ?? null;
    setCurrentChapter(capitulo);
  }, [course, chapterId]);

  const isChapterCompleted = () => {
    if (!currentSection || !currentChapter || !userProgress?.sections) return false;
  
    const sectionProgress = userProgress.sections.find(
      (s) => s.sectionId === currentSection.secaoid
    );
  
    return (
      sectionProgress?.chapters.some(
        (c) => c.chapterId === currentChapter.capituloid && c.completed
      ) ?? false
    );
  };
  

  const updateChapterProgress = (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => {
    if (!user) return;
  
    const updatedSections = [
      {
        sectionId,
        chapters: [
          {
            chapterId,
            completed,
          },
        ],
        completed: false, // ou true, se quiseres marcar como concluída toda a seção
        progress: completed ? 100 : 0, // ou calcula dinamicamente se tiveres mais capítulos
      },
    ];
  
    updateProgress({
      userId: user.id,
      courseId,
      progressData: {
        sections: updatedSections,
      },
    });
  };
  
  

  return {
    user,
    course,
    userProgress,
    currentSection,
    currentChapter,
    isLoading,
    isChapterCompleted,
    updateChapterProgress,
    hasMarkedComplete,
    setHasMarkedComplete,
  };
};
