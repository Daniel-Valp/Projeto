"use client";

import { useParams, useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ArrowLeft, Plus } from 'lucide-react';
import { useAtualizarCursoMutation, useGetCursoQuery, useUploadVideoMutation } from '@/state/api';
import { useAppDispatch, useAppSelector } from '@/state/redux';
import { openSectionModal, setSections } from '@/state';
import { cursoFormSchema, CursoFormData } from '@/types/Cursotipos';
import { criarCursoFormData, fazerUploadVideos } from '@/lib/ajudas';
import { Form } from '@/components/ui/form';
import Header from '@/components/Header';
import { CustomFormField } from '@/components/CustomFormField';
import { Button } from '@/components/ui/button';
import { Droppable } from '@hello-pangea/dnd';
import DroppableComponent from '@/components/Droppable';
import { useEffect } from 'react';

const CourseEditor = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { data: curso, isLoading, refetch } = useGetCursoQuery(id as string); // Usando o id como string
  const [updateCourse] = useAtualizarCursoMutation();
  const [uploadVideo] = useUploadVideoMutation(); // Usando o hook de upload de vídeo

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
        cursosubcategoria: curso.subcategoria?.subcategoriaid || "",
        cursohoras: curso.horas.toString(),
        cursoestado: curso.estado === "Publicado", // Corrigido para 'cursoestado'
      });
      dispatch(setSections(curso.secoes || []));
    }
  }, [curso, methods, dispatch]);

  // Função onSubmit com a tipagem correta
  const onSubmit: SubmitHandler<CursoFormData> = async (data) => {
    try {
      // 1. Faz upload dos vídeos primeiro (opcional mas recomendado)
      const secoesAtualizadas = await fazerUploadVideos(sections, id as string, uploadVideo); // Passando o hook de upload de vídeo aqui

      // 2. Cria o FormData com os dados e as seções com vídeos já enviados
      const formData = criarCursoFormData(data, secoesAtualizadas);

      // 3. Envia para a API
      await updateCourse({
        cursoid: id as string,
        formData: formData,
      }).unwrap();

      // 4. Refaz o fetch do curso
      refetch();

      // 5. Feedback pro user
      toast.success("Curso atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o curso:", error);
      toast.error("Falha ao atualizar o curso");
    }
  };

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
                  name="cursoestado" // Corrigido para 'cursoestado' que é o nome correto do campo
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
                  className="bg-primary-50 hover:bg-primary-200"
                >
                  {methods.watch("cursoestado")
                    ? "Update Published Course"
                    : "Save Draft"}
                </Button>
              </div>
            }
          />

            <div className='flex justify-between md:flex-row flex-col gap-10 mt-5 font-dm-sans'>
                <div className='basis-1/2'>
                    <div className='space-y-4'>
                    <CustomFormField
                          name='cursotitulo'
                          label='Course Title'
                          type='text'
                          placeholder='Escreva o titulo aqui'
                          className='border-none'
                          initialValue={curso?.titulo}
                        />


                        <CustomFormField
                          name='cursodescricao'
                          label='Descrição do Curso'
                          type='textarea'
                          placeholder='Escreva a sua descrição aqui'
                          initialValue={curso?.descricao}
                        />

                        <CustomFormField
                          name='cursocategoria'
                          label='Categoria do Curso'
                          type='select'
                          placeholder='Escolha a categoria'
                          options={[{ value: "software", label: "software" }]}
                          initialValue={curso?.categoria?.id}
                        />

                        <CustomFormField
                          name='cursosubcategoria'
                          label='Subcategoria do Curso'
                          type='select'
                          placeholder='Escolha a subcategoria'
                          options={[{ value: "web", label: "Web" }]} // Aqui idealmente puxas da API
                          initialValue={curso?.subcategoria?.subcategoriaid}
                        />

                        <CustomFormField
                          name='cursohoras'
                          label='Horas do Curso'
                          type='number'
                          placeholder='0'
                          initialValue={curso?.horas}
                        />
                    </div>
                </div>

                <div className='bg-customgreys-darkGrey mt-4 md:mt-0 p-4 rounded-lg basis-1/2'>
                  <div className='flex justify-between items-center mb-2'>
                    <h2 className='text-2xl font-semibold text-secondary-foreground'>
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
                            <p>Nenhuma secção disponivel</p>
                        )}
                </div>
            </div>
        </form>
      </Form>
    </div>
  );
};

export default CourseEditor;
