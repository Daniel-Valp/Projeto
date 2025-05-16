import { Request, Response } from "express";
import sequelize from "../db.js"; // ajuste o caminho conforme seu projeto

export const getCourseStats = async (req: Request, res: Response) => {
  try {
    const [totalCursos, _metadata] = await sequelize.query(`
      SELECT COUNT(*) as total FROM courses
    `) as [{ total: string }[], unknown];

    const [porCategoria, _metadata1] = await sequelize.query(`
      SELECT categoria_id, COUNT(*) as total
      FROM courses
      GROUP BY categoria_id
    `) as [{ categoria_id: string; total: string }[], unknown];

    const [porNivel, _metadata2] = await sequelize.query(`
      SELECT nivel, COUNT(*) as total
      FROM courses
      GROUP BY nivel
    `) as [{ nivel: string; total: string }[], unknown];

    const total = parseInt(totalCursos[0]?.total || "0");

    const categoriasFormatadas = porCategoria.map(c => ({
      categoria_id: c.categoria_id,
      total: parseInt(c.total),
    }));

    const niveisFormatados = porNivel.map(n => ({
      nivel: n.nivel,
      total: parseInt(n.total),
    }));

    return res.json({
      totalCursos: total,
      cursosPorCategoria: categoriasFormatadas,
      cursosPorNivel: niveisFormatados,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas dos cursos:", error);
    return res.status(500).json({ error: "Erro ao buscar dados" });
  }
};
