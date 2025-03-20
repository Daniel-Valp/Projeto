"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { useCarousel } from "@/hooks/useCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCursosQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import Coursecardsearch from "@/components/Coursecardsearch";
import { useUser } from "@clerk/nextjs";
import AppSidebar from "@/components/AppSidebar";

const LoadingSkeleton = () => {
  return (
    <div className="landing-skeleton">
      <div className="landing-skeleton__hero">
        <div className="landing-skeleton__hero-content">
          <Skeleton className="landing-skeleton__title" />
          <Skeleton className="landing-skeleton__subtitle" />
          <Skeleton className="landing-skeleton__subtitle-secondary" />
          <Skeleton className="landing-skeleton__button" />
        </div>
        <Skeleton className="landing-skeleton__hero-image" />
      </div>

      <div className="landing-skeleton__featured">
        <Skeleton className="landing-skeleton__featured-title" />
        <Skeleton className="landing-skeleton__featured-description" />

        <div className="landing-skeleton__tags">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Skeleton key={index} className="landing-skeleton__tag" />
          ))}
        </div>

        <div className="landing-skeleton__courses">
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} className="landing-skeleton__course-card" />
          ))}
        </div>
      </div>
    </div>
  );
};

const sections = [
  {
    id: "cursos",
    title: "Cursos",
    description: "Isto é uma lista dos cursos que podes participar. Cursos profissionais à tua disposição.",
    buttonText: "Procurar mais cursos",
    images: ["/images/hero1.jpg", "/images/hero2.jpg", "/images/hero3.jpg"],
  },
  {
    id: "manuais",
    title: "Manuais",
    description: "Aqui encontras manuais úteis para expandir o teu conhecimento e aprender ao teu ritmo.",
    buttonText: "Explorar manuais",
    images: ["/images/manual1.jpg", "/images/manual2.jpg", "/images/manual3.jpg"],
  },
  {
    id: "videos",
    title: "Vídeos",
    description: "Descobre vídeos educativos para aprofundar os teus conhecimentos.",
    buttonText: "Ver vídeos",
    images: ["/images/video1.jpg", "/images/video2.jpg", "/images/video3.jpg"],
  },
];

const Landing = () => {
  const { user } = useUser();
  //console.log("user:", user);
  const [currentSection, setCurrentSection] = useState(0);
  const currentImage = useCarousel({ totalImages: 3 });
  const { data: cursos, isLoading, isError } = useGetCursosQuery({});
  const [curso, setCurso] = useState<any>(null); // Pode ser ajustado para o tipo correto do seu curso


  const router = useRouter();
  const handleCourseClick = (cursoid: string) => {
    router.push(`/search?id=${cursoid}`);
  };
  
  useEffect(() => {
    const fetchCurso = async () => {
      try {
        const response = await fetch("http://localhost:5000/cursos/11c31a9d-6dd4-46f4-8728-64ac512dded7");
        const data = await response.json();
        console.log("Dados do curso:", data); // Apenas exibe os dados no console
        setCurso(data.data); // Supondo que 'data.data' contém os dados do curso
      } catch (error) {
        console.error("Erro ao buscar curso:", error);
      }
    };

    fetchCurso();
  }, []); // Executar apenas uma vez quando o componente for montado
  
  // Alternar entre cursos e manuais
  const handleNext = () => setCurrentSection((prev) => (prev + 1) % sections.length);
  const handlePrev = () => setCurrentSection((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
  

  // Configuração da animação
  const slideVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    animate: { x: "0%", opacity: 1, transition: { duration: 0.5 } },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  };

  return (
    
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="landing">
      {/* Setas de navegação */}
      <div className="landing__hero-container" style={{ position: "relative" }}>
        <div className="landing__arrows" style={{
          display: "flex",
          justifyContent: "space-between",
          position: "absolute",
          top: "46%",
          left: "1%",
          right: "1%",
          zIndex: 10,
        }}>
          <button className="landing__arrow-button left" onClick={handlePrev}>
            <ArrowLeft size={32} />
          </button>
          <button className="landing__arrow-button right" onClick={handleNext}>
            <ArrowRight size={32} />
          </button>
        </div>

        <AnimatePresence custom={currentSection} mode="wait">
          <motion.div
            key={sections[currentSection].id}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            custom={currentSection}
            className="landing__hero"
          >
            <div className="landing__hero-content">
              <h1 className="landing__title">{sections[currentSection].title}</h1>
              <p className="landing__description">{sections[currentSection].description}</p>
              <div className="landing__cta">
                <Link href="/search">
                  <div className="landing__cta-button">{sections[currentSection].buttonText}</div>
                </Link>
              </div>
            </div>

            <div className="landing__hero-images">
              {sections[currentSection].images.map((src, index) => (
                <div key={src} className="landing__hero-image-wrapper">
                  <Image
                    src={src}
                    alt={`hero banner ${index + 1}`}
                    fill
                    priority={index === currentImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`landing__hero-image ${index === currentImage ? "landing__hero-image--active" : ""}`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Seção de cursos e botão de criação de teste */}
      <div className="landing__featured">
        <h2 className="landing__featured-title">Ultimos cursos</h2>
        <p className="landing__featured-description">
          Desde iniciante a profissional aqui podes encontrar todo o tipo de cursos que te ajudam no dia a dia na vida da informatica.
        </p>

        <div className="landing__tags">
          {["Desenvolvimento web", "Empresas IT", "Segurança na internet", "Criação", "Aprendizagem informatica"].map((tag, index) => (
            <span key={index} className="landing__tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="landing__courses">
  {cursos &&
    cursos.slice(0, 4).map((curso, index) => (
      <motion.div
        key={curso.cursoid}
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
        viewport={{ amount: 0.4 }}
        onClick={() => handleCourseClick(curso.cursoid)} // ✅ Agora o clique no card leva à página do curso
        className="cursor-pointer" // 🔥 Adiciona um cursor de "clique"
      >
        <Coursecardsearch curso={curso} />
      </motion.div>
    ))}
</div>

    </motion.div>
  );
};

export default Landing;



