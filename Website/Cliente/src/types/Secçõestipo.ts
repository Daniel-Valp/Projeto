export interface Capitulo {
  capituloid: string;
  secaoid: string;
  type: "Text" | "Quiz" | "Video";
  capitulotitulo: string;
  conteudo: string;
  video?: string | File | null; // ✅ agora aceita vídeos novos (File) e existentes (string)
  freepreview: boolean;
}


export interface Secao {
  chapters: any;
  secaoid: string;
  cursoid: string;
  secaotitulo: string;
  secaodescricao: string;
  capitulos: Capitulo[];
}

export interface AccordionSecoes {
  sections: Secao[];
}

export interface CursoComSecoes {
  cursoid: string;
  professorid: string;
  professornome: string;
  titulo: string;
  descricao: string;
  categoria_id: string;
  imagem: string;
  nivel: string;
  estado: string;
  horas: string;
  subcategoriaid: number;
  enlistados: number;
  criadoem: string;
  atualizadoem: string;
  secoes: Secao[];
}