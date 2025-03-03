import { Request, Response } from "express";
import Curso from "../models/cursomodels.js"; // Importa o modelo atualizado

export const listarCursos = async (req: Request, res: Response): Promise<void> => {
    const { categoria } = req.query; // Nome correto da coluna no PostgreSQL

    try {
        let whereClause = {};

        if (categoria && categoria !== "all") {
            whereClause = { categoria }; // Ajustado para "categoria"
        }

        const cursos = await Curso.findAll({ where: whereClause });

        res.json({ message: "Cursos devolvidos", data: cursos });
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ message: "Erro ao buscar cursos", error });
    }
};

export const getCurso = async (req: Request, res: Response): Promise<void> => {
    const { cursoid } = req.params; // Nome correto da coluna no PostgreSQL
  
    try {
      const curso = await Curso.findByPk(cursoid); // Busca pelo ID usando Sequelize
  
      if (!curso) {
        res.status(404).json({ message: "Curso não encontrado" });
        return;
      }
  
      res.json({ message: "Curso encontrado com sucesso", data: curso });
    } catch (error) {
      console.error("Erro ao buscar o curso:", error);
      res.status(500).json({ message: "Erro ao buscar o curso", error });
    }
  };