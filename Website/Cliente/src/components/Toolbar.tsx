import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetCategoriasQuery, useGetSubcategoriasQuery } from "@/state/api"; // 🔥 Hook para buscar categorias e subcategorias da API

interface ToolbarProps {
  onSearch: (searchTerm: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string) => void; // Adicionando onSubcategoryChange à interface
}

const Toolbar = ({ onSearch, onCategoryChange, onSubcategoryChange }: ToolbarProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Buscando categorias e subcategorias
  const { data: categorias = [], isLoading: isLoadingCategorias, isError, error } = useGetCategoriasQuery(); 
  const { data: subcategorias = [], isLoading: isLoadingSubcategorias } = useGetSubcategoriasQuery(); 

  // Estado local para armazenar categorias e subcategorias
  const [categoriasLista, setCategoriasLista] = useState<{ id: string; nome: string }[]>([]);
  const [subcategoriasLista, setSubcategoriasLista] = useState<{ id: string; nome: string }[]>([]);

  // Função de busca
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  // Atualiza categorias quando os dados forem carregados
  useEffect(() => {
    if (categorias.length > 0) {
      setCategoriasLista(categorias);
    }
  }, [categorias]);

  // Atualiza subcategorias quando os dados forem carregados
  useEffect(() => {
    console.log("🔍 Subcategorias recebidas da API:", subcategorias);
  
    if (subcategorias.length > 0) {
      const subcategoriasFormatadas = subcategorias.map((subcategoria) => ({
        id: subcategoria.subcategoriaid.toString(), // ✅ Usa o subcategoriaid corretamente
        nome: subcategoria.nome,
      }));
      
  
      // Verificar se há chaves duplicadas
      const ids = subcategoriasFormatadas.map((s) => s.id);
      const idsDuplicados = ids.filter((id, i) => ids.indexOf(id) !== i);
      if (idsDuplicados.length > 0) {
        console.error("🚨 Subcategorias com chaves duplicadas:", idsDuplicados);
      }
  
      setSubcategoriasLista(subcategoriasFormatadas);
    }
  }, [subcategorias]);
  
  // Exibe erro se houver problema na API
  useEffect(() => {
    if (error) {
      console.error("❌ Erro ao buscar categorias:", error);
    }
  }, [error]);

  return (
    <div className="toolbar">
      {/* Filtro de Pesquisa */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Procurar cursos"
        className="toolbar__search"
      />

      {/* Filtro de Categorias */}
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="toolbar__select">
          <SelectValue placeholder="Categorias" />
        </SelectTrigger>
        <SelectContent className="white hover:white">
          <SelectItem value="all" className="toolbar__select-item">
            Todas as categorias
          </SelectItem>
          {isLoadingCategorias ? (
            <SelectItem value="loading" disabled>
              Carregando categorias...
            </SelectItem>
          ) : isError ? (
            <SelectItem value="error" disabled>
              Erro ao carregar categorias
            </SelectItem>
          ) : (
            categoriasLista
  .filter((categoria) => categoria.id) // Remove categorias sem ID
  .map((categoria) => (
    <SelectItem
      key={categoria.id}
      value={categoria.id}
      className="toolbar__select-item"
    >
      {categoria.nome}
    </SelectItem>
))

          )}
        </SelectContent>
      </Select>

      {/* Filtro de Subcategorias */}
      <Select onValueChange={onSubcategoryChange}>
        <SelectTrigger className="toolbar__select">
          <SelectValue placeholder="Subcategorias" />
        </SelectTrigger>
        <SelectContent className="white hover:white">
          <SelectItem value="all" className="toolbar__select-item">
            Todas as subcategorias
          </SelectItem>
          {isLoadingSubcategorias ? (
            <SelectItem value="loading" disabled>
              Carregando subcategorias...
            </SelectItem>
          ) : (
            subcategoriasLista.map((subcategoria, index) => (
              <SelectItem
                key={subcategoria.id ?? `subcategoria-${index}`}
                value={subcategoria.id ?? `subcategoria-${index}`}
                className="toolbar__select-item"
              >
                {subcategoria.nome}
              </SelectItem>
            ))
            

          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Toolbar;
