import { Button } from '@/components/ui/button'
import { useGetCursosQuery } from '@/state/api'
import { CursoSelecionado } from '@/types/Cursotipos'
import React from 'react'
import AccordionSections from "@/components/AcordionSections";
 
const SelectedCourse = ({ Curso, handleEnrollNow}: CursoSelecionado) => {
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
                <h4 className='selected-course__sections-title'>Conteudo do curso</h4>
                <AccordionSections sections={Curso.secao} />
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
  )
}

export default SelectedCourse