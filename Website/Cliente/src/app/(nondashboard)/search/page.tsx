"use client";

import { useGetCursosQuery } from '@/state/api';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Curso } from "@/types/Cursotipos";
import Loading from '@/components/Loading';
import { motion } from 'framer-motion';
import CourseCardSearch from '@/components/Coursecardsearch'; // Nome corrigido
import SelectedCourse from './selectedcourse';

const Search = () => {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const { data: cursos, isLoading, isError } = useGetCursosQuery({});
    const [selectedCourse, setSelectedCourse] = useState<Curso | null>(null);
    const router = useRouter();

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
      

    return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="search"
        >
            <h1 className="search__title">Lista de cursos disponíveis</h1>
            <h2 className="search__subtitle">{cursos.length} Cursos disponíveis</h2>
            <div className="search__content">
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="search__courses-grid"
                >
                    {cursos.map((curso) => (
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
