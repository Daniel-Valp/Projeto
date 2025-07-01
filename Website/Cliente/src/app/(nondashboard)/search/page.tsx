"use client";

import { useGetCursosQuery } from '@/state/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Curso } from "@/types/Cursotipos";
import Loading from '@/components/Loading';
import { motion } from 'framer-motion';
import CourseCardSearch from '@/components/Coursecardsearch';
import SelectedCourse from './selectedcourse';
import { useUser } from "@clerk/nextjs";

const Search = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: cursos, isLoading, isError } = useGetCursosQuery({});
  const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!cursos || isLoading) return;

    if (id) {
      const curso = cursos.find((c) => c.cursoid === id);
      setSelectedCourse(curso || cursos[0]);
    } else {
      setSelectedCourse(cursos[0]);
    }
  }, [cursos, id, isLoading]);

  if (isLoading) return <Loading />;
  if (isError || !cursos) return <div>Erro a encontrar os cursos</div>;

  const handleCourseSelect = (curso: Curso) => {
    setSelectedCourse(curso);
    router.push(`/search?id=${curso.cursoid}`);
  };

  const handleEnrollNow = (cursoid: string) => {
    router.push(`/detalhes?step=1&id=${cursoid}&showSignUp=false`);
  };

const renderRedirectButton = () => {
  if (!isLoaded || !user) return null;

  const role = String(user.publicMetadata?.userType || "").toLowerCase();
  const isTeacher = role === "teacher" || role === "professor";
  const isStudent = role === "student" || role === "aluno";
  const isAdmin = role === "admin";

  const redirectUrl = isTeacher
    ? "http://localhost:3000/teacher/cursos"
    : isStudent
    ? "http://localhost:3000/user/courses"
    : isAdmin
    ? "http://localhost:3000/teacher/cursos" // ou outro destino, se quiser separar admin
    : null;

  if (!redirectUrl) return null;

  return (
    <div className="flex justify-end mb-2">
      <button
        onClick={() => window.location.href = redirectUrl}
        className="text-sm px-3 py-2 rounded-md bg-[#4FA6A8] hover:bg-[#3c8f91] transition-colors"
        style={{ color: 'white' }}
      >
        Ver todos os cursos
      </button>
    </div>
  );
};


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="search"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="search__title">Lista de cursos disponíveis</h1>
          <h2 className="search__subtitle">{cursos.length} Cursos disponíveis</h2>
        </div>
        {renderRedirectButton()}
      </div>

      <div className="search__content">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="search__courses-grid"
        >
          {cursos
            .filter((curso) => curso.estado === "Publicado")
            .map((curso) => (
              <CourseCardSearch
                key={curso.cursoid}
                curso={curso}
                isSelected={selectedCourse?.cursoid === curso.cursoid}
                onClick={() => handleCourseSelect(curso)}
              />
            ))}
        </motion.div>

        {selectedCourse && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="search__selected-course"
          >
            <SelectedCourse
              Curso={selectedCourse}
              handleEnrollNow={handleEnrollNow}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Search;
