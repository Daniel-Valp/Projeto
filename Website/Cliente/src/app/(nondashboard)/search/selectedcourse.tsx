"use client";

import { Button } from "@/components/ui/button";
import { CursoSelecionado } from "@/types/Cursotipos";
import { useRouter } from "next/navigation";
import AccordionSections from "@/components/AcordionSections";

const SelectedCourse = ({ Curso }: CursoSelecionado) => {
  const router = useRouter();
  const firstCapituloId = Curso.secoes?.[0]?.capitulos?.[0]?.capituloid;

  const handleStartCourse = async () => {
    if (!Curso.cursoid || !firstCapituloId) {
      alert("Capítulo inicial não encontrado.");
      return;
    }

    try {
      await fetch(`http://localhost:5000/cursos/${Curso.cursoid}/enlistar`, {
        method: "POST",
      });

      router.push(`/user/courses/${Curso.cursoid}/chapters/${firstCapituloId}`);
    } catch (error) {
      console.error("❌ Erro ao iniciar o curso:", error);
      alert("Erro ao iniciar o curso.");
    }
  };

  return (
    <div
      className="selected-course"
      style={{ padding: "2.25rem", overflow: "hidden" }}
    >
      <div>
        <h3
          style={{
            fontWeight: 600,
            fontSize: "1.875rem",
            color: "#F3F7F5",
            lineHeight: "2.2rem", // <--- adiciona isto

          }}
        >
          {Curso.titulo}
        </h3>
        <p
          style={{
            fontSize: "0.875rem",
            paddingTop: "0.75rem",
            color: "#4FA6A8",
          }}
        >
          Criado por {Curso.professornome} |{" "}
          <span style={{ fontWeight: 700, color: "#4FA6A8" }}>
            {Curso?.enlistados}
          </span>
        </p>
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        <p style={{ color: "#F3F7F5", marginBottom: "1rem" }}>{Curso.descricao}</p>

        <div style={{ marginTop: "1.5rem" }}>
          <h4
            style={{
              fontWeight: 600,
              color: "#F3F7F5",
              marginBottom: "0.5rem",
            }}
          >
            Conteúdo do curso
          </h4>
          <AccordionSections sections={Curso.secoes} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.25rem",
          }}
        >
          <Button
  onClick={handleStartCourse}
    className="bg-[#4FA6A8] hover:bg-[#025E69] color:#FFFFF "

>
  Iniciar
</Button>

        </div>
      </div>
    </div>
  );
};

export default SelectedCourse;
