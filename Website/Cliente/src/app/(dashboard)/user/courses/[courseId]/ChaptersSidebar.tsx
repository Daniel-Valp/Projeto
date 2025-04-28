import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  CheckCircle,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import Loading from "@/components/Loading";
import { useCourseProgressData } from "../../../../../hooks/useCourseProgressData";

import { Curso } from "@/types/Cursotipos";
import { Secao, Capitulo } from "@/types/Secçõestipo";
import { UserCourseProgress, SecaoProgresso, CapituloProgresso } from "@/types/progressostipo";

const ChaptersSidebar = () => {
  const router = useRouter();
  const { setOpen } = useSidebar();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Pegando o courseId e chapterId diretamente do hook
  const {
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
  } = useCourseProgressData();

  const chapterId = currentChapter?.capituloid ?? "";  // Usando o chapterId correto do estado atual
  const courseId = course?.cursoid ?? ""; // Usando o courseId correto do curso

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!user) return <div>Please sign in to view course progress.</div>;
  if (!course || !userProgress) return <div>Error loading course content</div>;

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections((prevSections) =>
      prevSections.includes(sectionTitle)
        ? prevSections.filter((title) => title !== sectionTitle)
        : [...prevSections, sectionTitle]
    );
  };

  const handleChapterClick = (sectionId: string, chapterId: string) => {
    router.push(`/user/courses/${courseId}/chapters/${chapterId}`, {
      scroll: false,
    });
  };

  return (
    <div ref={sidebarRef} className="chapters-sidebar">
      <div className="chapters-sidebar__header">
        <h2 className="chapters-sidebar__title">{course.titulo}</h2>
        <hr className="chapters-sidebar__divider" />
      </div>
      {course.secoes.map((section, index) => (
        <Section
          key={section.secaoid}
          section={section}
          index={index}
          sectionProgress={userProgress.sections.find(
            (s) => s.sectionId === section.secaoid
          )}
          chapterId={chapterId}
          courseId={courseId}
          expandedSections={expandedSections}
          toggleSection={toggleSection}
          handleChapterClick={handleChapterClick}
          updateChapterProgress={updateChapterProgress}
        />
      ))}
    </div>
  );
};

