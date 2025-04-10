import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Secao, Capitulo } from "@/types/Secçõestipo"; // 👈 certifica-te que este path está correto

interface initialStateType {
  courseEditor: {
    sections: Secao[];
    isChapterModalOpen: boolean;
    isSectionsModalOpen: boolean;
    selectedSectionIndex: number | null;
    selectedChapterIndex: number | null;
  };
}

const initialState: initialStateType = {
  courseEditor: {
    sections: [],
    isChapterModalOpen: false,
    isSectionsModalOpen: false,
    selectedSectionIndex: null,
    selectedChapterIndex: null,
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSections: (state, action: PayloadAction<Secao[]>) => {
      state.courseEditor.sections = action.payload;
    },
    openChapterModal: (
      state,
      action: PayloadAction<{
        sectionIndex: number | null;
        chapterIndex: number | null;
      }>
    ) => {
      state.courseEditor.isChapterModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
      state.courseEditor.selectedChapterIndex = action.payload.chapterIndex;
    },
    closeChapterModal: (state) => {
      state.courseEditor.isChapterModalOpen = false;
      state.courseEditor.selectedSectionIndex = null;
      state.courseEditor.selectedChapterIndex = null;
    },
    openSectionModal: (
      state,
      action: PayloadAction<{ sectionIndex: number | null }>
    ) => {
      state.courseEditor.isSectionsModalOpen = true;
      state.courseEditor.selectedSectionIndex = action.payload.sectionIndex;
    },
    closeSectionModal: (state) => {
      state.courseEditor.isSectionsModalOpen = false;
      state.courseEditor.selectedChapterIndex = null;
    },
    addSection: (state, action: PayloadAction<Secao>) => {
      state.courseEditor.sections.push(action.payload);
    },
    editSection: (
      state,
      action: PayloadAction<{ index: number; section: Secao }>
    ) => {
      state.courseEditor.sections[action.payload.index] =
        action.payload.section;
    },
    deleteSection: (state, action: PayloadAction<number>) => {
      state.courseEditor.sections.splice(action.payload, 1);
    },
    addChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapter: Capitulo }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].capitulos.push(
        action.payload.chapter
      );
    },
    editChapter: (
      state,
      action: PayloadAction<{
        sectionIndex: number;
        chapterIndex: number;
        chapter: Capitulo;
      }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].capitulos[
        action.payload.chapterIndex
      ] = action.payload.chapter;
    },
    deleteChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapterIndex: number }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].capitulos.splice(
        action.payload.chapterIndex,
        1
      );
    },
  },
});

export const {
  setSections,
  openChapterModal,
  closeChapterModal,
  openSectionModal,
  closeSectionModal,
  addSection,
  editSection,
  deleteSection,
  addChapter,
  editChapter,
  deleteChapter,
} = globalSlice.actions;

export default globalSlice.reducer;
