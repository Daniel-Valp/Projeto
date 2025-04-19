"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Toolbar from "@/components/Toolbar";
import CourseCard from "@/components/CourseCard";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useGetUserEnrolledCoursesQuery } from "@/state/api";
import { Curso } from "@/types/Cursotipos"; // Reutiliza a tipagem do curso

const CursosUsuario = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const {
    data: cursosInscritos,
    isLoading,
    isError,
  } = useGetUserEnrolledCoursesQuery(user?.id ?? "", {
    skip: !user || !isLoaded,
  });

  const cursosFiltrados = useMemo(() => {
    if (!cursosInscritos || !Array.isArray(cursosInscritos)) return [];

    return cursosInscritos.filter((curso: Curso) => {
      const matchSearch = curso.titulo
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "all" ||
        curso.categoria?.id?.toLowerCase() === selectedCategory.toLowerCase();

      const matchSubcategory =
        selectedCategory === "all" ||
        curso.subcategoria?.subcategoriaid?.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && (matchCategory || matchSubcategory);
    });
  }, [cursosInscritos, searchTerm, selectedCategory]);

  const handleGoToCourse = (curso: Curso) => {
    if (
      curso.secoes &&
      curso.secoes.length > 0 &&
      curso.secoes[0].capitulos.length > 0
    ) {
      const primeiroCapitulo = curso.secoes[0].capitulos[0];
      router.push(
        `/user/courses/${curso.cursoid}/chapters/${primeiroCapitulo.capituloid}`,
        { scroll: false }
      );
    } else {
      router.push(`/user/courses/${curso.cursoid}`, { scroll: false });
    }
  };

  if (!isLoaded || isLoading) return <Loading />;
  if (!user) return <div>Por favor, autentique-se para ver os seus cursos.</div>;
  if (isError || !cursosInscritos || cursosInscritos.length === 0)
    return <div>Você ainda não está inscrito em nenhum curso.</div>;

  return (
    <div className="user-courses">
      <Header title="Meus Cursos" subtitle="Veja os cursos em que está inscrito" />
      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      <div className="user-courses__grid">
        {cursosFiltrados.map((curso: Curso) => (
          <CourseCard
            key={curso.cursoid}
            course={curso}
            onGoToCourse={handleGoToCourse}
          />
        ))}
      </div>
    </div>
  );
};

export default CursosUsuario;
