import { CustomFormField } from '@/components/CustomFormField';
import CustomModal from '@/components/CustomModal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { addChapter, closeChapterModal, editChapter } from '@/state';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ChapterFormData, chapterSchema } from '@/lib/schemasajudas';
import { Capitulo } from '@/types/Secçõestipo';

const ChapterModal = () => {
  const dispatch = useAppDispatch();
  const {
    isChapterModalOpen,
    selectedSectionIndex,
    selectedChapterIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  const chapter: Capitulo | undefined =
    selectedSectionIndex !== null && selectedChapterIndex !== null
      ? sections[selectedSectionIndex].capitulos[selectedChapterIndex]
      : undefined;

  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
        capitulotitulo: '',
        conteudo: '',
        video: undefined, // melhor do que string vazia
      }
      
  });

  useEffect(() => {
    if (chapter) {
      methods.reset({
        capitulotitulo: chapter.capitulotitulo,
        conteudo: chapter.conteudo,
        video: typeof chapter.video === 'string' ? chapter.video : undefined,
      });
    } else {
      methods.reset({
        capitulotitulo: '',
        conteudo: '',
        video: undefined,
      });
    }
  }, [chapter, methods]);
  
  
  

  const onClose = () => {
    dispatch(closeChapterModal());
  };

  const onSubmit = (data: ChapterFormData) => {
    if (selectedSectionIndex === null) return;

    const newChapter: Capitulo = {
      capituloid: chapter?.capituloid || uuidv4(),
      secaoid: sections[selectedSectionIndex].secaoid,
      capitulotitulo: data.capitulotitulo,
      conteudo: data.conteudo,
      type: data.video ? 'Video' : 'Text',
      video: data.video || null,
      freepreview: false, // ou true se quiseres por default
    };

    if (selectedChapterIndex === null) {
      dispatch(
        addChapter({
          sectionIndex: selectedSectionIndex,
          chapter: newChapter,
        })
      );
    } else {
      dispatch(
        editChapter({
          sectionIndex: selectedSectionIndex,
          chapterIndex: selectedChapterIndex,
          chapter: newChapter,
        })
      );
    }

    toast.success('Capítulo salvo com sucesso!');
    onClose();
  };

  return (
    <CustomModal isOpen={isChapterModalOpen} onClose={onClose}>
      <div className="chapter-modal">
        <div className="chapter-modal__header">
          <h2 className="chapter-modal__title">Adicionar/Editar Capítulo</h2>
          <button onClick={onClose} className="chapter-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <CustomFormField
              name="capitulotitulo"
              label="Título do Capítulo"
              placeholder="Digite o título"
            />

            <CustomFormField
              name="conteudo"
              label="Conteúdo do Capítulo"
              type="textarea"
              placeholder="Digite o conteúdo"
            />

              <FormField
                control={methods.control}
                name="video"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Link do Vídeo (YouTube)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        {...field}
                        className="bg-customgreys-darkGrey py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />


            <div className="chapter-modal__actions mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button
  type="submit"
  className="bg-[#025E69] text-white hover:bg-[#4FA6A8]"
>
  Salvar Capítulo
</Button>


            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default ChapterModal;
