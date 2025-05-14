import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Curso } from "@/types/Cursotipos"; // Importa o tipo certo

interface CourseCardProps {
  course: Curso;
  onGoToCourse: (course: Curso) => void;
}

const CourseCard = ({ course, onGoToCourse }: CourseCardProps) => {
  return (
    <Card className="course-card group" onClick={() => onGoToCourse(course)}>
      <CardHeader className="course-card__header">
      <Image
  src={
    course.imagem
      ? course.imagem.startsWith("http")
        ? course.imagem
        : `http://localhost:5000/uploads/${course.imagem}`
      : "/placeholder.png"
  }
  alt={course.titulo}
  width={400}
  height={350}
  className="course-card__image object-cover rounded-md"
  priority
  unoptimized
/>

      </CardHeader>
      <CardContent className="course-card__content">
        <CardTitle className="course-card__title">
          {course.titulo}: {course.descricao}
        </CardTitle>

        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6">
            <AvatarImage alt={course.professornome} />
            <AvatarFallback className="bg-secondary-700 text-black">
              {course.professornome?.[0]}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm text-customgreys-dirtyGrey">
            {course.professornome}
          </p>
        </div>

        <CardFooter className="course-card__footer">
          <div className="course-card__category">
            {course.categoria?.nome || "Sem categoria"}
          </div>
          <span className="course-card__price">
            {/* Só exibe se tiver um campo de preço */}
          </span>
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
