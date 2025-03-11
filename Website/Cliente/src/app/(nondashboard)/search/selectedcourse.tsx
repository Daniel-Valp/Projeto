import { Button } from '@/components/ui/button';
import { CursoSelecionado } from '@/types/Cursotipos';
import React from 'react';
import AccordionSections from "@/components/AcordionSections"; // Corrigido import para o nome correto

const SelectedCourse = ({ Curso, handleEnrollNow }: CursoSelecionado) => {
  // Console log para verificar os dados
  console.log("Curso completo recebido:", Curso);
  console.log("Seções do curso:", Curso.secoes ? Curso.secoes : "Nenhuma seção carregada");
  

  

  return (
    <div className='selected-course'>
        <div>
            <h3 className='selected-course__title'>{Curso.titulo}</h3>
            <p className='selected-course__author'>
                Criado por {Curso.professornome} | {" "}
                <span className='selected-course__enrollment-count'>
                    {Curso?.enlistados?.length}
                </span>
            </p>
        </div>

        <div className='selected-course__content'>
            <p className='selected-course__description'>{Curso.descricao}</p>

            <div className='selected-course__sections'>
                <h4 className='selected-course__sections-title'>Conteúdo do curso</h4>
                {/* Passando as seções para o Accordion */}
                <AccordionSections sections={Curso.secoes} />
            </div>

            <div className='selected-course__footer'>
                <Button
                onClick={() => handleEnrollNow(Curso.cursoid)}
                className='bg-primary-700 hover:bg-primary-600'
                >
                    Iniciar
                </Button>
            </div>
        </div>
    </div>
  );
};

export default SelectedCourse;
