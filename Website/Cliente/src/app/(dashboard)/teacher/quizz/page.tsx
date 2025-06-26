"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Toolbar from "@/components/Toolbar";
import QuizCard from "@/components/quizzcard";
import { useUser } from "@clerk/nextjs";

// Interfaces
interface Quiz {
  id: string;
  titulo: string;
  descricao: string;
  status?: "publicado" | "rascunho";
  perguntasCount?: number | string;
  categoria_id?: string;
  subcategoria_id?: number;
  categoria?: string;
  subcategoria?: string;
  professor_email?: string; // importante
}

interface Category {
  id: string;
  nome: string;
}

interface Subcategory {
  subcategoriaid: number;
  nome: string;
}

export default function QuizzesPage() {
  const { user } = useUser();
  const emailLogado = user?.emailAddresses?.[0]?.emailAddress;

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizzesRes, categoriasRes, subcategoriasRes] = await Promise.all([
          fetch("http://localhost:5000/api/quizzes"),
          fetch("http://localhost:5000/cursos/categorias"),
          fetch("http://localhost:5000/cursos/subcategorias"),
        ]);

        if (!quizzesRes.ok || !categoriasRes.ok || !subcategoriasRes.ok) {
          throw new Error("Erro ao buscar dados da API");
        }

        const quizzesData = await quizzesRes.json();
        const categoriasData = await categoriasRes.json();
        const subcategoriasData = await subcategoriasRes.json();

        const categorias: Category[] = categoriasData.data;
        const subcategorias: Subcategory[] = subcategoriasData.data;

        const quizzesComNomes = quizzesData.map((quiz: Quiz) => {
          const categoria = categorias.find((cat) => cat.id === quiz.categoria_id);
          const subcategoria = subcategorias.find(
            (sub) => sub.subcategoriaid === quiz.subcategoria_id
          );

          return {
            ...quiz,
            categoria: categoria?.nome,
            subcategoria: subcategoria?.nome,
          };
        });

        setCategorias(categorias);
        setSubcategorias(subcategorias);
        setQuizzes(quizzesComNomes);
      } catch (err) {
        console.error("Erro ao buscar quizzes:", err);
      }
    };

    fetchData();
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.titulo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || quiz.categoria_id === selectedCategory;

    const selectedSubcategoryNumber =
      selectedSubcategory === "all" ? "all" : Number(selectedSubcategory);

    const quizSubcategoryNumber = quiz.subcategoria_id ?? undefined;

    const matchesSubcategory =
      selectedSubcategoryNumber === "all" ||
      (quizSubcategoryNumber !== undefined &&
        quizSubcategoryNumber === selectedSubcategoryNumber);

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const handleEdit = (quiz: Quiz) => {
    router.push(`/teacher/quizz/create?id=${quiz.id}`);
  };

  const handleDelete = async (quiz: Quiz) => {
    const confirmDelete = window.confirm(`Deseja mesmo apagar o quiz "${quiz.titulo}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/quizzes/${quiz.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      } else {
        console.error("Erro ao apagar quiz.");
      }
    } catch (error) {
      console.error("Erro ao apagar quiz:", error);
    }
  };

  const handleCreateQuiz = () => {
    router.push("/teacher/quizz/create");
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Quizzes"
        subtitle="Veja todos os quizzes disponíveis"
        rightElement={
          <Button className="teacher-courses__header" onClick={handleCreateQuiz}>
            Criar quiz
          </Button>
        }
      />

      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredQuizzes.length === 0 ? (
          <p>Nenhum quiz disponível.</p>
        ) : (
          filteredQuizzes.map((quiz) => {
            const isOwner = quiz.professor_email === emailLogado;

            return (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onEdit={isOwner ? () => handleEdit(quiz) : undefined}
                onDelete={isOwner ? () => handleDelete(quiz) : undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
