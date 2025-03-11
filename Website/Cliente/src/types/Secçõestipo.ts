export interface Capitulo {
  capituloid: string;
  secaoid: string;
  type: "Text" | "Quiz" | "Video";
  capitulotitulo: string;
  conteudo: string;
  video?: string | null;
  freepreview: boolean;
}

export interface Secao {
  secaoid: string;
  cursoid: string;
  secaotitulo: string;
  secaodescricao: string;
  capitulos: Capitulo[];
}

export interface AccordionSecoes {
  sections: Secao[];
}