const Section = ({
  section,
  index,
  sectionProgress,
  chapterId,
  courseId,
  expandedSections,
  toggleSection,
  handleChapterClick,
  updateChapterProgress,
}: {
  section: Secao;
  index: number;
  sectionProgress: SecaoProgresso | undefined;
  chapterId: string;
  courseId: string;
  expandedSections: string[];
  toggleSection: (sectionId: string) => void;
  handleChapterClick: (sectionId: string, chapterId: string) => void;
  updateChapterProgress: (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => void;
}) => {
  const completedChapters =
    sectionProgress?.chapters.filter((c) => c.completed).length || 0;
  const totalChapters = section.capitulos.length;
  const isExpanded = expandedSections.includes(section.secaoid);

  return (
    <div className="chapters-sidebar__section">
      <div
        onClick={() => toggleSection(section.secaoid)}
        className="chapters-sidebar__section-header"
      >
        <div className="chapters-sidebar__section-title-wrapper">
          <p className="chapters-sidebar__section-number">
            Seção 0{index + 1}
          </p>
          {isExpanded ? (
            <ChevronUp className="chapters-sidebar__chevron" />
          ) : (
            <ChevronDown className="chapters-sidebar__chevron" />
          )}
        </div>
        <h3 className="chapters-sidebar__section-title">
          {section.secaotitulo}
        </h3>
      </div>
      <hr className="chapters-sidebar__divider" />
      {isExpanded && (
        <div className="chapters-sidebar__section-content">
          <ProgressVisuals
            section={section}
            sectionProgress={sectionProgress}
            completedChapters={completedChapters}
            totalChapters={totalChapters}
          />
          <ChaptersList
            section={section}
            sectionProgress={sectionProgress}
            chapterId={chapterId}
            courseId={courseId}
            handleChapterClick={handleChapterClick}
            updateChapterProgress={updateChapterProgress}
          />
        </div>
      )}
      <hr className="chapters-sidebar__divider" />
    </div>
  );
};

const ProgressVisuals = ({
  section,
  sectionProgress,
  completedChapters,
  totalChapters,
}: {
  section: Secao;
  sectionProgress: SecaoProgresso | undefined;
  completedChapters: number;
  totalChapters: number;
}) => (
  <>
    <div className="chapters-sidebar__progress">
      <div className="chapters-sidebar__progress-bars">
        {section.capitulos.map((chapter) => {
          const isCompleted = sectionProgress?.chapters.find(
            (c) => c.chapterId === chapter.capituloid
          )?.completed;
          return (
            <div
              key={chapter.capituloid}
              className={cn(
                "chapters-sidebar__progress-bar",
                isCompleted && "chapters-sidebar__progress-bar--completed"
              )}
            ></div>
          );
        })}
      </div>
      <div className="chapters-sidebar__trophy">
        <Trophy className="chapters-sidebar__trophy-icon" />
      </div>
    </div>
    <p className="chapters-sidebar__progress-text">
      {completedChapters}/{totalChapters} COMPLETO
    </p>
  </>
);

const ChaptersList = ({
  section,
  sectionProgress,
  chapterId,
  courseId,
  handleChapterClick,
  updateChapterProgress,
}: {
  section: Secao;
  sectionProgress: SecaoProgresso | undefined;
  chapterId: string;
  courseId: string;
  handleChapterClick: (sectionId: string, chapterId: string) => void;
  updateChapterProgress: (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => void;
}) => (
  <ul className="chapters-sidebar__chapters">
    {section.capitulos.map((chapter, index) => (
      <Chapter
        key={chapter.capituloid}
        chapter={chapter}
        index={index}
        sectionId={section.secaoid}
        sectionProgress={sectionProgress}
        chapterId={chapterId}
        courseId={courseId}
        handleChapterClick={handleChapterClick}
        updateChapterProgress={updateChapterProgress}
      />
    ))}
  </ul>
);

const Chapter = ({
  chapter,
  index,
  sectionId,
  sectionProgress,
  chapterId,
  courseId,
  handleChapterClick,
  updateChapterProgress,
}: {
  chapter: Capitulo;
  index: number;
  sectionId: string;
  sectionProgress: SecaoProgresso | undefined;
  chapterId: string;
  courseId: string;
  handleChapterClick: (sectionId: string, chapterId: string) => void;
  updateChapterProgress: (
    sectionId: string,
    chapterId: string,
    completed: boolean
  ) => void;
}) => {
  const chapterProgress = sectionProgress?.chapters.find(
    (c) => c.chapterId === chapter.capituloid
  );
  const isCompleted = chapterProgress?.completed;
  const isCurrentChapter = chapterId === chapter.capituloid;

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateChapterProgress(sectionId, chapter.capituloid, !isCompleted);
  };

  return (
    <li
      className={cn("chapters-sidebar__chapter", {
        "chapters-sidebar__chapter--current": isCurrentChapter,
      })}
      onClick={() => handleChapterClick(sectionId, chapter.capituloid)}
    >
      {isCompleted ? (
        <div
          className="chapters-sidebar__chapter-check"
          onClick={handleToggleComplete}
          title="Marcar como não concluído"
        >
          <CheckCircle className="chapters-sidebar__check-icon" />
        </div>
      ) : (
        <div
          className={cn("chapters-sidebar__chapter-number", {
            "chapters-sidebar__chapter-number--current": isCurrentChapter,
          })}
        >
          {index + 1}
        </div>
      )}
      <span
        className={cn("chapters-sidebar__chapter-title", {
          "chapters-sidebar__chapter-title--completed": isCompleted,
          "chapters-sidebar__chapter-title--current": isCurrentChapter,
        })}
      >
        {chapter.capitulotitulo}
      </span>
      {chapter.type === "Text" && (
        <FileText className="chapters-sidebar__text-icon" />
      )}
    </li>
  );
};

export default ChaptersSidebar;
