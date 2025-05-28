// src/types/manual.ts
export interface ManualAttributes {
  id: number;
  titulo: string;
  descricao: string;
  imagem_capa_url?: string;
  arquivo_pdf_url?: string;
  categoria_id: string;
  subcategoria_id: number;
  criado_em?: Date;
}
