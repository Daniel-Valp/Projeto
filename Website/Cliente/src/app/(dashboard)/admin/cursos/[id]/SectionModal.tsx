import { CustomFormField } from '@/components/CustomFormField';
import CustomModal from '@/components/CustomModal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { SectionFormData, sectionSchema } from '@/lib/schemasajudas';
import { closeSectionModal, addSection, editSection } from '@/state';
import { Secao } from '@/types/Secçõestipo';

const SectionModal = () => {
  const dispatch = useAppDispatch();
  const {
    isSectionsModalOpen,
    selectedSectionIndex,
    sections,
  } = useAppSelector((state) => state.global.courseEditor);

  const section =
    selectedSectionIndex !== null
      ? sections[selectedSectionIndex]
      : null;

  const methods = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      secaotitulo: '',
      secaodescricao: '',
    },
  });

  useEffect(() => {
    if (section) {
      methods.reset({
        secaotitulo: section.secaotitulo,
        secaodescricao: section.secaodescricao,
      });
    } else {
      methods.reset({
        secaotitulo: '',
        secaodescricao: '',
      });
    }
  }, [section, methods]);

  const onClose = () => {
    dispatch(closeSectionModal());
  };

  const onSubmit = (data: SectionFormData) => {
    const newSection: Secao = {
        secaoid: section?.secaoid || uuidv4(),
        secaotitulo: data.secaotitulo,
        secaodescricao: data.secaodescricao,
        capitulos: section?.capitulos || [],
        chapters: undefined,
        cursoid: ''
    };

    if (selectedSectionIndex === null) {
      dispatch(addSection(newSection));
    } else {
      dispatch(editSection({ index: selectedSectionIndex, section: newSection }));
    }

    toast.success('Secção salva com sucesso!');
    onClose();
  };

  return (
    <CustomModal isOpen={isSectionsModalOpen} onClose={onClose}>
      <div className="section-modal">
        <div className="section-modal__header">
          <h2 className="section-modal__title">Adicionar/Editar Secção</h2>
          <button onClick={onClose} className="section-modal__close">
            <X className="w-6 h-6" />
          </button>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="section-modal__form">
            <CustomFormField
              name="secaotitulo"
              label="Título da Secção"
              placeholder="Digite o título"
            />

            <CustomFormField
              name="secaodescricao"
              label="Descrição da Secção"
              type="textarea"
              placeholder="Digite a descrição"
            />

            <div className="section-modal__actions mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <button
  type="submit"
  className="!bg-[#025E69] !hover:bg-[#014650] !text-white px-4 py-2 rounded-md transition-colors"
>
  Salvar
</button>
<button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">
  TESTE
</button>




            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default SectionModal;
