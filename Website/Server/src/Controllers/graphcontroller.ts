import { RequestHandler } from "express";
import sequelize from "../db";

export const getCourseStats: RequestHandler = async (req, res) => {
  try {
    const [totalCursos] = await sequelize.query(`
      SELECT COUNT(*) as total FROM curso
    `) as [{ total: string }[], unknown];

    const [porCategoria] = await sequelize.query(`
        SELECT c.nome, COUNT(*) as total
        FROM curso cu
        JOIN categorias c ON cu.categoria_id = c.id
        GROUP BY c.nome
      `) as [{ nome: string; total: string }[], unknown];
      

    const [porNivel] = await sequelize.query(`
      SELECT nivel, COUNT(*) as total
      FROM curso
      GROUP BY nivel
    `) as [{ nivel: string; total: string }[], unknown];

    const [porSubcategoria] = await sequelize.query(`
        SELECT s.nome, COUNT(*) as total
        FROM curso cu
        JOIN subcategoria s ON cu.subcategoriaid = s.subcategoriaid
        GROUP BY s.nome
      `) as [{ nome: string; total: string }[], unknown];
      
      const subcategoriasFormatadas = porSubcategoria.map(s => ({
        nome: s.nome,
        total: parseInt(s.total),
      }));
      

    const total = parseInt(totalCursos[0]?.total || "0");

    const categoriasFormatadas = porCategoria.map(c => ({
        nome: c.nome,
        total: parseInt(c.total),
      }));
      

    const niveisFormatados = porNivel.map(n => ({
      nivel: n.nivel,
      total: parseInt(n.total),
    }));

    res.json({
      totalCursos: total,
      cursosPorCategoria: categoriasFormatadas,
      cursosPorNivel: niveisFormatados,
      cursosPorSubcategoria: subcategoriasFormatadas, // 👈 novo campo!
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas dos cursos:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
};
