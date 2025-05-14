"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Toolbar from "@/components/Toolbar";
import CourseCard from "@/components/CourseCard";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
// import { useGetUserEnrolledCoursesQuery } from "@/state/api"; // ❌ Comentado: progresso
// import { Curso } from "@/types/Cursotipos"; // ✅ Ainda usado abaixo, então mantido

const CursosUsuario = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // ❌ Comentado: uso do progresso do curso
  // const {
  //   data: cursosInscritos = [],
  //   isLoading,
  //   isError,
  // } = useGetUserEnrolledCoursesQuery(user?.id ?? "", {
  //   skip: !user || !isLoaded,
  // });

  // ⛔ Removido o uso de cursos filtrados, pois não há cursos disponíveis agora
  // const cursosFiltrados = useMemo(() => {
  //   return (cursosInscritos as Curso[]).filter((curso) => {
  //     const matchSearch = curso.titulo
  //       .toLowerCase()
  //       .includes(searchTerm.toLowerCase());

  //     const matchCategory =
  //       selectedCategory === "all" ||
  //       curso.categoria?.id.toLowerCase() === selectedCategory.toLowerCase();

  //     const matchSubcategory =
  //       selectedCategory === "all" ||
  //       curso.subcategoria?.subcategoriaid.toLowerCase() === selectedCategory.toLowerCase();

  //     return matchSearch && (matchCategory || matchSubcategory);
  //   });
  // }, [cursosInscritos, searchTerm, selectedCategory]);

  const handleGoToCourse = (curso: any) => {
    const primeiraSecao = curso.secoes?.[0];
    const primeiroCapitulo = primeiraSecao?.capitulos?.[0];

    if (primeiroCapitulo) {
      router.push(
        `/user/courses/${curso.cursoid}/chapters/${primeiroCapitulo.capituloid}`,
        { scroll: false }
      );
    } else {
      router.push(`/user/courses/${curso.cursoid}`, { scroll: false });
    }
  };

  if (!isLoaded) return <Loading />;
  if (!user) return <div>Por favor, autentique-se para ver os seus cursos.</div>;

  return (
    <div className="user-courses">
      <Header title="Meus Cursos" subtitle="Veja os cursos em que está inscrito" />
      <Toolbar 
  onSearch={setSearchTerm} 
  onCategoryChange={setSelectedCategory} 
  onSubcategoryChange={setSelectedCategory} 
/>

      <div className="user-courses__grid">
        {/* Nenhum curso listado porque os dados foram desabilitados */}
        <div className="text-center text-muted col-span-full">
          Funcionalidade temporariamente indisponível.
        </div>
      </div>
    </div>
  );
};

export default CursosUsuario;
