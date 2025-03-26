import { Secao } from "./Secçõestipo";

export interface Curso {
  cursoid: string;
  professorid: string;
  professornome: string;
  titulo: string;
  descricao: string;
  categoria: string;
  imagem?: string;
  nivel: "Iniciante" | "Intermediario" | "Avançado";
  estado: "Rascunho" | "Publicado";
  horas: number; // Duração do curso em horas
  subcategoria: Subcategoria; // Se precisar carregar os detalhes da subcategoria
  secoes: Secao[]; // Relacionamento com as seções
  enlistados: any[];
  criadoem: string; // Timestamp como string ISO
  atualizadoem: string;
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
