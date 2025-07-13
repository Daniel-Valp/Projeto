"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Form } from "@/components/ui/form";
import { CustomFormField } from "@/components/CustomFormField";
import { CustomNumberField } from "@/components/CustomNumberField";
import { useUser } from "@clerk/nextjs";

type QuizFormData = {
  titulo: string;
  descricao: string;
  categoria: string;
  subcategoria: string;
  perguntas: {
    enunciado: string;
    alternativas: string[];
    correta: number;
  }[];
};

const quizSchema = z.object({
  titulo: z.string().min(3, "Título é obrigatório"),
  descricao: z.string().min(10, "Descrição é obrigatória"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  subcategoria: z.string().min(1, "Serviço é obrigatória"),
  perguntas: z
    .array(
      z.object({
        enunciado: z.string().min(5, "Enunciado obrigatório"),
        alternativas: z
          .array(z.string().min(1, "Alternativa obrigatória"))
          .length(4, "Deve haver 4 alternativas"),
        correta: z.number().min(1).max(4),
      })
    )
    .min(1, "Adicione pelo menos uma pergunta"),
});

export default function CreateQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [categorias, setCategorias] = useState<any[]>([]);
  const [subcategorias, setSubcategorias] = useState<any[]>([]);
  const [status, setStatus] = useState<"rascunho" | "publicado">("rascunho");

  const [loading, setLoading] = useState(true);


  const methods = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      titulo: "",
      descricao: "",
      categoria: "",
      subcategoria: "",
      perguntas: [
        {
          enunciado: "",
          alternativas: ["", "", "", ""],
          correta: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "perguntas",
  });

  const { user } = useUser();

  // Buscar categorias e subcategorias
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
        toast.error("Erro ao carregar categorias/subcategorias");
      }
    };
    fetchData();
  }, []);

  // Carregar quiz para edição
useEffect(() => {
  const fetchQuiz = async () => {
    if (!id) return;

    try {
      const res = await fetch(`http://localhost:5000/api/quizzes/${id}`);
      const data = await res.json();

      const perguntas = data.perguntas.map((p: any) => {
        const alternativas = [p.resposta_a, p.resposta_b, p.resposta_c, p.resposta_d];
        const corretaIndex = ["A", "B", "C", "D"].indexOf(p.resposta_correta);
        return {
          enunciado: p.pergunta,
          alternativas,
          correta: corretaIndex + 1,
        };
      });

      methods.reset({
        titulo: data.titulo,
        descricao: data.descricao,
        categoria: String(data.categoria_id),
        subcategoria: String(data.subcategoria_id),
        perguntas,
      });

      setStatus(data.status || "rascunho");
    } catch (error) {
      console.error("Erro ao carregar quiz:", error);
      toast.error("Erro ao carregar dados do quiz");
    } finally {
      setLoading(false);
    }
  };

  fetchQuiz();
}, [id, methods]);



  // Criar ou atualizar quiz
  const onSubmit = async (data: QuizFormData) => {
    const isValid = await methods.trigger();
    if (!isValid) {
      toast.error("Formulário inválido");
      return;
    }

    const perguntasTransformadas = data.perguntas.map((p) => {
      const letraCorreta = ["A", "B", "C", "D"][p.correta - 1];
      return {
        pergunta: p.enunciado,
        resposta_a: p.alternativas[0],
        resposta_b: p.alternativas[1],
        resposta_c: p.alternativas[2],
        resposta_d: p.alternativas[3],
        resposta_correta: letraCorreta,
      };
    });

    const professorEmail = user?.emailAddresses?.[0]?.emailAddress;
    if (!professorEmail) {
      toast.error("Erro: e-mail do professor não encontrado.");
      return;
    }

    const payload = {
      titulo: data.titulo,
      descricao: data.descricao,
      categoria_id: data.categoria,
      subcategoria_id: Number(data.subcategoria),
      perguntas: perguntasTransformadas,
      status,
      professor_email: professorEmail,
    };

    try {
      const res = await fetch(
        `http://localhost:5000/api/quizzes${id ? `/${id}` : ""}`,
        {
          method: id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Falha ao salvar quiz");

      toast.success(id ? "Quiz atualizado com sucesso!" : "Quiz criado com sucesso!");
      router.push("/teacher/quizz");
    } catch (err) {
      toast.error("Erro ao salvar quiz");
      console.error(err);
    }
  };
  if (id && loading) {
  return (
    <div className="p-6">
      <p className="text-center text-muted-foreground text-sm">
        A carregar quiz...
      </p>
    </div>
  );
}

  return (
    <div className="p-6 space-y-6">
      <Header
        title={id ? "Editar Quiz" : "Criar Quiz"}
        subtitle={id ? "Altere os dados do quiz" : "Adicione um novo quiz com perguntas"}
        rightElement={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">{status}</span>
<div className="flex items-center gap-2">
  <Switch
    checked={status === "publicado"}
    onCheckedChange={(checked) =>
      setStatus(checked ? "publicado" : "rascunho")
    }
  />
  <span className="text-black font-medium">
    {status === "publicado" ? "Publicado" : "Rascunho"}
  </span>
</div>










            </div>
            <Button onClick={() => router.push("/teacher/quizz")}>
              Voltar
            </Button>
          </div>
        }
      />

      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
<CustomFormField
  name="titulo"
  label="Título"
  placeholder="Ex: Quiz de HTML básico"
  inputClassName="text-[#F3F7F5]" // 👈 muda a cor do texto
/>
          <CustomFormField name="descricao" label="Descrição" placeholder="Descrição do quiz" />

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
  name="subcategoria" // ✅ Corrigido
  label="Serviço"
  type="select"
  options={subcategorias.map((sub) => ({
    value: String(sub.subcategoriaid),
    label: sub.nome,
  }))}
/>


          <div className="space-y-4">
<h3 className="text-lg font-semibold text-[#025E69]">Perguntas</h3>

            {fields.map((field, index) => (
              <div key={field.id} className="border rounded p-4 space-y-4 bg-muted/20">
                <CustomFormField
                  name={`perguntas.${index}.enunciado`}
                  label={`Pergunta ${index + 1}`}
                  placeholder="Digite o enunciado da pergunta"
                />

                {[0, 1, 2, 3].map((i) => (
                  <CustomFormField
                    key={i}
                    name={`perguntas.${index}.alternativas.${i}`}
                    label={`Alternativa ${i + 1}`}
                    placeholder={`Texto da alternativa ${i + 1}`}
                  />
                ))}

<CustomNumberField
  name={`perguntas.${index}.correta`}
  label="Alternativa Correta"
  placeholder="Número de 1 a 4"
  inputClassName="text-[#F3F7F5] bg-[#25262f]"
/>

                <div className="text-right">
                  <Button type="button" variant="destructive" onClick={() => {
  try {
    if (index >= 0 && index < fields.length) {
  remove(index);
}
  } catch (e) {
    console.error("Erro ao remover pergunta:", e);
  }
}}>
  Remover Pergunta
</Button>

                </div>
              </div>
            ))}

            <Button
              type="button"
              onClick={() =>
                append({
                  enunciado: "",
                  alternativas: ["", "", "", ""],
                  correta: 1,
                })
              }
            >
              + Adicionar Pergunta
            </Button>
          </div>

          <Button type="submit" className="w-full">
            {id ? "Atualizar Quiz" : "Criar Quiz"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
