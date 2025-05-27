"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { CustomFormField } from "@/components/CustomFormField";

type ManualFormData = {
  titulo: string;
  descricao: string;
  imagem_capa_url: string;
  arquivo_pdf_url?: string;
  categoria: string;
  subcategoria: string;
};

type Categoria = {
  id: number;
  nome: string;
};

type Subcategoria = {
  subcategoriaid: number;
  nome: string;
};

export default function ManualFormPage() {
  const router = useRouter();
  const params = useParams();
  const manualId = params?.id;

  const [useFileUpload, setUseFileUpload] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [status, setStatus] = useState<"rascunho" | "publicado">("rascunho");

  // Schema dinâmico baseado em useFileUpload
  const manualSchema = useMemo(() => {
  return z
    .object({
      titulo: z.string().min(3, "Título é obrigatório"),
      descricao: z.string().min(10, "Descrição é obrigatória"),
      imagem_capa_url: z.string().url("URL da capa inválida"),
      categoria: z.string().min(1, "Categoria é obrigatória"),
      subcategoria: z.string().min(1, "Subcategoria é obrigatória"),
      arquivo_pdf_url: z.string().optional(), // validação condicional abaixo
    })
    .superRefine((data, ctx) => {
      // Quando NÃO estiver usando upload, exigir URL válida
      if (!useFileUpload) {
        if (!data.arquivo_pdf_url || !/^https?:\/\/.+\.pdf$/i.test(data.arquivo_pdf_url)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Informe uma URL válida para o PDF",
            path: ["arquivo_pdf_url"],
          });
        }
      }
    });
}, [useFileUpload]);


  const methods = useForm<ManualFormData>({
    resolver: zodResolver(manualSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      imagem_capa_url: "",
      arquivo_pdf_url: "",
      categoria: "",
      subcategoria: "",
    },
  });

