"use client";

import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Plus } from 'lucide-react';
import {
  useAtualizarCursoMutation,
  useGetCursoQuery,
  useUploadVideoMutation,
  useGetCategoriasQuery,
  useGetSubcategoriasQuery,
} from '@/state/api';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { openSectionModal, setSections } from '@/state';
import { cursoFormSchema, CursoFormData } from '@/types/Cursotipos';
import { criarCursoFormData, fazerUploadVideos } from '@/lib/ajudas';
import { Form } from '@/components/ui/form';
import Header from '@/components/Header';
import { CustomFormField } from '@/components/CustomFormField';
import { Button } from '@/components/ui/button';
import DroppableComponent from '@/components/Droppable';
import { useEffect } from 'react';

const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { data: curso, isLoading, refetch } = useGetCursoQuery(id);
  const [updateCourse] = useAtualizarCursoMutation();
  const [uploadVideo] = useUploadVideoMutation();
  const { data: categorias = [], isLoading: isLoadingCategorias } = useGetCategoriasQuery();
  const { data: subcategorias = [], isLoading: isLoadingSubcategorias } = useGetSubcategoriasQuery();

  const dispatch = useAppDispatch();
  const { sections } = useAppSelector((state) => state.global.courseEditor);

  const methods = useForm<CursoFormData>({
    resolver: zodResolver(cursoFormSchema),
    defaultValues: {
      cursotitulo: "",
      cursodescricao: "",
      cursocategoria: "",
      cursosubcategoria: "",
      cursohoras: "0",
      cursoestado: false,
    },
  });

  useEffect(() => {
    if (!curso || !categorias.length || !subcategorias.length) return;
  
    const valores = {
      cursotitulo: curso.titulo || "",
      cursodescricao: curso.descricao || "",
      cursocategoria: String(curso.categoria?.id || ""),
      cursosubcategoria: String(curso.subcategoria?.subcategoriaid || ""),
      cursohoras: String(curso.horas || "0"),
      cursoestado: curso.estado === "Publicado",
    };
  
    methods.reset(valores);
    dispatch(setSections(curso.secoes || []));
  }, [curso?.id, categorias.length, subcategorias.length]);
  

  const onSubmit: SubmitHandler<CursoFormData> = async (data) => {
    try {
      const secoesAtualizadas = await fazerUploadVideos(sections, id, uploadVideo);
      const formData = criarCursoFormData(data, secoesAtualizadas);

      await updateCourse({
        cursoid: id,
        formData: formData,
      }).unwrap();

      refetch();
      toast.success("Curso atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o curso:", error);
      toast.error("Falha ao atualizar o curso");
    }
  };

  if (isLoading || isLoadingCategorias || isLoadingSubcategorias) {
    return <p>A carregar curso e categorias...</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtygrey rounded-lg p-2 gap-2"
          onClick={() => router.push("/teacher/cursos")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos cursos</span>
        </button>
      </div>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Header
            title="Criação do curso"
            subtitle="Crie o seu próprio curso e publique"
            rightElement={
              <div className="flex items-center space-x-4">
                <CustomFormField
                  name="cursoestado"
                  label={methods.watch("cursoestado") ? "Publicado" : "Rascunho"}
                  type="switch"
                  className="flex items-center space-x-2"
                  labelClassName={`text-sm font-medium ${
                    methods.watch("cursoestado") ? "text-green-500" : "text-yellow-500"
                  }`}
                  inputClassName="data-[state=checked]:bg-green-500"
                />
                <Button
                  type="submit"
                  className="bg-primary-50 hover:bg-stone-900"
                >
                  {methods.watch("cursoestado")
                    ? "Publicar curso"
                    : "Guardar rascunho"}
                </Button>
              </div>
            }
          />

          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            <div className="basis-1/2">
              <div className="space-y-4">
                <CustomFormField
                  name="cursotitulo"
                  label="Course Title"
                  type="text"
                  placeholder="Escreva o titulo aqui"
                  className="border-none"
                />

                <CustomFormField
                  name="cursodescricao"
                  label="Descrição do Curso"
                  type="textarea"
                  placeholder="Escreva a sua descrição aqui"
                />

                <CustomFormField
                  name="cursocategoria"
                  label="Categoria do Curso"
                  type="select"
                  placeholder="Escolha a categoria"
                  options={categorias.map((cat) => ({
                    value: cat.id,
                    label: cat.nome,
                  }))}
                />

                <CustomFormField
                  name="cursosubcategoria"
                  label="Subcategoria do Curso"
                  type="select"
                  placeholder="Escolha a subcategoria"
                  options={subcategorias.map((sub) => ({
                    value: String(sub.subcategoriaid),
                    label: sub.nome,
                  }))}
                />

                <CustomFormField
                  name="cursohoras"
                  label="Horas do Curso"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-secondary-foreground">
                  Secções
                </h2>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    dispatch(openSectionModal({ sectionIndex: null }))
                  }
                  className="border-none text-primary-200 group"
                >
                  <Plus className="mr-1 h-4 w-4 text-primary-100 group-hover:white-100" />
                  <span className="text-primary-100 group-hover:white-100">
                    Adicionar Secção
                  </span>
                </Button>
              </div>

              {isLoading ? (
                <p>A carregar os componentes dos cursos...</p>
              ) : sections.length > 0 ? (
                <DroppableComponent />
              ) : (
                <p>Nenhuma secção disponível</p>
              )}
            </div>
          </div>
        </form>
      </Form>

      <ChapterModal />
      <SectionModal />
    </div>
  );
};

export default CourseEditor;
