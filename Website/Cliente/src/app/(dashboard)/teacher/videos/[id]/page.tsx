"use client";

import { useRouter, useParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect, useState } from "react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CustomFormField } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";

import {
  useGetCategoriasQuery,
  useGetSubcategoriasQuery,
} from "@/state/api";

// Zod schema para validação
const videoFormSchema = z.object({
  title: z.string().min(3, "Título é obrigatório"),
  url: z.string().url("URL inválida"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  subcategoria: z.string().min(1, "Subcategoria é obrigatória"),
});

type VideoFormData = z.infer<typeof videoFormSchema>;

export default function VideoFormPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params?.id;

  const [status, setStatus] = useState<"rascunho" | "publicado">("rascunho");

  const { data: categorias = [], isLoading: loadingCategorias } = useGetCategoriasQuery();
  const { data: subcategorias = [], isLoading: loadingSubcategorias } = useGetSubcategoriasQuery();

  const methods = useForm<VideoFormData>({
    resolver: zodResolver(videoFormSchema),
    defaultValues: {
      title: "",
      url: "",
      categoria: "",
      subcategoria: "",
    },
  });

  useEffect(() => {
    async function fetchVideo() {
      if (!videoId) return;

      try {
        const res = await fetch(`http://localhost:5000/api/videos/${videoId}`);
        if (!res.ok) throw new Error("Erro ao buscar vídeo");

        const video = await res.json();
        setStatus(video.status === "publicado" ? "publicado" : "rascunho");

        methods.reset({
          title: video.title || "",
          url: video.url || "",
          categoria: video.category_id || "",
          subcategoria: String(video.subcategory_id) || "",
        });
      } catch (error) {
        toast.error("Não foi possível carregar os dados do vídeo para edição.");
      }
    }
    fetchVideo();
  }, [videoId, methods]);

  const onSubmit: SubmitHandler<VideoFormData> = async (data) => {
    try {
      const payload = {
        title: data.title,
        url: data.url,
        category_id: data.categoria,
        subcategory_id: Number(data.subcategoria),
        status,
      };

      const res = await fetch(
        videoId
          ? `http://localhost:5000/api/videos/${videoId}`
          : "http://localhost:5000/api/videos",
        {
          method: videoId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error(videoId ? "Erro ao atualizar vídeo" : "Erro ao criar vídeo");

      toast.success(videoId ? "Vídeo atualizado com sucesso!" : "Vídeo criado com sucesso!");
      router.push("/teacher/videos");
    } catch (error) {
      toast.error(videoId ? "Falha ao atualizar vídeo" : "Falha ao criar vídeo");
      console.error(error);
    }
  };

  const handleToggleStatus = async () => {
    const novoStatus = status === "rascunho" ? "publicado" : "rascunho";
    setStatus(novoStatus);

    try {
      const res = await fetch(`http://localhost:5000/api/videos/${videoId}`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: novoStatus }),
});


      if (!res.ok) throw new Error("Erro ao atualizar status do vídeo");

      toast.success(`Status alterado para ${novoStatus}`);
    } catch (error) {
      toast.error("Falha ao atualizar status");
      console.error(error);
      // Reverter o toggle se der erro
      setStatus(status);
    }
  };

  if (loadingCategorias || loadingSubcategorias) {
    return <p>A carregar categorias...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <Header
        title={videoId ? "Editar Vídeo" : "Criar Vídeo"}
        subtitle={videoId ? "Edite os dados do vídeo" : "Adicione um novo vídeo"}
        rightElement={
          <div className="flex items-center gap-4">
            {videoId && (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {status === "publicado" ? "Publicado" : "Rascunho"}
                </span>
                <Switch checked={status === "publicado"} onCheckedChange={handleToggleStatus} />
              </div>
            )}
            <Button onClick={() => router.push("/teacher/videos")}>Voltar</Button>
          </div>
        }
      />

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField
            name="title"
            label="Título"
            type="text"
            placeholder="Título do vídeo"
          />

          <CustomFormField
            name="url"
            label="URL do Vídeo"
            type="text"
            placeholder="https://youtube.com/..."
          />

          <CustomFormField
            name="categoria"
            label="Categoria"
            type="select"
            placeholder="Selecione uma categoria"
            options={categorias.map((cat) => ({
              value: String(cat.id),
              label: cat.nome,
            }))}
          />

          <CustomFormField
            name="subcategoria"
            label="Subcategoria"
            type="select"
            placeholder="Selecione uma subcategoria"
            options={subcategorias.map((sub) => ({
              value: String(sub.subcategoriaid),
              label: sub.nome,
            }))}
          />

          <Button type="submit" className="w-full">
            {videoId ? "Salvar Alterações" : "Criar Vídeo"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
