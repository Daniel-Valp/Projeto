"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

interface Manual {
  id: number;
  titulo: string;
  descricao: string;
  arquivo_pdf_url: string;
  categoria_id: string;
  subcategoria_id: number;
  categoria_nome?: string;
  subcategoria_nome?: string;
}

export default function ManualDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [manual, setManual] = useState<Manual | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManual = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/manuais/${id}`);
        const data = await res.json();

        // Buscar categorias e subcategorias
        const [catRes, subcatRes] = await Promise.all([
          fetch("http://localhost:5000/cursos/categorias"),
          fetch("http://localhost:5000/cursos/subcategorias"),
        ]);

        const categoriasData = await catRes.json();
        const subcategoriasData = await subcatRes.json();

        const categoria = categoriasData.data.find(
          (c: any) => c.id === data.categoria_id
        );
        const subcategoria = subcategoriasData.data.find(
          (s: any) => s.subcategoriaid === data.subcategoria_id
        );

        setManual({
          ...data,
          categoria_nome: categoria?.nome,
          subcategoria_nome: subcategoria?.nome,
        });
      } catch (error) {
        console.error("Erro ao buscar manual:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManual();
  }, [id]);

  if (loading) return <p className="p-6 text-white">Carregando manual...</p>;
  if (!manual) return <p className="p-6 text-white">Manual não encontrado.</p>;

  const getPdfUrl = () => {
    if (!manual.arquivo_pdf_url) return "";
    if (manual.arquivo_pdf_url.startsWith("http")) return manual.arquivo_pdf_url;
    return `http://localhost:5000${manual.arquivo_pdf_url}`;
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen space-y-6">
      <Header
        title={manual.titulo}
        subtitle="Visualizador do Manual"
        rightElement={
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-gray-900"
            onClick={() => router.back()}
          >
            Voltar
          </Button>
        }
      />

      <div className="text-white space-y-4">
        <p>{manual.descricao}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="bg-blue-100 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300 px-3 py-1 text-xs rounded-full">
            Categoria: {manual.categoria_nome || "Sem categoria"}
          </span>
          <span className="bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-300 px-3 py-1 text-xs rounded-full">
            Subcategoria: {manual.subcategoria_nome || "Sem subcategoria"}
          </span>
        </div>
      </div>

      <div className="w-full h-[90vh] border border-gray-700 rounded-lg overflow-hidden">
        <iframe
          src={getPdfUrl()}
          className="w-full h-full"
          title={`Manual - ${manual.titulo}`}
          frameBorder="0"
        />
      </div>
    </div>
  );
}
