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
    router.push(`/user/courses/${courseId}/chapters/${chapterId}`, {
      scroll: false,
    });
  };

  if (isLoading) return <Loading />;
  if (!course) return <div>Erro ao carregar o curso</div>;

  return (
    <div ref={sidebarRef} className="chapters-sidebar overflow-x-hidden">
      <div className="chapters-sidebar__header">
        <h2 className="chapters-sidebar__title">{course.titulo}</h2>
        <hr className="chapters-sidebar__divider" />
      </div>

      {course.secoes.map((secao, index) => {
        // Garantir que não estamos duplicando as seções
        if (!secao || !secao.capitulos || !secao.capitulos.length) return null;

        const isExpanded = expandedSections.includes(secao.secaoid);
        const totalChapters = secao.capitulos.length;
        const completedChapters = 0; // Progresso pode ser integrado aqui

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
                  <div className="chapters-sidebar__progress-bars">
                    {secao.capitulos.map((capitulo) => (
                      <div
                        key={capitulo.capituloid}
                        className="chapters-sidebar__progress-bar"
                      />
                    ))}
                  </div>
                  <div className="chapters-sidebar__trophy">
                    <Trophy className="chapters-sidebar__trophy-icon" />
                  </div>
                </div>
                <p className="chapters-sidebar__progress-text">
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
