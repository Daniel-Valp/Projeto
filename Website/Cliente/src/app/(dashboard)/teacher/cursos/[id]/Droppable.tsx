"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import { useEffect } from "react";

import { useAtualizarCursoMutation, useGetCursoQuery, useUploadVideoMutation } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { openSectionModal, setSections } from "@/state";
import { cursoFormSchema, CursoFormData } from "@/types/Cursotipos";
import { criarCursoFormData, fazerUploadVideos } from "@/lib/ajudas";

import { Form } from "@/components/ui/form";
import Header from "@/components/Header";
import { CustomFormField } from "@/components/CustomFormField";
import { Button } from "@/components/ui/button";
import DroppableComponent from "@/components/Droppable";
//import ChapterModal from "@/components/ChapterModal";
//import SectionModal from "@/components/SectionModal";

const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: curso, isLoading, refetch } = useGetCursoQuery(id);
  const [updateCourse] = useAtualizarCursoMutation();
  const [uploadVideo] = useUploadVideoMutation();

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
    if (curso) {
      methods.reset({
        cursotitulo: curso.titulo,
        cursodescricao: curso.descricao,
        cursocategoria: curso.categoria?.id || "",
        cursosubcategoria: curso.subcategoria?.subcategoriaid.toString() || "",
        cursohoras: curso.horas.toString(),
        cursoestado: curso.estado === "Publicado",
      });
      dispatch(setSections(curso.secoes || []));
    }
  }, [curso, methods, dispatch]);

  const onSubmit: SubmitHandler<CursoFormData> = async (data) => {
    try {
      const secoesAtualizadas = await fazerUploadVideos(sections, id, uploadVideo);

      const formData = criarCursoFormData(data, secoesAtualizadas);

      await updateCourse({ cursoid: id, formData }).unwrap();

      refetch();
      toast.success("Curso atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      toast.error("Erro ao atualizar o curso.");
    }
  };

  return (
    <div>
      <div className="flex items-center gap-5 mb-5">
        <button
          className="flex items-center border border-customgreys-dirtyGrey rounded-lg p-2 gap-2 cursor-pointer hover:bg-customgreys-dirtyGrey hover:text-white-100 text-customgreys-dirtyGrey"
          onClick={() => router.push("/teacher/cursos")}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar aos cursos</span>
        </button>
      </div>

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Header
            title="Edição do Curso"
            subtitle="Edite as informações do seu curso"
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
                <Button type="submit" className="bg-primary-700 hover:bg-primary-600">
                  {methods.watch("cursoestado") ? "Atualizar Curso" : "Salvar Rascunho"}
                </Button>
              </div>
            }
          />

          <div className="flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans">
            <div className="basis-1/2 space-y-4">
              <CustomFormField
                name="cursotitulo"
                label="Título do Curso"
                type="text"
                placeholder="Digite o título"
              />
              <CustomFormField
                name="cursodescricao"
                label="Descrição"
                type="textarea"
                placeholder="Digite a descrição"
              />
              <CustomFormField
                name="cursocategoria"
                label="Categoria"
                type="select"
                placeholder="Escolha a categoria"
                options={[
                  { value: "1", label: "Tecnologia" },
                  { value: "2", label: "Negócios" },
                ]}
              />
              <CustomFormField
                name="cursosubcategoria"
                label="Subcategoria"
                type="select"
                placeholder="Escolha a subcategoria"
                options={[
                  { value: "10", label: "Frontend" },
                  { value: "11", label: "Backend" },
                ]}
              />
              <CustomFormField
                name="cursohoras"
                label="Horas"
                type="number"
                placeholder="0"
              />
            </div>

            <div className="bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-semibold text-secondary-foreground">Seções</h2>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(openSectionModal({ sectionIndex: null }))}
                  className="border-none text-primary-700 group"
                >
                  <Plus className="mr-1 h-4 w-4 text-primary-700 group-hover:white-100" />
                  <span className="text-primary-700 group-hover:white-100">Adicionar Seção</span>
                </Button>
              </div>

              {isLoading ? (
                <p>A carregar conteúdo do curso...</p>
              ) : sections.length > 0 ? (
                <DroppableComponent />
              ) : (
                <p>Nenhuma seção disponível</p>
              )}
            </div>
          </div>
        </form>
      </Form>

{/*       <ChapterModal />
      <SectionModal /> */}
    </div>
  );
};

export default CourseEditor;
