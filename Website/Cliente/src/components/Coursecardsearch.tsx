import Image from "next/image";
import React from "react";
import { ProcurarPeloCurso } from "@/types/Cursotipos"; // Importa a interface correta
import { formatPrice } from "@/lib/utils";

const CourseCardSearch: React.FC<ProcurarPeloCurso> = ({ curso, isSelected, onClick }) => {
    // Verifique se a imagem é externa ou local
    const imageUrl = curso.imagem
        ? curso.imagem.startsWith("http")  // Se a URL já começar com "http", é uma URL externa
            ? curso.imagem                  // Use diretamente a URL externa
            : `http://localhost:5000/uploads/${curso.imagem}`  // Se não, é uma imagem local
        : "/placeholder.png";  // Caso não tenha imagem, usa um placeholder

    return (
        <div
            onClick={onClick} // ✅ Corrigido (onclick → onClick)
            className={`course-card-search group ${
                isSelected ? "course-card-search--selected" : "course-card-search--unselected"
            }`}
        >
            <div className="course-card-search__image-container">
                <Image
                    src={imageUrl} // Usando a URL corrigida
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
                    <span className="course-card-search__hours">
                      {Number(curso.horas) % 1 === 0
                        ? Math.round(curso.horas) + (Math.round(curso.horas) === 1 ? " hora" : " horas")
                        : parseFloat(curso.horas.toString()).toFixed(2) + (curso.horas === 1 ? " hora" : " horas")}
                    </span>
                        <span className="course-card-search__enrollment">
                        {curso?.enlistados}  Enlistados {/* ✅ Corrigido "lenght" → "length" */}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCardSearch;
