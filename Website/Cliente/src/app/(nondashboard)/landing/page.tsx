"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCarousel } from "@/hooks/useCarousel";

const sections = [
  {
    id: "cursos",
    title: "Cursos",
    description: "Isto é uma lista dos cursos que podes participar. Cursos profissionais a tua disposição.",
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
    title: "Videos",
    description: "Aqui encontras manuais úteis para expandir o teu conhecimento e aprender ao teu ritmo.",
    buttonText: "Explorar manuais",
    images: ["/images/manual1.jpg", "/images/manual2.jpg", "/images/manual3.jpg"],
  },
];

const Landing = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const currentImage = useCarousel({ totalImages: 3});

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
      <div style={{
            display: "flex",
            justifyContent: "space-between",
            position: "absolute",
            top: "50%",
            left: "10%",
            right: "10%",
            transform: "translateY(-50%)",
        }} className="landing__arrows">
        <button  className="landing__arrow-button left" onClick={handlePrev} >
          <ArrowLeft size={32} />
        </button>
        <button className="landing__arrow-button right" onClick={handleNext} >
          <ArrowRight size={32} />
        </button>
      </div>

      <div className="landing__hero-container">
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
                     key={src}
                     src={src}
                     alt={'hero banner ${index + 1}'}
                     fill
                     priority={index === currentImage }
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                     className={`landing__hero-image ${
                        index === currentImage ? "landing__hero-image--active": ""
                        }`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* PARTE FIXA */}
      <div className="landing__featured">
        <h2 className="landing__featured-title">Cursos mais vistos</h2>
        <p className="landing__feature-description">De iniciante para profissionais, aqui encontra todo o tipo de cursos.</p>
      </div>
      
    </motion.div>
  );
};

export default Landing;
