  "use client";

  import Header from '@/components/Header';
  import Loading from '@/components/Loading';
  import TeacherCourseCard from '@/components/TeacherCourseCard';
  import Toolbar from '@/components/Toolbar';
  import { Button } from '@/components/ui/button';
  import { useApagarCursoMutation, useCriarCursoMutation, useGetCursosQuery } from '@/state/api';
  import { Curso, Categoria, Subcategoria } from '@/types/Cursotipos'; // Importando Categoria e Subcategoria
  import { useUser } from '@clerk/nextjs';
  import { useRouter } from 'next/navigation';
  import React, { useMemo, useState } from 'react'
  import { toast } from 'sonner';

  const Cursos = () => {
    const router = useRouter();
    const { user } = useUser();
    const { data: Cursos, isLoading, isError } = useGetCursosQuery({ category: "all" });

    const [criarCurso] = useCriarCursoMutation();
    const [apagarCurso] = useApagarCursoMutation();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectCategory] = useState<string>("all");
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");


    const filterCourses = useMemo(() => {
      if (!Cursos?.length) return [];
    
      return Cursos.filter((curso) => {
        const matchesSearch = searchTerm
          ? curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
          : true;
    
        const matchesCategory =
          selectedCategory === "all" ||
          curso.categoria.id.toLowerCase() === selectedCategory.toLowerCase();
    
        const matchesSubcategory =
          selectedSubcategory === "all" ||
          String(curso.subcategoria?.subcategoriaid) === selectedSubcategory;
    
        return matchesSearch && matchesCategory && matchesSubcategory;
      });
    }, [Cursos, searchTerm, selectedCategory, selectedSubcategory]);
    

    const handleEdit = (curso: Curso) => {
      router.push(`/teacher/cursos/${curso.cursoid}`);
    };

    const handleDelete = async (curso: Curso) => { // 🔥 Corrigido nome da função
      if (window.confirm("Tem a certeza que quer apagar este curso?")) {
        try {
          console.log("Tentando apagar curso:", curso.cursoid); // Log para verificar qual curso está sendo apagado
          await apagarCurso(curso.cursoid).unwrap(); // 🔥 Garante que o erro será tratado corretamente
          toast.success("Curso apagado com sucesso!"); // 🔥 Melhor feedback visual
        } catch (error) {
          console.error("Erro ao apagar curso:", error); // Log de erro ao tentar apagar o curso
          toast.error("Erro ao apagar curso. Tente novamente.");
        }
      }
    };

    const handleCreateCourse = async () => {
  if (!user) return;

  const cursoData = {
    professorid: user.id,
    professornome: user.fullName || "Professor desconhecido",
    categoria_id: 1,          // Substitua por uma categoria default se necessário
    subcategoriaid: 1,          // Substitua por uma subcategoria default se necessário
    titulo: "Novo Curso",       // Campos mínimos exigidos pela sua API
    descricao: "Descrição padrão do curso"
  };

  try {
    const result = await criarCurso(cursoData).unwrap();

    if (!result?.cursoid) {
      throw new Error("Resposta da API não contém 'cursoid'");
    }

    toast.success("Curso criado com sucesso!");
    router.push(`/teacher/cursos/${result.cursoid}`);
  } catch (error) {
    console.error("Erro ao criar curso:", error);
    toast.error("Erro ao criar curso. Tente novamente.");
  }
};


    

    return (
      <div className='teacher-courses'>
        <Header
          title='Cursos'
          subtitle='Veja todos os cursos existentes'
          rightElement={
            <Button onClick={handleCreateCourse} className='teacher-courses__header'>
              Criar Curso
            </Button>
          }
        />
        <Toolbar 
    onSearch={setSearchTerm} 
    onCategoryChange={setSelectCategory} 
    onSubcategoryChange={setSelectedSubcategory} 
  />

        <div className="teacher-courses__grid">
          {filterCourses.map((curso) => {
            // Adicionando o log para verificar os dados do 'curso'
            console.log("Curso:", curso); // Verifica se 'curso' está correto e tem a categoria

            return (
              <TeacherCourseCard
                key={curso.cursoid || curso.id} // Garante uma chave única válida
                curso={curso} // Passando 'curso' corretamente
                onEdit={handleEdit}
                onDelete={handleDelete}
                isOwner={curso.professorid === user?.id}
              />
            );
          })}
        </div>
      </div>
    );
  };

  export default Cursos;
