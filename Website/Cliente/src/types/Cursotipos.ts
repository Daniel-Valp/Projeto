export interface Curso {
    cursoId: string;
    professorId: string;
    professorNome: string;
    titulo: string;
    descricao: string;
    categoria: string;
    imagem?: string;
    nivel: string;
    estado: string;
    secao: any[]; // Se souberes a estrutura, podes substituir `any` pelo tipo correto
    enlistados: any[];
    analise: Record<string, any>; // JSONB no banco pode ser um objeto genérico
    criadoEm: string; // Timestamp como string ISO
    atualizadoEm: string;
  }
  