'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronDown, ChevronUp, FileText, Trophy } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { CursoComSecoes } from '@/types/Secçõestipo';
import { cn } from '@/lib/utils';
import Loading from '@/components/Loading';

const ChaptersSidebar = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.courseId as string;
  const chapterId = params?.chapterid as string;

  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [course, setCourse] = useState<CursoComSecoes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewedChapters, setViewedChapters] = useState<string[]>([]); // Estado local para capítulos visualizados

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`http://localhost:5000/cursos/${courseId}`);
        const data = await res.json();
        setCourse(data.data);
      } catch (err) {
        console.error("Erro ao buscar o curso:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  const toggleSection = (secaoid: string) => {
    setExpandedSections((prev) =>
      prev.includes(secaoid)
        ? prev.filter((id) => id !== secaoid)
        : [...prev, secaoid]
    );
  };

  const handleChapterClick = (sectionId: string, chapterId: string) => {
    // Primeiro marca como visto
    setViewedChapters((prev) =>
      prev.includes(chapterId) ? prev : [...prev, chapterId]
    );
  
    // Depois navega
    router.push(`/user/courses/${courseId}/chapters/${chapterId}`, {
      scroll: false,
    });
  };


  // codigo para guardar o progresso do curso

/*   useEffect(() => {
  const stored = sessionStorage.getItem("viewedChapters");
  if (stored) {
    setViewedChapters(JSON.parse(stored));
  }
}, []);

useEffect(() => {
  // Só salva se já estiver carregado algo antes (evita sobrescrever com [])
  if (viewedChapters.length > 0) {
    sessionStorage.setItem("viewedChapters", JSON.stringify(viewedChapters));
  }
}, [viewedChapters]); */

    

  if (isLoading) return <Loading />;
  if (!course) return <div>Erro ao carregar o curso</div>;

  return (
    <div ref={sidebarRef} className="chapters-sidebar overflow-x-hidden">
      <div className="chapters-sidebar__header">
        <h2 className="chapters-sidebar__title">{course.titulo}</h2>
        <hr className="chapters-sidebar__divider" />
      </div>

      {course.secoes.map((secao, index) => {
        if (!secao || !secao.capitulos || !secao.capitulos.length) return null;

        const isExpanded = expandedSections.includes(secao.secaoid);
        const totalChapters = secao.capitulos.length;
const completedChapters = secao.capitulos.filter((cap) =>
  viewedChapters.includes(cap.capituloid)
).length;


        return (
          <div key={secao.secaoid} className="chapters-sidebar__section">
            <div
              onClick={() => toggleSection(secao.secaoid)}
              className="chapters-sidebar__section-header"
            >
              <div className="chapters-sidebar__section-title-wrapper">
                <p className="chapters-sidebar__section-number">
                  Section 0{index + 1}
                </p>
                {isExpanded ? (
                  <ChevronUp className="chapters-sidebar__chevron" />
                ) : (
                  <ChevronDown className="chapters-sidebar__chevron" />
                )}
              </div>
              <h3 className="chapters-sidebar__section-title">
                {secao.secaotitulo}
              </h3>
            </div>

            <hr className="chapters-sidebar__divider" />

            {isExpanded && (
              <div className="chapters-sidebar__section-content">
                <div className="chapters-sidebar__progress">
  <div className="chapters-sidebar__progress-bars flex gap-1">
    {secao.capitulos.map((capitulo) => (
      <div
        key={capitulo.capituloid}
        className={cn(
          "h-2 flex-1 rounded bg-gray-300",
          viewedChapters.includes(capitulo.capituloid) && "bg-green-500"
        )}
      />
    ))}
  </div>
  <div className="chapters-sidebar__trophy ml-2">
    <Trophy
      className={cn(
        "chapters-sidebar__trophy-icon transition-colors",
        completedChapters === totalChapters && "text-[#FFD700]"
      )}
    />
  </div>
</div>

                <p className="chapters-sidebar__progress-text text-xs text-muted-foreground mt-1">
                  {completedChapters}/{totalChapters} COMPLETED
                </p>

                <ul className="chapters-sidebar__chapters">
                  {secao.capitulos.map((capitulo, i) => {
                    const isCurrent = chapterId === capitulo.capituloid;

                    return (
                      <li
                        key={capitulo.capituloid}
                        className={cn("chapters-sidebar__chapter", {
                          "chapters-sidebar__chapter--current": isCurrent,
                        })}
                        onClick={() =>
                          handleChapterClick(secao.secaoid, capitulo.capituloid)
                        }
                      >
                        <div
                          className={cn("chapters-sidebar__chapter-number", {
                            "chapters-sidebar__chapter-number--current":
                              isCurrent,
                          })}
                        >
                          {i + 1}
                        </div>
                        <span
                          className={cn("chapters-sidebar__chapter-title", {
                            "chapters-sidebar__chapter-title--current":
                              isCurrent,
                          })}
                        >
                          {capitulo.capitulotitulo}
                        </span>
                        {capitulo.type === "Text" && (
                          <FileText className="chapters-sidebar__text-icon" />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            <hr className="chapters-sidebar__divider" />
          </div>
        );
      })}
    </div>
  );
};

export default ChaptersSidebar;
