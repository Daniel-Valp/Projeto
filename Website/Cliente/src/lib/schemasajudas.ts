import { z } from "zod";

// 🔹 Schema para o formulário de capítulo
export const chapterSchema = z.object({
  capitulotitulo: z.string().min(1, "O título do capítulo é obrigatório"),
  conteudo: z.string().min(1, "O conteúdo do capítulo é obrigatório"),
  video: z.union([
    z.string().url("O vídeo deve ser um link válido"),
    z.literal(""),
    z.undefined()
  ]), // 👈 aceita link, vazio ou indefinido
  imagem: z.string().optional(),
});




// 🔹 Tipo inferido automaticamente do schema (para usar no formulário)
export type ChapterFormData = {
  capitulotitulo: string;
  conteudo: string;
  video?: string;
  imagem?: string; // 👈 adicionar esta linha
};




// 🔹 Schema para o formulário de curso (que já tinhas)
export const cursoFormSchema = z.object({
  cursotitulo: z
    .string()
    .min(1, "O título é obrigatório")
    .max(40, "O título deve ter no máximo 20 caracteres"),
  cursodescricao: z.string().min(1, "A descrição é obrigatória"),
  cursocategoria: z.string().min(1, "A categoria é obrigatória"),
  cursosubcategoria: z.string().min(1, "A subcategoria é obrigatória"),
  cursohoras: z.string().min(1, "As horas são obrigatórias"),
  cursoestado: z.boolean(),
  cursoimagem: z.any().optional(), // aceita File, string ou nada
});

export type CursoFormData = z.infer<typeof cursoFormSchema>;

export const sectionSchema = z.object({
  secaotitulo: z.string().min(1, "O título da secção é obrigatório"),
  secaodescricao: z.string().min(1, "A descrição da secção é obrigatória"),
});

export type SectionFormData = z.infer<typeof sectionSchema>;
