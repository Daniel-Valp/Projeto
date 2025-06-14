"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus, GripVertical } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import {
  setSections,
  deleteSection,
  deleteChapter,
  openSectionModal,
  openChapterModal,
} from "@/state";
import { Secao, Capitulo } from "@/types/Secçõestipo";

export default function DroppableComponent() {
  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  console.log("🧪 Sections dentro de DroppableComponent:", sections);


  const handleSectionDragEnd = (result: any) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedSections = [...sections];
    const [reorderedSection] = updatedSections.splice(startIndex, 1);
    updatedSections.splice(endIndex, 0, reorderedSection);
    dispatch(setSections(updatedSections));
  };

  const handleChapterDragEnd = (result: any, sectionIndex: number) => {
    if (!result.destination) return;

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const updatedSections = [...sections];
    const updatedChapters = [...updatedSections[sectionIndex].capitulos];
    const [reorderedChapter] = updatedChapters.splice(startIndex, 1);
    updatedChapters.splice(endIndex, 0, reorderedChapter);
    updatedSections[sectionIndex].capitulos = updatedChapters;
    dispatch(setSections(updatedSections));
  };

  return (
    <DragDropContext onDragEnd={handleSectionDragEnd}>
      <Droppable droppableId="sections">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {sections.map((section: Secao, sectionIndex: number) => {
  console.log("🎯 Renderizando seção:", section.secaotitulo);

  return (
    <Draggable
      key={`section-${section.secaoid}`}
      draggableId={`section-${section.secaoid}`}
      index={sectionIndex}
    >
      {(draggableProvider) => (
        <div
          ref={draggableProvider.innerRef}
          {...draggableProvider.draggableProps}
          className={`droppable-section ${
            sectionIndex % 2 === 0
              ? "droppable-section--even"
              : "droppable-section--odd"
          }`}
        >
          <SectionHeader
            secao={section}
            sectionIndex={sectionIndex}
            dragHandleProps={draggableProvider.dragHandleProps}
          />

          <DragDropContext
            onDragEnd={(result) =>
              handleChapterDragEnd(result, sectionIndex)
            }
          >
            <Droppable droppableId={`chapters-${section.secaoid}`}>
              {(droppableProvider) => (
                <div
                  ref={droppableProvider.innerRef}
                  {...droppableProvider.droppableProps}
                >
                  {section.capitulos.map(
                    (chapter: Capitulo, chapterIndex: number) => {
                      console.log("📘 Renderizando capítulo:", chapter.capitulotitulo);

                      return (
                        <Draggable
                          key={`chapter-${chapter.capituloid}`}
                          draggableId={`chapter-${chapter.capituloid}`}
                          index={chapterIndex}
                        >
                          {(draggableProvider) => (
                            <ChapterItem
                              chapter={chapter}
                              chapterIndex={chapterIndex}
                              sectionIndex={sectionIndex}
                              draggableProvider={draggableProvider}
                            />
                          )}
                        </Draggable>
                      );
                    }
                  )}
                  {droppableProvider.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button
  type="button"
  onClick={() =>
    dispatch(
      openChapterModal({
        sectionIndex,
        chapterIndex: null,
      })
    )
  }
  className="bg-[#025E69] text-white hover:bg-[#4FA6A8] hover:text-white px-3 py-2 text-xs rounded-md flex items-center gap-2 transition-colors"
>
  <Plus className="text-white" />
  <span>Adicionar capítulo</span>
</Button>

        </div>
      )}
    </Draggable>
  );
})}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

const SectionHeader = ({
  secao,
  sectionIndex,
  dragHandleProps,
}: {
  secao: Secao;
  sectionIndex: number;
  dragHandleProps: any;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className="droppable-section__header" {...dragHandleProps}>
      <div className="droppable-section__title-wrapper">
        <div className="droppable-section__title-container">
          <div className="droppable-section__title">
            <GripVertical className="h-6 w-6 mb-1" />
            <h3 className="text-lg font-medium">{secao.secaotitulo}</h3>
          </div>
          <div className="droppable-chapter__actions">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => dispatch(openSectionModal({ sectionIndex }))}
            >
              <Edit className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0"
              onClick={() => dispatch(deleteSection(sectionIndex))}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {secao.secaodescricao && (
          <p className="droppable-section__description">
            {secao.secaodescricao}
          </p>
        )}
      </div>
    </div>
  );
};

const ChapterItem = ({
  chapter,
  chapterIndex,
  sectionIndex,
  draggableProvider,
}: {
  chapter: Capitulo;
  chapterIndex: number;
  sectionIndex: number;
  draggableProvider: any;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div
      ref={draggableProvider.innerRef}
      {...draggableProvider.draggableProps}
      {...draggableProvider.dragHandleProps}
      className={`droppable-chapter ${
        chapterIndex % 2 === 1
          ? "droppable-chapter--odd"
          : "droppable-chapter--even"
      }`}
    >
      <div className="droppable-chapter__title">
        <GripVertical className="h-4 w-4 mb-[2px]" />
        <p className="text-sm">{`${chapterIndex + 1}. ${chapter.capitulotitulo}`}</p>
      </div>
      <div className="droppable-chapter__actions">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="droppable-chapter__button"
          onClick={() =>
            dispatch(
              openChapterModal({
                sectionIndex,
                chapterIndex,
              })
            )
          }
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="droppable-chapter__button"
          onClick={() =>
            dispatch(
              deleteChapter({
                sectionIndex,
                chapterIndex,
              })
            )
          }
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
