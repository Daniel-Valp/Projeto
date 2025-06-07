import React, { useMemo } from "react";
import Image from "next/image";
import { ProcurarPeloCurso } from "@/types/Cursotipos";
import { formatPrice } from "@/lib/utils";

const CourseCardSearch: React.FC<ProcurarPeloCurso> = ({ curso, isSelected, onClick }) => {
  // Lida com imagem local ou externa
  const imageUrl = useMemo(() => {
    if (!curso.imagem) return "/placeholder.png";
  
    if (curso.imagem.startsWith("data:image/")) {
      // Base64 direto
      return curso.imagem;
    }
  
    if (curso.imagem.startsWith("http")) {
      // URL externa
      return curso.imagem;
    }
  
    // Imagem local no servidor
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return `${base}/uploads/${curso.imagem}`;
  }, [curso.imagem]);
  

  const horasFormatadas =
    Number(curso.horas) % 1 === 0
      ? `${Math.round(curso.horas)} ${Math.round(curso.horas) === 1 ? "hora" : "horas"}`
      : `${parseFloat(curso.horas.toString()).toFixed(2)} horas`;

  return (
    <div
  onClick={onClick}
  className={`course-card-search group transition-all duration-200 hover:bg-[#32353E] hover:shadow-xl cursor-pointer ${
    isSelected ? "course-card-search--selected" : "course-card-search--unselected"
  }`}
>

      {/* 📌 Imagem do curso */}
      <div className="course-card-search__image-container">
        <Image
          src={imageUrl}
          alt={`Imagem do curso: ${curso.titulo}`}
          fill
          sizes="(max-width: 765px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="course-card-search__image object-cover rounded-md"
          priority
          // unoptimized // <- Descomenta se estiver usando imagens externas sem configurar o next.config.js
        />
      </div>

      {/* 📌 Conteúdo textual */}
      <div className="course-card-search__content">
        <div>
          <h2 className="course-card-search__title">{curso.titulo}</h2>
          <p className="course-card-search__description">{curso.descricao}</p>
        </div>

        <div className="mt-2">
          <p className="course-card-search__teacher">Por {curso.professornome}</p>

          <div className="course-card-search__footer">
            <span className="course-card-search__hours">{horasFormatadas}</span>
            <span className="course-card-search__enrollment">
              {curso.enlistados ?? 0} {curso.enlistados === 1 ? "inscrito" : "inscritos"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSearch;
