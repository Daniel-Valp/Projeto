import { Secao } from "./Secçõestipo";

export interface Curso {
  categoria_id: string;
  id: string;
  cursoid: string;
  professorid: string;
  professornome: string;
  titulo: string;
  descricao: string;
  categoria: Categoria;
  imagem?: string;
  nivel: "Iniciante" | "Intermediario" | "Avançado";
  estado: "Rascunho" | "Publicado";
  horas: number;
  subcategoria: Subcategoria;
  secoes: Secao[];
  enlistados: number; // 🔥 AGORA é número, não array
  criadoem: string;
  atualizadoem: string;
}


export interface Categoria { // 🔥 Novo tipo para refletir a tabela `categorias`
  id: string;
  nome: string;
}

export interface Subcategoria {
  subcategoriaid: string;
  nome: string;
}

export interface ProcurarPeloCurso {
  curso: Curso; 
  isSelected?: boolean;
  onClick?: () => void;
}

export interface CursoSelecionado {
  Curso: Curso;
  handleEnrollNow: (cursoid: string) => void;
}
