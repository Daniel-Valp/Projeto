import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriasQuery } from "@/state/api"; // 🔥 Hook para buscar categorias da API

const Toolbar = ({ onSearch, onCategoryChange }: ToolbarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: categorias = [], isLoading, isError, error } = useGetCategoriasQuery(); // 🔥 Obtém categorias
  const [categoriasLista, setCategoriasLista] = useState<{ id: string; nome: string }[]>([]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  // ✅ DEBUG: Exibe as categorias carregadas
  console.log("✅ Dados da API no Toolbar:", categorias);

  // ✅ Atualiza categorias quando os dados forem carregados
  useEffect(() => {
    if (categorias.length > 0) {
      setCategoriasLista(categorias);
    }
  }, [categorias]);

  // ✅ DEBUG: Exibe erro se houver problema na API
  useEffect(() => {
    if (error) console.error("❌ Erro ao buscar categorias:", error);
  }, [error]);

  return (
    <div className="toolbar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Procurar cursos"
        className="toolbar__search"
      />
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="toolbar__select">
          <SelectValue placeholder="Categorias" />
        </SelectTrigger>
        <SelectContent className="white hover:white">
          <SelectItem value="all" className="toolbar__select-item">
            Todas as categorias
          </SelectItem>
          {isLoading ? (
            <SelectItem value="loading" disabled>Carregando...</SelectItem> 
          ) : isError ? (
            <SelectItem value="error" disabled>Erro ao carregar categorias</SelectItem> 
          ) : (
            categoriasLista.map((categoria) => (
              <SelectItem
                key={categoria.id}
                value={categoria.id || "unknown"} 
                className="toolbar__select-item"
              >
                {categoria.nome}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Toolbar;
