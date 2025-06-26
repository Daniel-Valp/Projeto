"use client";

import error from "next/error";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type Categoria = {
  id: string;
  nome: string;
};

type Subcategoria = {
  subcategoriaid: number; // integer
  nome: string;
};

export default function CategoriasAdminPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaSubcategoria, setNovaSubcategoria] = useState("");
  const [editandoCategoriaId, setEditandoCategoriaId] = useState<string | null>(null);
  const [editandoCategoriaNome, setEditandoCategoriaNome] = useState("");
  const [editandoSubcategoriaId, setEditandoSubcategoriaId] = useState<string | number | null>(null);
  const [editandoSubcategoriaNome, setEditandoSubcategoriaNome] = useState("");

  // Buscar categorias e subcategorias
  const fetchCategorias = async () => {
    try {
      const res = await fetch("http://localhost:5000/cursos/categorias");
      const json = await res.json();
      setCategorias(json.data || []);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const fetchSubcategorias = async () => {
    try {
      const res = await fetch("http://localhost:5000/cursos/subcategorias");
      const json = await res.json();
      setSubcategorias(json.data || []);
    } catch (error) {
      console.error("Erro ao carregar subcategorias:", error);
    }
  };

  // Criar
  const criarCategoria = async () => {
    if (!novaCategoria.trim()) return toast.error("Categoria vazia");
    try {
      const res = await fetch("http://localhost:5000/api/categorias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novaCategoria }),
      });
      if (res.ok) {
        toast.success("Categoria criada com sucesso!");
        setNovaCategoria("");
        fetchCategorias();
      } else {
        toast.error("Erro ao criar categoria");
      }
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
    }
  };

const criarSubcategoria = async () => {
  if (!novaSubcategoria.trim()) return toast.error("Subcategoria vazia");
  try {
    const res = await fetch("http://localhost:5000/api/subcategorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novaSubcategoria }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success("Subcategoria criada com sucesso!");
      setNovaSubcategoria("");
      fetchSubcategorias();
    } else {
      toast.error(json.message || "Erro ao criar subcategoria");
      console.error("Erro detalhado:", json);
    }
  } catch (error) {
    console.error("Erro ao criar subcategoria:", error);
  }
};



  // Atualizar
  const salvarEdicaoCategoria = async () => {
    if (!editandoCategoriaNome.trim() || !editandoCategoriaId) return toast.error("Nome inválido");
    try {
      const res = await fetch(`http://localhost:5000/api/categorias/${editandoCategoriaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editandoCategoriaNome }),
      });
      if (res.ok) {
        toast.success("Categoria atualizada com sucesso!");
        setEditandoCategoriaId(null);
        setEditandoCategoriaNome("");
        fetchCategorias();
      } else {
        toast.error("Erro ao atualizar categoria");
      }
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
    }
  };

  const salvarEdicaoSubcategoria = async () => {
    if (!editandoSubcategoriaNome.trim() || !editandoSubcategoriaId) return toast.error("Nome inválido");
    try {
      const res = await fetch(`http://localhost:5000/api/subcategorias/${editandoSubcategoriaId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editandoSubcategoriaNome }),
      });
      if (res.ok) {
        toast.success("Subcategoria atualizada com sucesso!");
        setEditandoSubcategoriaId(null);
        setEditandoSubcategoriaNome("");
        fetchSubcategorias();
      } else {
        toast.error("Erro ao atualizar subcategoria");
      }
    } catch (error) {
      console.error("Erro ao atualizar subcategoria:", error);
    }
  };

  // Apagar
  const apagarCategoria = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar esta categoria?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/categorias/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Categoria apagada com sucesso!");
        fetchCategorias();
      } else {
        toast.error("Erro ao apagar categoria");
      }
    } catch (error) {
      console.error("Erro ao apagar categoria:", error);
    }
  };

  const apagarSubcategoria = async (id: string | number) => {
    if (!confirm("Tem certeza que deseja apagar esta subcategoria?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/subcategorias/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Subcategoria apagada com sucesso!");
        fetchSubcategorias();
      } else {
        toast.error("Erro ao apagar subcategoria");
      }
    } catch (error) {
      console.error("Erro ao apagar subcategoria:", error);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchSubcategorias();
  }, []);

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">📂 Gestão de Categorias</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Categorias */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">➕ Adicionar Categoria</h2>
          <div className="flex gap-2 mb-4">
            <input
              value={novaCategoria}
              onChange={(e) => setNovaCategoria(e.target.value)}
              placeholder="Nova categoria"
              className="px-4 py-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
              disabled={!!editandoCategoriaId}
            />
            <button
  onClick={criarCategoria}
  style={{ backgroundColor: "#4FA6A8" }}
  className="text-white px-4 py-2 rounded-lg hover:brightness-90 transition"
>
  Adicionar
</button>

          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">📁 Categorias existentes:</h3>
            {categorias.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {categorias.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between">
                    {editandoCategoriaId === cat.id ? (
                      <>
                        <input
                          value={editandoCategoriaNome}
                          onChange={(e) => setEditandoCategoriaNome(e.target.value)}
                          className="px-2 py-1 border rounded w-full max-w-xs"
                        />
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={salvarEdicaoCategoria}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditandoCategoriaId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>{cat.nome}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditandoCategoriaId(cat.id);
                              setEditandoCategoriaNome(cat.nome);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => apagarCategoria(cat.id)}
                            className="text-red-600 hover:underline"
                          >
                            Apagar
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma categoria ainda.</p>
            )}
          </div>
        </div>

        {/* Subcategorias */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">➕ Adicionar Subcategoria</h2>
          <div className="flex gap-2 mb-4">
            <input
              value={novaSubcategoria}
              onChange={(e) => setNovaSubcategoria(e.target.value)}
              placeholder="Nova subcategoria"
              className="px-4 py-2 border rounded-lg w-full dark:bg-gray-700 dark:border-gray-600"
              disabled={!!editandoSubcategoriaId}
            />
            <button
              onClick={criarSubcategoria}
                 className="text-white px-4 py-2 rounded-lg hover:brightness-90 transition"
                style={{ backgroundColor: "#4FA6A8" }}
              disabled={!!editandoSubcategoriaId}
            >
              Adicionar
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">🗂️ Subcategorias existentes:</h3>
            {subcategorias.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {subcategorias.map((sub) => (
                  <li key={sub.subcategoriaid} className="flex items-center justify-between">
                    {editandoSubcategoriaId === sub.subcategoriaid ? (
                      <>
                        <input
                          value={editandoSubcategoriaNome}
                          onChange={(e) => setEditandoSubcategoriaNome(e.target.value)}
                          className="px-2 py-1 border rounded w-full max-w-xs"
                        />
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={salvarEdicaoSubcategoria}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={() => setEditandoSubcategoriaId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          >
                            Cancelar
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>{sub.nome}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditandoSubcategoriaId(sub.subcategoriaid);
                              setEditandoSubcategoriaNome(sub.nome);
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => apagarSubcategoria(sub.subcategoriaid)}
                            className="text-red-600 hover:underline"
                          >
                            Apagar
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma subcategoria ainda.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
