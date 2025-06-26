"use client";

import { useEffect, useState } from "react";
import ManualCard from "@/components/manualcard";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface Category {
  id: string;
  nome: string;
}

interface Subcategory {
  subcategoriaid: number;
  nome: string;
}

interface Manual {
  id: number;
  titulo: string;
  descricao: string;
  imagem_capa_url: string;
  arquivo_pdf_url: string;
  categoria_id?: string;
  subcategoria_id?: number;
  categoria_nome?: string;
  subcategoria_nome?: string;
  professor_email?: string; // Importante para controle de acesso
}

export default function ManuaisPage() {
  const { user } = useUser();
  const emailLogado = user?.emailAddresses?.[0]?.emailAddress;

  const [manuais, setManuais] = useState<Manual[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");

  const router = useRouter();

  useEffect(() => {
    const fetchManuais = async () => {
      try {
        const [manuaisRes, categoriasRes, subcategoriasRes] = await Promise.all([
          fetch("http://localhost:5000/api/manuais"),
          fetch("http://localhost:5000/cursos/categorias"),
          fetch("http://localhost:5000/cursos/subcategorias"),
        ]);

        if (!manuaisRes.ok || !categoriasRes.ok || !subcategoriasRes.ok) {
          throw new Error("Erro ao buscar dados da API");
        }

        const manuaisData = await manuaisRes.json();
        const categoriasData = await categoriasRes.json();
        const subcategoriasData = await subcategoriasRes.json();

        const categorias: Category[] = categoriasData.data;
        const subcategorias: Subcategory[] = subcategoriasData.data;

        const manuaisComNomes = manuaisData.map((manual: Manual) => {
          const categoria = categorias.find((cat) => cat.id === manual.categoria_id);
          const subcategoria = subcategorias.find(
            (sub) => sub.subcategoriaid === manual.subcategoria_id
          );

          return {
            ...manual,
            categoria_nome: categoria?.nome,
            subcategoria_nome: subcategoria?.nome,
          };
        });

        setManuais(manuaisComNomes);
      } catch (error) {
        console.error("Erro ao buscar manuais:", error);
      }
    };

    fetchManuais();
  }, []);

  const filteredManuais = manuais.filter((manual) => {
    const matchesSearch = manual.titulo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || manual.categoria_id === selectedCategory;

    const selectedSubcategoryNumber =
      selectedSubcategory === "all" ? "all" : Number(selectedSubcategory);

    const manualSubcategoryNumber = manual.subcategoria_id ?? undefined;

    const matchesSubcategory =
      selectedSubcategoryNumber === "all" ||
      (manualSubcategoryNumber !== undefined &&
        manualSubcategoryNumber === selectedSubcategoryNumber);

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const handleEdit = (manual: Manual) => {
    router.push(`/teacher/manuais/${manual.id}`);
  };

  const handleDelete = async (manual: Manual) => {
    const confirmDelete = window.confirm(
      `Deseja mesmo apagar o manual "${manual.titulo}"?`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/manuais/${manual.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setManuais((prev) => prev.filter((m) => m.id !== manual.id));
      } else {
        console.error("Erro ao apagar manual.");
      }
    } catch (error) {
      console.error("Erro ao apagar manual:", error);
    }
  };

  const handleCreateManual = () => {
    router.push("/teacher/manuais/create");
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Manuais"
        subtitle="Veja todos os manuais disponíveis"
        rightElement={
          <Button onClick={handleCreateManual} className="teacher-courses__header">
            Criar manual
          </Button>
        }
      />

      <Toolbar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onSubcategoryChange={setSelectedSubcategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredManuais.length === 0 ? (
          <p>Nenhum manual disponível.</p>
        ) : (
          filteredManuais.map((manual) => {
            const isOwner = manual.professor_email === emailLogado;

            return (
              <ManualCard
                key={manual.id}
                manual={manual}
                onEdit={isOwner ? () => handleEdit(manual) : undefined}
                onDelete={isOwner ? () => handleDelete(manual) : undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
