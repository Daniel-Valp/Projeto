    "use client";

    import { useEffect, useMemo, useState } from "react";
    import { useForm, SubmitHandler } from "react-hook-form";
    import { z } from "zod";
    import { zodResolver } from "@hookform/resolvers/zod";
    import { useRouter, useSearchParams } from "next/navigation";
    import { toast } from "sonner";

    import Header from "@/components/Header";
    import { Button } from "@/components/ui/button";
    import { Form } from "@/components/ui/form";
    import { Switch } from "@/components/ui/switch";
    import { CustomFormField } from "@/components/CustomFormField";
import { useUser } from "@clerk/nextjs";

    type ManualFormData = {
  titulo: string;
  descricao: string;
  imagem_capa_url?: string;
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
    const searchParams = useSearchParams();
    const manualId = searchParams.get("id");

    const [useFileUpload, setUseFileUpload] = useState(false);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
    const [status, setStatus] = useState<"rascunho" | "publicado">("rascunho");

    const [imagemCapaFile, setImagemCapaFile] = useState<File | null>(null);

const { user } = useUser();
const professorEmail = user?.emailAddresses[0]?.emailAddress || "";

    const manualSchema = useMemo(() => {
    return z
        .object({
        titulo: z.string().min(3, "Título é obrigatório"),
        descricao: z.string().min(10, "Descrição é obrigatória"),
        imagem_capa_url: z.string().optional(),
        categoria: z.string().min(1, "Categoria é obrigatória"),
        subcategoria: z.string().min(1, "Subcategoria é obrigatória"),
        arquivo_pdf_url: z.string().optional(),
        })
        .superRefine((data, ctx) => {
    // PDF via URL
    if (!useFileUpload) {
        if (!data.arquivo_pdf_url || !/^https?:\/\/.+\.pdf$/i.test(data.arquivo_pdf_url)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Informe uma URL válida para o PDF",
            path: ["arquivo_pdf_url"],
        });
        }
    }

    // Capa obrigatória (via upload ou URL)
    const hasUploadedImage = imagemCapaFile !== null;
    const hasValidUrl = data.imagem_capa_url && /^https?:\/\/.+\.(jpg|jpeg|png|webp)$/i.test(data.imagem_capa_url);

    if (!hasUploadedImage && !hasValidUrl) {
        ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe uma imagem de capa válida (upload ou URL)",
        path: ["imagem_capa_url"],
        });
    }
    });
    }, [useFileUpload, imagemCapaFile]);



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
        } catch {
            toast.error("Erro ao carregar categorias ou subcategorias");
        }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (!manualId) return;

        const fetchManual = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/manuais/${manualId}`);
            const manual = await res.json();

            setStatus(manual.status || "publicado");

            methods.reset({
            titulo: manual.titulo || "",
            descricao: manual.descricao || "",
            imagem_capa_url: manual.imagem_capa_url || "",
            arquivo_pdf_url: manual.arquivo_pdf_url || "",
            categoria: manual.categoria_id || "",
            subcategoria: String(manual.subcategoria_id) || "",
            });
        } catch {
            toast.error("Erro ao carregar manual para edição");
        }
        };

        fetchManual();
    }, [manualId, methods]);

    const onSubmit = async (data: ManualFormData) => {
    console.log("🔘 Botão submit clicado");
    console.log("🧾 Estado atual do formulário: ", data);

    const isValid = await methods.trigger();
    console.log("📌 Está válido após trigger?", isValid);
    console.log("⚠️ Tem erros?", methods.formState.errors);

    if (!isValid) {
        toast.error("Formulário inválido. Corrija os erros.");
        return;
    }
    console.log("🚀 onSubmit chamado com dados:", data);

    try {
        let url = manualId
        ? `http://localhost:5000/api/manuais/${manualId}`
        : "http://localhost:5000/api/manuais";

        if (useFileUpload) {
        console.log("📂 Enviando arquivo via upload");

        const fileInput = document.querySelector('input[type="file"][name="arquivo_pdf"]') as HTMLInputElement;

        console.log("📁 fileInput encontrado:", fileInput);

        if (!fileInput?.files?.length) {
            toast.error("Selecione um arquivo PDF para upload");
            console.log("⚠️ Nenhum arquivo PDF selecionado");
            return;
        }

        const formData = new FormData();
        formData.append("arquivo_pdf", fileInput.files[0]);
        formData.append("titulo", data.titulo);
        formData.append("descricao", data.descricao);
        formData.append("categoria_id", data.categoria);
        formData.append("subcategoria_id", data.subcategoria);
        formData.append("status", status);
        formData.append("professor_email", professorEmail); // 👈 injectado aqui


        if (imagemCapaFile) {
            formData.append("imagem_capa_url", imagemCapaFile);
            console.log("🖼️ Imagem de capa adicionada ao FormData");
            {imagemCapaFile && (
    <p className="text-sm text-muted-foreground">📷 {imagemCapaFile.name}</p>
    )}

        }

        const res = await fetch(url, {
            method: manualId ? "PUT" : "POST",
            body: formData,
        });

        console.log("📤 Resposta do servidor (upload):", res);

        if (!res.ok) throw new Error("Erro ao enviar dados");

        toast.success(manualId ? "Manual atualizado!" : "Manual criado com sucesso");
        router.push("/teacher/manuais");
        } else {
        console.log("🌐 Enviando dados via JSON", {
            titulo: data.titulo,
            descricao: data.descricao,
            imagem_capa_url: data.imagem_capa_url,
            arquivo_pdf_url: data.arquivo_pdf_url,
            categoria_id: data.categoria,
            subcategoria_id: data.subcategoria,
            status,
        });

        const payload = {
            titulo: data.titulo,
            descricao: data.descricao,
            imagem_capa_url: data.imagem_capa_url,
            arquivo_pdf_url: data.arquivo_pdf_url,
            categoria_id: data.categoria,
            subcategoria_id: data.subcategoria,
            status,
            professor_email: professorEmail, // 👈 injectado aqui
        };

        const res = await fetch(url, {
            method: manualId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        console.log("📤 Resposta do servidor (JSON):", res);

        if (!res.ok) throw new Error();

        toast.success(manualId ? "Manual atualizado!" : "Manual criado com sucesso");
        router.push("/teacher/manuais");
        }
    } catch (error) {
        console.error("❌ Erro no envio do manual:", error);
        toast.error("Erro ao enviar manual");
    }
    };


    const handleToggleStatus = async () => {
        if (!manualId) return;
        const novoStatus = status === "rascunho" ? "publicado" : "rascunho";

        try {
        const res = await fetch(`http://localhost:5000/api/manuais/${manualId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus }),
        });

        if (!res.ok) throw new Error();

        setStatus(novoStatus);
        toast.success(`Status alterado para ${novoStatus}`);
        } catch {
        toast.error("Erro ao mudar status");
        }
    };

    return (
        <div className="p-6 space-y-6">
        <Header
            title={manualId ? "Editar Manual" : "Criar Manual"}
            subtitle={manualId ? "Atualize os dados do manual" : "Adicione um novo manual"}
            rightElement={
  <div className="flex items-center gap-4">
    <div className="flex items-center gap-2">
      <span className="text-sm">{status === "publicado" ? "Publicado" : "Rascunho"}</span>
      <Switch
        checked={status === "publicado"}
        onCheckedChange={(checked) => {
          if (manualId) {
            handleToggleStatus();
          } else {
            setStatus(checked ? "publicado" : "rascunho");
          }
        }}
      />
    </div>
    <Button onClick={() => router.push("/teacher/manuais")}>Voltar</Button>
  </div>
}

        />

        <Form {...methods}>
    <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <CustomFormField name="titulo" label="Título" placeholder="Ex: Manual de Python" />
        <CustomFormField name="descricao" label="Descrição" placeholder="Breve descrição..." />

        <div className="space-y-2">
        <label className="text-sm font-medium text-[#4FA6A8]">Capa do Manual (Imagem, opcional) </label>
        <input
            type="file"
            accept="image/*"
            onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
                setImagemCapaFile(e.target.files[0]);
            }
            }}
            className="block w-full border p-2 rounded"
        />
        </div>

        <label className="flex items-center space-x-2">
        <input
            type="checkbox"
            checked={useFileUpload}
            onChange={() => setUseFileUpload(!useFileUpload)}
        />
<span className="text-[#025E69]">Enviar arquivo PDF do computador</span>
        </label>

        {useFileUpload ? (
        <input
    name="arquivo_pdf"
    type="file"
    accept="application/pdf"
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
