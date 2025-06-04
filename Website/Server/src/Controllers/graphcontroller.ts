import { RequestHandler } from "express";
import sequelize from "../db";

export const getContentStats: RequestHandler = async (req, res) => {
  try {
    // Total cursos
    const [totalCursos] = await sequelize.query(`SELECT COUNT(*) as total FROM curso`) as [{ total: string }[], unknown];

    // Cursos por categoria
    const [cursosPorCategoria] = await sequelize.query(`
      SELECT c.nome, COUNT(*) as total
      FROM curso cu
      JOIN categorias c ON cu.categoria_id = c.id
      GROUP BY c.nome
    `) as [{ nome: string; total: string }[], unknown];

    // Cursos por subcategoria
    const [cursosPorSubcategoria] = await sequelize.query(`
      SELECT s.nome, COUNT(*) as total
      FROM curso cu
      JOIN subcategoria s ON cu.subcategoriaid = s.subcategoriaid
      GROUP BY s.nome
    `) as [{ nome: string; total: string }[], unknown];

    // Total quizzes
    const [totalQuizzes] = await sequelize.query(`SELECT COUNT(*) as total FROM quizzes`) as [{ total: string }[], unknown];

    // Quizzes por categoria
    const [quizzesPorCategoria] = await sequelize.query(`
      SELECT c.nome, COUNT(*) as total
      FROM quizzes q
      JOIN categorias c ON q.categoria_id = c.id
      GROUP BY c.nome
    `) as [{ nome: string; total: string }[], unknown];

    // Quizzes por subcategoria
    const [quizzesPorSubcategoria] = await sequelize.query(`
      SELECT s.nome, COUNT(*) as total
      FROM quizzes q
      JOIN subcategoria s ON q.subcategoria_id = s.subcategoriaid
      GROUP BY s.nome
    `) as [{ nome: string; total: string }[], unknown];

    // Total vídeos
    const [totalVideos] = await sequelize.query(`SELECT COUNT(*) as total FROM videos`) as [{ total: string }[], unknown];

    // Vídeos por categoria
    const [videosPorCategoria] = await sequelize.query(`
      SELECT c.nome, COUNT(*) as total
      FROM videos v
      JOIN categorias c ON v.category_id = c.id
      GROUP BY c.nome
    `) as [{ nome: string; total: string }[], unknown];

    // Vídeos por subcategoria
    const [videosPorSubcategoria] = await sequelize.query(`
      SELECT s.nome, COUNT(*) as total
      FROM videos v
      JOIN subcategoria s ON v.subcategory_id = s.subcategoriaid
      GROUP BY s.nome
    `) as [{ nome: string; total: string }[], unknown];

    // Total manuais
    const [totalManuais] = await sequelize.query(`SELECT COUNT(*) as total FROM manuais`) as [{ total: string }[], unknown];

    // Manuais por categoria
    const [manuaisPorCategoria] = await sequelize.query(`
      SELECT c.nome, COUNT(*) as total
      FROM manuais m
      JOIN categorias c ON m.categoria_id = c.id
      GROUP BY c.nome
    `) as [{ nome: string; total: string }[], unknown];

    // Manuais por subcategoria
    const [manuaisPorSubcategoria] = await sequelize.query(`
      SELECT s.nome, COUNT(*) as total
      FROM manuais m
      JOIN subcategoria s ON m.subcategoria_id = s.subcategoriaid
      GROUP BY s.nome
    `) as [{ nome: string; total: string }[], unknown];

    // Conteúdos por tipo (total)
    const conteudosPorTipo = [
      { type: "Curso", count: parseInt(totalCursos[0]?.total || "0") },
      { type: "Quiz", count: parseInt(totalQuizzes[0]?.total || "0") },
      { type: "Vídeo", count: parseInt(totalVideos[0]?.total || "0") },
      { type: "Manual", count: parseInt(totalManuais[0]?.total || "0") },
    ];

    // Total geral
    const totalConteudos = conteudosPorTipo.reduce((acc, cur) => acc + cur.count, 0);

    // Conteúdos por categoria geral (todos juntos)
    // Você pode ajustar essa query para agrupar os 4 tipos juntos, mas aqui só vamos somar categorias de cursos para simplificar.
    // Se quiser a soma por categoria geral, teria que juntar as tabelas via UNION (mais complexo).
    // Aqui vamos retornar só categorias de cursos para a aba "conteúdos por categoria" como estava.

    const conteudosPorCategoria = cursosPorCategoria.map(c => ({
      type: c.nome,
      count: parseInt(c.total),
    }));

    // Formata todos os arrays para number
    const formatData = (arr: { nome: string; total: string }[]) =>
      arr.map((item) => ({ type: item.nome, count: parseInt(item.total) }));

    res.json({
      totalConteudos,
      conteudosPorTipo,
      conteudosPorCategoria,

      cursosPorCategoria: formatData(cursosPorCategoria),
      cursosPorSubcategoria: formatData(cursosPorSubcategoria),

      quizzesPorCategoria: formatData(quizzesPorCategoria),
      quizzesPorSubcategoria: formatData(quizzesPorSubcategoria),

      videosPorCategoria: formatData(videosPorCategoria),
      videosPorSubcategoria: formatData(videosPorSubcategoria),

      manuaisPorCategoria: formatData(manuaisPorCategoria),
      manuaisPorSubcategoria: formatData(manuaisPorSubcategoria),
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({ error: "Erro ao buscar dados" });
  }
};
