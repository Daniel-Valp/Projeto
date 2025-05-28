import { z } from "zod";

export const manualFormSchema = z.object({
  titulo: z.string().min(1, "Título obrigatório"),
  descricao: z.string().min(1, "Descrição obrigatória"),
  categoria: z.string().uuid("Categoria inválida"),
  subcategoria: z.string().min(1, "Subcategoria obrigatória"),
  status: z.boolean(),
  imagem: z.any().optional(), // Pode ser null ou File
});

export type ManualFormData = z.infer<typeof manualFormSchema>;
