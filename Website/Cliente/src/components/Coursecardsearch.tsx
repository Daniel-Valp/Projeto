import Image from "next/image";
import React from "react";
import { ProcurarPeloCurso } from "@/types/Cursotipos"; // Importa a interface correta

const CourseCardSearch: React.FC<ProcurarPeloCurso> = ({ curso, isSelected, onClick }) => {
    return (
        <div
            onClick={onClick} // ✅ Corrigido (onclick → onClick)
            className={`course-card-search group ${
                isSelected ? "course-card-search--selected" : "course-card-search--unselected"
            }`}
        >
            <div className="course-card-search__image-container">
                <Image
                    src={curso.imagem || "/placeholder.png"} // ✅ Corrigido
                    alt={curso.titulo} // ✅ Corrigido
                    fill
                    sizes="(max-width: 765px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="course-card-search__image"
                />
            </div>
            <div className="course-card-search__content">
                <div>
                    <h2 className="course-card-search__title">{curso.titulo}</h2>
                    <p className="course-card-search__description">{curso.descricao}</p>
                </div>
                <div className="mt-2">
                    <p className="course-card-search__teacher">Por {curso.professornome}</p>
                    <div className="course-card-search__footer">
                        <span className="course-card-search__enrollment">
                            {curso.enlistados?.length} Enlistados {/* ✅ Corrigido "lenght" → "length" */}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCardSearch;
