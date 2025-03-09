import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";

// Importando os tipos que você forneceu
import { AccordionSecoes, Secção, capitulo } from "@/types/Secçõestipo"; // Substitua pelo caminho correto

// Adaptando o componente para usar os tipos fornecidos
const AccordionSections: React.FC<AccordionSecoes> = ({ sections }) => {
  if (!Array.isArray(sections) || sections.length === 0) {
    return <p className="text-gray-500">Nenhuma seção disponível.</p>;
  }

  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section: Secção) => (
        <AccordionItem
          key={section.seccaoId}
          value={section.seccaoTitle}
          className="accordion-section"
        >
          <AccordionTrigger className="accordion-section__trigger">
            <h5 className="accordion-section__title">{section.seccaoTitle}</h5>
          </AccordionTrigger>
          <AccordionContent className="accordion-section__content">
            {/* Verificar se há capítulos nesta seção */}
            {section.capitulos && section.capitulos.length > 0 ? (
              <ul>
                {section.capitulos.map((chapter: capitulo) => (
                  <li
                    key={chapter.capituloId}
                    className="accordion-section__chapter flex items-center"
                  >
                    <FileText className="mr-2 w-4 h-4" />
                    <span className="text-sm">{chapter.capitulotitulo}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400 text-sm">Nenhum capítulo nesta seção.</p>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default AccordionSections;
