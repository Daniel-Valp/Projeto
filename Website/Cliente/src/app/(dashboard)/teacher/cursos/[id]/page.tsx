"use client";

import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form'; 
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
import { cursoFormSchema, CursoFormData } from '@/lib/schemasajudas';
import { criarCursoFormData, fazerUploadVideos } from '@/lib/ajudas';
import { Form } from '@/components/ui/form';
import Header from '@/components/Header';
import { CustomFormField } from '@/components/CustomFormField';
import { Button } from '@/components/ui/button';
import DroppableComponent from '@/components/Droppable';
import { useEffect, useState } from 'react';
import ChapterModal from './ChapterModal';
import SectionModal from './SectionModal';

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

  const [imagePreview, setImagePreview] = useState<string | null>(curso?.imagem || null);


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
    console.log("🟨 useEffect ativado");
  
    if (!curso || categorias.length === 0 || subcategorias.length === 0) {
      console.log("⛔ Dados ainda não prontos");
      return;
    }
  
    console.log("🧩 curso.categoria:", curso.categoria);
    console.log("🧩 curso.subcategoria:", curso.subcategoria);
  
    // ⬅️ Adiciona este log aqui
    console.log("🧪 curso.secoes recebido:", curso.secoes);
  
    const valores = {
      cursotitulo: curso.titulo || "",
      cursodescricao: curso.descricao || "",
      cursocategoria: String(curso.categoria?.id || ""),
      cursosubcategoria: String(curso.subcategoria?.subcategoriaid || ""),
      cursohoras: String(curso.horas || "0"),
      cursoestado: curso.estado === "Publicado",
    };
  
    console.log("✅ Valores para reset:", valores);
  
    methods.reset(valores);
    dispatch(setSections(curso.secoes || [])); // <- este é o alvo


    if (curso.imagem) {
      setImagePreview(curso.imagem);
    }
  }, [curso, categorias, subcategorias]);
  
  
  
  

  useEffect(() => {
    console.log("📦 Sections no componente:", sections);
  }, [sections]);
  


  const onSubmit: SubmitHandler<CursoFormData> = async (data) => {
    try {
      const secoesAtualizadas = await fazerUploadVideos(sections, id, uploadVideo);
      const formData = criarCursoFormData(data, secoesAtualizadas);
  
      // 👇 ADICIONA ISTO PARA VERIFICAR OS CAMPOS ENVIADOS
      for (let [key, value] of formData.entries()) {
        console.log(`📦 ${key}:`, value);
      }
  
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
      <div className="p-6">
      <div className="flex items-center gap-5 mb-5">
       <button
  className="flex items-center border rounded-lg p-2 gap-2 border-[#025E69] text-[#025E69]"
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
                  className="bg-[#025E69] hover:bg-[#014650] text-white"
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
  label="Título do curso"
  type="text"
  placeholder="Escreva o título aqui"
  className="border-none"
  labelClassName="text-[#025E69]"
/>



                <CustomFormField
                  name="cursodescricao"
                  label="Descrição do Curso"
                  type="textarea"
                  placeholder="Escreva a sua descrição aqui"
                  inputClassName="min-h-[200px]" // Aplica ao textarea diretamente
                    labelClassName="text-[#025E69]"


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
                    labelClassName="text-[#025E69]"

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
                    labelClassName="text-[#025E69]"

                />

                <CustomFormField
                  name="cursohoras"
                  label="Horas do Curso"
                  type="number"
                  placeholder="0"
                    labelClassName="text-[#025E69]"

                />

<Controller
  name="cursoimagem"
  control={methods.control}
  render={({ field }) => (
    <div>
      <label className="block text-sm font-medium mb-1 text-[#025E69]">
        Imagem do Curso
      </label>

      <div className="relative w-fit">
        <input
          id="upload-imagem"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const imageUrl = URL.createObjectURL(file);
              setImagePreview(imageUrl);
              field.onChange(file);
            }
          }}
          className="hidden"
        />
        <label
          htmlFor="upload-imagem"
          className="cursor-pointer px-4 py-2 bg-[#025E69] text-white rounded hover:bg-[#014650] transition"
        >
          Selecionar Imagem
        </label>
      </div>

      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview da imagem"
          className="mt-2 rounded-md w-full max-w-md"
        />
      )}
    </div>
  )}
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
                  <span className="text-[#F3F7F5] group-hover:text-[#014650]">
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
