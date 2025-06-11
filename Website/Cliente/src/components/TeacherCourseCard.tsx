import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Pencil, Trash2, CheckCircle, Clock, BookOpen } from "lucide-react";
import { Curso } from "@/types/Cursotipos";
import { useGetCategoriasQuery, useGetSubcategoriasQuery } from "@/state/api";

interface TeacherCourseCardProps {
  curso: Curso;
  onEdit: (curso: Curso) => void;
  onDelete: (curso: Curso) => void;
  isOwner: boolean;
}

const TeacherCourseCard = ({ curso, onEdit, onDelete, isOwner }: TeacherCourseCardProps) => {
  // Buscando categorias
  const { data: categorias = [], isLoading } = useGetCategoriasQuery();
  const { data: subcategorias = [], isLoading: isLoadingSub } = useGetSubcategoriasQuery();

  // Encontrando a categoria correspondente
  const categoriaNome = useMemo(() => {
    if (isLoading) return "Carregando...";
    const categoria = categorias.find((cat) => cat.id === curso.categoria_id);
    return categoria ? categoria.nome : "Categoria não disponível";
  }, [categorias, curso.categoria_id, isLoading]);
    
  const subcategoriaNome = useMemo(() => {
    //console.log("📦 subcategorias da API: ", subcategorias);
    //console.log("📌 curso.subcategoriaid: ", curso.subcategoriaid);
  
    if (!curso.subcategoriaid) {
      console.warn("⚠️ subcategoriaid não está definido no curso.");
      return "Subcategoria não disponível";
    }
  
    const subcategoriaEncontrada = subcategorias.find(
      (sub) => Number(sub.subcategoriaid) === Number(curso.subcategoriaid)
    );
  
    return subcategoriaEncontrada?.nome || "Subcategoria não disponível";
  }, [subcategorias, curso.subcategoriaid]);
  
  
  

  return (
    <Card className="course-card-teacher group">
      {/* 📌 Cabeçalho do Card com Imagem */}
      <CardHeader className="course-card-teacher__header">
        <Image
          src={curso.imagem || "/placeholder.png"}
          alt={`Imagem do curso: ${curso.titulo}`}
          width={370}
          height={150}
          className="course-card-teacher__image"
          priority
        />
      </CardHeader>

      <CardContent className="course-card-teacher__content">
        <div className="flex flex-col">
          {/* 📌 Título do Curso */}
          <CardTitle className="course-card-teacher__title">
            {curso.titulo}
          </CardTitle>

          {/* 📌 Exibição da Categoria */}
          <CardDescription className="course-card-teacher__category">
             {categoriaNome} - {subcategoriaNome}
          </CardDescription>



          {/* 📌 Status do Curso com Ícone */}
          <p className="flex items-center text-sm mb-2">
              <span className="mr-2" style={{ color: "#F3F7F5" }}>Status:</span>
            <span
              className={cn(
                "font-semibold px-2 py-1 rounded flex items-center gap-1",
                curso.estado === "Publicado"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              )}
            >
              {curso.estado === "Publicado" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              {curso.estado}
            </span>
          </p>

          {/* 📌 Exibição da quantidade de seções */}
          {typeof curso.enlistados === "number" ? (
  <p style={{ color: "#F3F7F5" }}>
  <span className="font-bold">{curso.enlistados}</span>
  {curso.enlistados === 1 ? " Aluno inscrito" : " Alunos inscritos"}
</p>

) : (
  <p className="text-sm text-gray-500 italic">Nenhum aluno inscrito</p>
)}



        </div>

        {/* 📌 Botão de Visualizar Curso */}
<button
  onClick={(e) => {
    e.stopPropagation();
    // Navegação para o curso (ajuste a rota se necessário)
    // Exemplo: `/teacher/cursos/${curso.id}`
    // Substitua com seu router.push se usar Next.js routing
    window.location.href = `/teacher/cursos/${curso.id}`;
  }}
  className="text-sm hover:underline"
  style={{ color: "#4FA6A8" }}
>
  Ver curso →
</button>

{/* 📌 Botões de Ações (Editar/Deletar) */}
{isOwner ? (
  <div className="flex gap-4 mt-2">
    <button
      onClick={(e) => {
        e.stopPropagation();
        onEdit(curso);
      }}
      className="text-sm hover:underline"
      style={{ color: "#c9871f" }}
    >
      Editar
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete(curso);
      }}
      className="text-sm hover:underline"
      style={{ color: "#C93A1F" }}
    >
      Apagar
    </button>
  </div>
) : (
  <p className="text-sm italic mt-2" style={{ color: "#F3F7F5" }}>
    Apenas visualização
  </p>
)}


      </CardContent>
    </Card>
  );
};

export default TeacherCourseCard;
