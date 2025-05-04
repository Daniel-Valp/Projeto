"use client";

import { Button } from "@/components/ui/button";
import { CursoSelecionado } from "@/types/Cursotipos";
import { useRouter } from "next/navigation";
import AccordionSections from "@/components/AcordionSections";

const SelectedCourse = ({ Curso }: CursoSelecionado) => {
  const router = useRouter();

  // Encontra o primeiro capítulo do curso
  const firstCapituloId = Curso.secoes?.[0]?.capitulos?.[0]?.capituloid;

  console.log("Curso recebido:", Curso); // Verificar os dados do curso

  const handleStartCourse = async () => {
    console.log("Curso ID:", Curso.cursoid);
    console.log("Primeiro capítulo ID:", firstCapituloId);

    if (!Curso.cursoid || !firstCapituloId) {
      alert("Capítulo inicial não encontrado.");
      return;
    }

    try {
      // 🔄 Faz o POST para a rota de enlistamento
      console.log("Enviando requisição para:", `/api/cursos/${Curso.cursoid}/enlistar`);
      await fetch(`http://localhost:5000/cursos/${Curso.cursoid}/enlistar`, {
        method: "POST",
      });
      
      
      


      


      // ✅ Depois de inscrito, redireciona
      console.log("Redirecionando para:", `/user/courses/${Curso.cursoid}/chapters/${firstCapituloId}`);
      router.push(`/user/courses/${Curso.cursoid}/chapters/${firstCapituloId}`);
    } catch (error) {
      console.error("❌ Erro ao iniciar o curso:", error);
      alert("Erro ao iniciar o curso.");
    }
  };

  return (
    <div className="selected-course">
      <div>
        <h3 className="selected-course__title">{Curso.titulo}</h3>
        <p className="selected-course__author">
          Criado por {Curso.professornome} |{" "}
          <span className="selected-course__enrollment-count">
            {Curso?.enlistados}
          </span>
        </p>
      </div>

      <div className="selected-course__content">
        <p className="selected-course__description">{Curso.descricao}</p>

        <div className="selected-course__sections">
          <h4 className="selected-course__sections-title">Conteúdo do curso</h4>
          <AccordionSections sections={Curso.secoes} />
        </div>

        <div className="selected-course__footer">
          <Button
            onClick={handleStartCourse}
            className="bg-primary-700 hover:bg-primary-600"
          >
            Iniciar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedCourse;
