"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCarousel } from "@/hooks/useCarousel";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [currentSection, setCurrentSection] = useState(0);
  const currentImage = useCarousel({ totalImages: 3 });
  //const { data: cursos, isLoading, isError} = useGetCoursesQuery({});
  //console.log("cursos:", cursos);

  // Alternar entre cursos e manuais
  const handleNext = () => setCurrentSection((prev) => (prev + 1) % sections.length);
  const handlePrev = () => setCurrentSection((prev) => (prev === 0 ? sections.length - 1 : prev - 1));

  // Função para criar um novo dado na tabela "teste"
  const handleCreateTest = async () => {
    try {
      const response = await fetch("http://localhost:5000/testeinserir", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: "João Silva",
          idade: 25,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao criar o dado");
      }
  
      const data = await response.json();
      console.log("Dado criado:", data);
      alert("Dado criado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar o dado");
    }
  };
  

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
        <h2 className="landing__featured-title">Featured Courses</h2>
        <p className="landing__featured-description">
          From beginner to advanced, in all industries, we have the right
          courses just for you and preparing your entire journey for learning
          and making the most.
        </p>

        <div className="landing__tags">
          {["web development", "enterprise IT", "react nextjs", "javascript", "backend development"].map((tag, index) => (
            <span key={index} className="landing__tag">{tag}</span>
          ))}
        </div>

        {/* BOTÃO PARA CRIAR DADO NA TABELA TESTE */}
        <button onClick={handleCreateTest} className="landing__cta-button">
          Criar Teste
        </button>
      </div>

      <div className="landing__courses"></div>
    </motion.div>
  );
};

export default Landing;
