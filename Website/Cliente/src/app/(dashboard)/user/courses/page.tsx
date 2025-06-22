"use client";

import Header from '@/components/Header';
import Loading from '@/components/Loading';
import TeacherCourseCard from '@/components/TeacherCourseCard';
import Toolbar from '@/components/Toolbar';
import { useGetCursosQuery } from '@/state/api';
import { Curso } from '@/types/Cursotipos';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';



const TodosCursos = () => {
  const router = useRouter();
  const { user } = useUser();
  const { data: Cursos, isLoading, isError } = useGetCursosQuery({ category: "all" });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  

  const filterCourses = useMemo(() => {
  if (!Cursos?.length) return [];

  const role = user?.publicMetadata?.role;
  const isAluno = role !== "professor" && role !== "admin";

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

    const isPublicado = !isAluno || curso.estado === "Publicado";

    return matchesSearch && matchesCategory && matchesSubcategory && isPublicado;
  });
}, [Cursos, searchTerm, selectedCategory, selectedSubcategory, user]);


  const handleGoToCourse = (curso: Curso) => {
    router.push(`/detalhes?id=${curso.cursoid}`);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>Erro ao carregar os cursos</div>;

  return (
    <div className="all-courses p-6">
      <Header
        title="Todos os Cursos"
        subtitle="Explore todos os cursos disponíveis na plataforma"
      />

      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
      />

      <div className="teacher-courses__grid">
        {filterCourses.map((curso) => (
          <TeacherCourseCard
            key={curso.cursoid}
            curso={curso}
            isOwner={false} // Oculta os botões de ação (editar/apagar)
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default TodosCursos;
