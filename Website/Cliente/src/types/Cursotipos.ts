export interface Curso {
  cursoid: string;
  professorid: string;
  professornome: string;
  titulo: string;
  descricao: string;
  categoria: string;
  imagem?: string;
  nivel: "Iniciante" | "Intermedio" | "Avançado";
  estado: "Rascunho" | "Publicado";
  secao: any[]; // Se souberes a estrutura, substitui `any` pelo tipo correto
  enlistados: any[];
  analise: Record<string, any>; // JSONB no banco pode ser um objeto genérico
  criadoem: string; // Timestamp como string ISO
  atualizadoem: string;
}

export interface ProcurarPeloCurso {
  curso: Curso; // Mantém coerência com `curso`, não `course`
  isSelected?: boolean;
  onClick?: () => void;
}
