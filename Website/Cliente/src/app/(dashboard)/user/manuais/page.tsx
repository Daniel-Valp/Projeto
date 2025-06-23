"use client";

import { useEffect, useState } from "react";
import ManualCard from "@/components/manualcard";
import Toolbar from "@/components/Toolbar";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // 👈 Import do Clerk

// Interfaces
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
  status?: "publicado" | "rascunho"; // 👈 Adiciona status
  categoria_id?: string;
  subcategoria_id?: number;
  categoria_nome?: string;
  subcategoria_nome?: string;
}

export default function ManuaisPage() {
  const [manuais, setManuais] = useState<Manual[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  const { user } = useUser(); // 👈 Acesso ao usuário
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

        setCategorias(categorias);
        setSubcategorias(subcategorias);
        setManuais(manuaisComNomes);
      } catch (error) {
        console.error("Erro ao buscar manuais:", error);
      }
    };

    fetchManuais();
  }, []);

  const filteredManuais = manuais.filter((manual) => {
    const role = user?.publicMetadata?.role;
    const isAluno = role !== "admin" && role !== "professor";

    const matchesSearch = manual.titulo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || manual.categoria_id === selectedCategory;

    const selectedSubcategoryNumber =
      selectedSubcategory === "all" ? "all" : Number(selectedSubcategory);

    const manualSubcategoryNumber = manual.subcategoria_id ?? undefined;

    const matchesSubcategory =
      selectedSubcategoryNumber === "all" ||
      (manualSubcategoryNumber !== undefined &&
        manualSubcategoryNumber === selectedSubcategoryNumber);

    const isPublicado = !isAluno || manual.status === "publicado"; // 👈 Filtro de publicação

    return matchesSearch && matchesCategory && matchesSubcategory && isPublicado;
  });

  return (
    <div className="p-6 space-y-6">
      <Header
        title="Manuais"
        subtitle="Veja todos os manuais disponíveis"
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
          filteredManuais.map((manual) => (
            <ManualCard key={manual.id} manual={manual} />
          ))
        )}
      </div>
    </div>
  );
}
