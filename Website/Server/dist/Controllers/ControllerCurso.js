import { Curso, Secao, Capitulo } from "../models/cursomodels.js"; // Importação nomeada
// 📌 Função para listar TODOS os cursos com suas seções e capítulos
export const listarCursos = async (req, res) => {
    const { categoria } = req.query;
    try {
        let whereClause = {};
        if (categoria && categoria !== "all") {
            whereClause = { categoria };
        }
        const cursos = await Curso.findAll({
            where: whereClause,
            include: [
                {
                    model: Secao,
                    as: "secoes",
                    include: [
                        {
                            model: Capitulo,
                            as: "capitulos",
                        },
                    ],
                },
            ],
        });
        res.json({ message: "Lista de cursos completa", data: cursos });
    }
    catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ message: "Erro ao buscar cursos", error });
    }
};
// 📌 Função para buscar UM curso pelo ID (completo)
export const getCursoPorId = async (req, res) => {
    const { id } = req.params;
    console.log("🔍 ID recebido:", id); // 👀 Verifica se o ID está correto
    if (!id) {
        res.status(400).json({ message: "ID do curso não fornecido" });
        return;
    }
    try {
        const curso = await Curso.findOne({
            where: { cursoid: id }, // Verifica se cursoid é a chave correta
            include: [
                {
                    model: Secao,
                    as: "secoes",
                    include: [
                        {
                            model: Capitulo,
                            as: "capitulos",
                        },
                    ],
                },
            ],
        });
        if (!curso) {
            res.status(404).json({ message: "Curso não encontrado" });
            return;
        }
        res.json({ message: "Curso encontrado", data: curso });
    }
    catch (error) {
        console.error("❌ Erro ao buscar curso:", error);
        res.status(500).json({ message: "Erro ao buscar curso", error });
    }
};
