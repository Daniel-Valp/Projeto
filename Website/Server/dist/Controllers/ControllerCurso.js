import { Curso, Secao, Capitulo } from "../models/cursomodels.js"; // Importação nomeada
// 📌 Função para listar cursos (permanece igual)
export const listarCursos = async (req, res) => {
    const { categoria } = req.query;
    try {
        let whereClause = {};
        if (categoria && categoria !== "all") {
            whereClause = { categoria };
        }
        const cursos = await Curso.findAll({ where: whereClause });
        res.json({ message: "Cursos devolvidos", data: cursos });
    }
    catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ message: "Erro ao buscar cursos", error });
    }
};
// 📌 Função para buscar um curso específico com suas seções e capítulos
export const getCursos = async (req, res) => {
    try {
        const cursos = await Curso.findAll({
            include: [
                {
                    model: Secao,
                    as: "secoes",
                    required: false, // Inclui cursos mesmo que não tenham seções
                    include: [
                        {
                            model: Capitulo,
                            as: "capitulos",
                            required: false, // Inclui seções mesmo que não tenham capítulos
                        },
                    ],
                },
            ],
        });
        res.json({ message: "Cursos devolvidos", data: cursos });
    }
    catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ message: "Erro ao buscar cursos", error });
    }
};
