import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";
import { AccordionSecoes, Secao, Capitulo } from "@/types/Secçõestipo";

const AccordionSections: React.FC<AccordionSecoes> = ({ sections }) => {
  if (!sections || sections.length === 0) {
    return <p className="text-gray-500">Nenhuma seção disponível.</p>;
  }

  return (
    <Accordion type="multiple" className="w-full">
      {sections.map((section: Secao) => (
        <AccordionItem key={section.secaoid} value={section.secaotitulo}>
          <AccordionTrigger>
            <h5>{section.secaotitulo}</h5>
          </AccordionTrigger>
          <AccordionContent>
            {section.capitulos && section.capitulos.length > 0 ? (
              <ul>
                {section.capitulos.map((chapter: Capitulo) => (
                  <li key={chapter.capituloid} className="flex items-center">
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
