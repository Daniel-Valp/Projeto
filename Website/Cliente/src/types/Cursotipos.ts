import { Secao } from "./Secçõestipo";

export interface Curso {
  categoria_id: string;
  subcategoriaid: number;
  id: string;
  cursoid: string;
  professorid: string;
  professornome: string;
  titulo: string;
  descricao: string;
  categoria: Categoria;
  subcategoria: Subcategoria; // 👈 Manténs isto para outras partes que usem o objeto completo
  imagem?: string;
  nivel: "Iniciante" | "Intermediario" | "Avançado";
  estado: "Rascunho" | "Publicado";
  horas: number;
  secoes: Secao[];
  enlistados: number;
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

import { z } from "zod";

export const cursoFormSchema = z.object({
  cursotitulo: z.string().min(1, "O título é obrigatório"),
  cursodescricao: z.string().min(1, "A descrição é obrigatória"),
  cursocategoria: z.string().min(1, "A categoria é obrigatória"),
  cursosubcategoria: z.string().min(1, "A subcategoria é obrigatória"),
  cursohoras: z.string().min(1, "As horas são obrigatórias"),
  cursoestado: z.boolean(),
});

// 👇 aqui sim o tipo!
export type CursoFormData = z.infer<typeof cursoFormSchema>;