// Monitorar erros de validação
useEffect(() => {
  if (Object.keys(methods.formState.errors).length > 0) {
    console.log("⚠️ Erros de validação:", methods.formState.errors);
  }
}, [methods.formState.errors]);


  // Carregar categorias e subcategorias
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, subRes] = await Promise.all([
          fetch("http://localhost:5000/cursos/categorias"),
          fetch("http://localhost:5000/cursos/subcategorias"),
        ]);

        const catData = await catRes.json();
        const subData = await subRes.json();

        setCategorias(catData.data || []);
        setSubcategorias(subData.data || []);
      } catch (err) {
        toast.error("Erro ao carregar categorias ou subcategorias");
      }
    };

    fetchData();
  }, []);

  // Se estiver em modo de edição, carregar os dados do manual
  useEffect(() => {
    if (!manualId) return;

    const fetchManual = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/manuais/${manualId}`);
        if (!res.ok) throw new Error("Erro ao buscar manual");

        const manual = await res.json();
        setStatus("publicado"); // Ou usar manual.status se existir

        methods.reset({
          titulo: manual.titulo || "",
          descricao: manual.descricao || "",
          imagem_capa_url: manual.imagem_capa_url || "",
          arquivo_pdf_url: manual.arquivo_pdf_url || "",
          categoria: manual.categoria_id || "",
          subcategoria: String(manual.subcategoria_id) || "",
        });
      } catch (error) {
        toast.error("Erro ao carregar manual para edição");
      }
    };

    fetchManual();
  }, [manualId, methods]);

  const onSubmit: SubmitHandler<ManualFormData> = async (data) => {
  console.log("📤 [onSubmit] Dados recebidos do formulário:", data);

  try {
    let payload: any = {
      titulo: data.titulo,
      descricao: data.descricao,
      imagem_capa_url: data.imagem_capa_url,
      categoria_id: data.categoria,
      subcategoria_id: Number(data.subcategoria),
      status,
    };

    if (useFileUpload) {
      console.log("📎 Modo: Upload de Arquivo");

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;

      if (!fileInput?.files?.length) {
        console.warn("⚠️ Nenhum arquivo PDF selecionado.");
        toast.error("Selecione um arquivo PDF para upload");
        return;
      }

      const file = fileInput.files[0];
      console.log("📄 Arquivo selecionado:", file.name);

      const formData = new FormData();
      formData.append("arquivo_pdf", file);
      formData.append("titulo", data.titulo);
      formData.append("descricao", data.descricao);
      formData.append("imagem_capa_url", data.imagem_capa_url);
      formData.append("categoria_id", data.categoria);
      formData.append("subcategoria_id", String(data.subcategoria));
      formData.append("status", status);

      const url = manualId
        ? `http://localhost:5000/api/manuais/${manualId}`
        : "http://localhost:5000/api/manuais";

      console.log("📬 Enviando para:", url);

      const res = await fetch(url, {
        method: manualId ? "PUT" : "POST",
        body: formData,
      });

      console.log("✅ Resposta recebida:", res.status);

      if (!res.ok) throw new Error("Erro na resposta da API");

      toast.success(manualId ? "Manual atualizado!" : "Manual criado com sucesso");
      router.push("/teacher/manuais");
      return;
    } else {
      console.log("🌐 Modo: URL do PDF");

      payload.arquivo_pdf_url = data.arquivo_pdf_url;

      const url = manualId
        ? `http://localhost:5000/api/manuais/${manualId}`
        : "http://localhost:5000/api/manuais";

      console.log("📬 Enviando JSON para:", url);
      console.log("📦 Payload:", payload);

      const res = await fetch(url, {
        method: manualId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("✅ Resposta recebida:", res.status);

      if (!res.ok) throw new Error("Erro na resposta da API");

      toast.success(manualId ? "Manual atualizado!" : "Manual criado com sucesso");
      router.push("/teacher/manuais");
    }
  } catch (error) {
    console.error("❌ Erro ao enviar manual:", error);
    toast.error(manualId ? "Erro ao atualizar manual" : "Erro ao criar manual");
  }
};


  const handleToggleStatus = async () => {
    if (!manualId) return;

    const novoStatus = status === "rascunho" ? "publicado" : "rascunho";
    setStatus(novoStatus);

    try {
      const res = await fetch(`http://localhost:5000/api/manuais/${manualId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) throw new Error();

      toast.success(`Status alterado para ${novoStatus}`);
    } catch (error) {
      toast.error("Erro ao mudar status");
      setStatus(status); // Reverter
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Header
        title={manualId ? "Editar Manual" : "Criar Manual"}
        subtitle={manualId ? "Atualize os dados do manual" : "Adicione um novo manual"}
        rightElement={
          <div className="flex items-center gap-4">
            {manualId && (
              <div className="flex items-center gap-2">
                <span className="text-sm">{status === "publicado" ? "Publicado" : "Rascunho"}</span>
                <Switch checked={status === "publicado"} onCheckedChange={handleToggleStatus} />
              </div>
            )}
            <Button onClick={() => router.push("/teacher/manuais")}>Voltar</Button>
          </div>
        }
      />

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField name="titulo" label="Título" placeholder="Ex: Manual de Python" />
          <CustomFormField name="descricao" label="Descrição" placeholder="Breve descrição..." />
          <CustomFormField name="imagem_capa_url" label="Capa (URL)" placeholder="https://..." />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={useFileUpload}
              onChange={() => setUseFileUpload(!useFileUpload)}
            />
            <span>Enviar arquivo PDF do computador</span>
          </label>

          {useFileUpload ? (
            <input
              type="file"
              accept="application/pdf"
              className="block w-full border p-2"
              // não usamos react-hook-form para arquivo pois é mais simples pegar direto do input
            />
          ) : (
            <CustomFormField
              name="arquivo_pdf_url"
              label="PDF (URL)"
              placeholder="https://..."
            />
          )}

          <CustomFormField
            name="categoria"
            label="Categoria"
            type="select"
            options={categorias.map((cat) => ({
              value: String(cat.id),
              label: cat.nome,
            }))}
          />

          <CustomFormField
            name="subcategoria"
            label="Subcategoria"
            type="select"
            options={subcategorias.map((sub) => ({
              value: String(sub.subcategoriaid),
              label: sub.nome,
            }))}
          />

          <Button type="submit" className="w-full">
            {manualId ? "Salvar Alterações" : "Criar Manual"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
