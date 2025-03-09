export interface Secção {
    seccaoId: string;
    seccaoTitle: string;
    seccaoDescricao?: string;
    capitulos: capitulo[];
  }

export interface AccordionSecoes {
  sections: Secção[];
}

export interface capitulo {
    capituloId: string;
    capitulotitulo: string;
    conteudo: string;
    video?: string | File;
    freePreview?: boolean;
    type: "Text" | "Quiz" | "Video";
  }

