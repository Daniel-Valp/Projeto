"use client";

import Header from '@/components/Header';
import Loading from '@/components/Loading';
import TeacherCourseCard from '@/components/TeacherCourseCard';
import Toolbar from '@/components/Toolbar';
import { Button } from '@/components/ui/button';
import { courseCategories } from '@/lib/utils';
import { useApagarCursoMutation, useCriarCursoMutation, useGetCursosQuery } from '@/state/api';
import { Curso } from '@/types/Cursotipos';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'
import { toast } from 'sonner';

const Cursos = () => {
  const router = useRouter();
  const { user } = useUser();
  const {
    data: Cursos,
    isLoading,
    isError,
  } = useGetCursosQuery({ category: "all" });

  const [criarCurso] = useCriarCursoMutation();
  const [apagarCurso] = useApagarCursoMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectCategory] = useState("all");

  const filterCourses = useMemo(() => {
    if (!Cursos?.length) return [];

    return Cursos.filter((curso) => {
        const matchesSearch = searchTerm
            ? curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

        const matchesCategory =
            selectedCategory === "all" || 
            curso.subcategoria.nome.toLowerCase() === selectedCategory.toLowerCase(); // ✅ Correção aqui
        
        return matchesSearch && matchesCategory;
    });
    }, [Cursos, searchTerm, selectedCategory]);

    const handleEdit = (curso: Curso) => {
        router.push(`/teacher/cursos/${curso.cursoid}`);
    };
    
    const handleDelete = async (curso: Curso) => { // 🔥 Corrigido nome da função
        if (window.confirm("Tem a certeza que quer apagar este curso?")) {
            try {
                await apagarCurso(curso.cursoid).unwrap(); // 🔥 Garante que o erro será tratado corretamente
                toast.success("Curso apagado com sucesso!"); // 🔥 Melhor feedback visual
            } catch (error) {
                toast.error("Erro ao apagar curso. Tente novamente.");
            }
        }
    };
    
    const handleCreateCourse = async () => {
        if (!user) return;
    
        try {
            const result = await criarCurso({
                teacherId: user.id,
                teacherName: user.fullName || "Professor desconhecido",
            }).unwrap();
    
            toast.success("Curso criado com sucesso!"); // 🔥 Feedback visual
    
            router.push(`/teacher/courses/${result.cursoid}`);
        } catch (error) {
            toast.error("Erro ao criar curso. Tente novamente.");
        }
    };

    if (isLoading) return <Loading />;
    if (isError || !Cursos) return <div>Erro a carregar os cursos.</div>
    

  return <div className='teacher-courses'>
    <Header
        title='Cursos'
        subtitle='Veja todos os cursos existentes'
        rightElement={
            <Button
             onClick={handleCreateCourse}
             className='teacher-courses__header'>
                Criar Curso
             </Button>
        } 
     />
     <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectCategory}
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
}

export default Cursos